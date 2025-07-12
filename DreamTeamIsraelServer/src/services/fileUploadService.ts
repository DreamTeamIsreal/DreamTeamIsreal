import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { FileUploadConfig } from '../types';

export class FileUploadService {
  private s3: AWS.S3;
  private bucketName: string;
  private publicUrlBase: string;

  constructor() {
    // Configure AWS
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    this.s3 = new AWS.S3();
    this.bucketName = process.env.AWS_S3_BUCKET || 'dreamteam-documents';
    this.publicUrlBase = process.env.AWS_S3_PUBLIC_URL || `https://${this.bucketName}.s3.amazonaws.com`;
  }

  /**
   * Create multer middleware for S3 uploads
   */
  createUploadMiddleware(config: {
    fileTypes: string[];
    maxSize: number;
    folder: string;
  }) {
    return multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucketName,
        acl: 'public-read',
        metadata: (req, file, cb) => {
          cb(null, {
            fieldName: file.fieldname,
            uploadedBy: req.user?.userId || 'anonymous',
            uploadedAt: new Date().toISOString()
          });
        },
        key: (req, file, cb) => {
          // Generate unique filename with original extension
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uuidv4()}.${extension}`;
          const key = `${config.folder}/${uniqueFilename}`;
          cb(null, key);
        }
      }),
      fileFilter: (req, file, cb) => {
        // Check file type
        const isValidType = config.fileTypes.includes(file.mimetype);
        if (!isValidType) {
          const error = new Error(`Invalid file type. Allowed types: ${config.fileTypes.join(', ')}`);
          (error as any).code = 'INVALID_FILE_TYPE';
          return cb(error);
        }
        cb(null, true);
      },
      limits: {
        fileSize: config.maxSize
      }
    });
  }

  /**
   * Profile image upload configuration
   */
  getProfileImageUpload() {
    return this.createUploadMiddleware({
      fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxSize: 2 * 1024 * 1024, // 2MB
      folder: 'profile-images'
    });
  }

  /**
   * Document upload configuration (for candidate documents)
   */
  getDocumentUpload() {
    return this.createUploadMiddleware({
      fileTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      maxSize: 10 * 1024 * 1024, // 10MB
      folder: 'documents'
    });
  }

  /**
   * Upload file directly (programmatic upload)
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    contentType: string,
    folder: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const extension = filename.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${extension}`;
      const key = `${folder}/${uniqueFilename}`;

      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
        Metadata: {
          originalFilename: filename,
          uploadedAt: new Date().toISOString(),
          ...metadata
        }
      };

      const result = await this.s3.upload(uploadParams).promise();
      
      logger.info('File uploaded successfully', {
        key,
        originalFilename: filename,
        size: buffer.length,
        contentType
      });

      return result.Location;

    } catch (error) {
      logger.error('File upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new Error('Invalid file URL');
      }

      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      logger.info('File deleted successfully', { key, fileUrl });

    } catch (error) {
      logger.error('File deletion failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Generate signed URL for secure access
   */
  async generateSignedUrl(
    fileUrl: string,
    expiresIn: number = 3600 // 1 hour
  ): Promise<string> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new Error('Invalid file URL');
      }

      const signedUrl = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      });

      return signedUrl;

    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        return false;
      }

      await this.s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      return true;

    } catch (error) {
      if ((error as AWS.AWSError).statusCode === 404) {
        return false;
      }
      logger.error('Error checking file existence:', error);
      throw new Error('Failed to check file existence');
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileUrl: string): Promise<{
    contentType: string;
    contentLength: number;
    lastModified: Date;
    metadata: Record<string, string>;
  }> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new Error('Invalid file URL');
      }

      const result = await this.s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      return {
        contentType: result.ContentType || 'application/octet-stream',
        contentLength: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        metadata: result.Metadata || {}
      };

    } catch (error) {
      logger.error('Error getting file metadata:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  /**
   * Validate file upload requirements for candidate documents
   */
  validateCandidateDocument(
    fileType: 'profile' | 'police_record' | 'wealth_declaration' | 'conflict_of_interest' | 'cv',
    file: Express.Multer.File
  ): { isValid: boolean; error?: string } {
    const requirements = {
      profile: {
        types: ['image/jpeg', 'image/png', 'image/jpg'],
        maxSize: 2 * 1024 * 1024, // 2MB
        description: 'Profile image (JPG/PNG, max 2MB)'
      },
      police_record: {
        types: ['application/pdf'],
        maxSize: 10 * 1024 * 1024, // 10MB
        description: 'Police record (PDF, max 10MB)'
      },
      wealth_declaration: {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 10 * 1024 * 1024, // 10MB
        description: 'Wealth declaration (PDF/DOC/DOCX, max 10MB)'
      },
      conflict_of_interest: {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 10 * 1024 * 1024, // 10MB
        description: 'Conflict of interest declaration (PDF/DOC/DOCX, max 10MB)'
      },
      cv: {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 10 * 1024 * 1024, // 10MB
        description: 'CV/Resume (PDF/DOC/DOCX, max 10MB)'
      }
    };

    const requirement = requirements[fileType];
    
    // Check file type
    if (!requirement.types.includes(file.mimetype)) {
      return {
        isValid: false,
        error: `Invalid file type for ${fileType}. ${requirement.description}`
      };
    }

    // Check file size
    if (file.size > requirement.maxSize) {
      return {
        isValid: false,
        error: `File too large for ${fileType}. ${requirement.description}`
      };
    }

    return { isValid: true };
  }

  /**
   * Extract S3 key from URL
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      // Handle different URL formats
      if (url.includes('.amazonaws.com/')) {
        // Standard S3 URL format
        return url.split('.amazonaws.com/')[1];
      } else if (url.includes(this.bucketName)) {
        // Custom domain or other formats
        const parts = url.split('/');
        const bucketIndex = parts.findIndex(part => part.includes(this.bucketName));
        if (bucketIndex !== -1 && bucketIndex < parts.length - 1) {
          return parts.slice(bucketIndex + 1).join('/');
        }
      }
      return null;
    } catch (error) {
      logger.error('Error extracting key from URL:', error);
      return null;
    }
  }

  /**
   * Cleanup orphaned files (admin function)
   */
  async cleanupOrphanedFiles(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const listParams: AWS.S3.ListObjectsV2Request = {
        Bucket: this.bucketName,
        Prefix: 'temp/' // Only cleanup temp files
      };

      const objects = await this.s3.listObjectsV2(listParams).promise();
      if (!objects.Contents) {
        return 0;
      }

      const filesToDelete = objects.Contents.filter(obj => 
        obj.LastModified && obj.LastModified < cutoffDate
      );

      if (filesToDelete.length === 0) {
        return 0;
      }

      const deleteParams: AWS.S3.DeleteObjectsRequest = {
        Bucket: this.bucketName,
        Delete: {
          Objects: filesToDelete.map(obj => ({ Key: obj.Key! }))
        }
      };

      await this.s3.deleteObjects(deleteParams).promise();
      
      logger.info('Cleanup completed', { 
        deletedFiles: filesToDelete.length,
        cutoffDate 
      });

      return filesToDelete.length;

    } catch (error) {
      logger.error('Cleanup failed:', error);
      throw new Error('Failed to cleanup orphaned files');
    }
  }
}

export const fileUploadService = new FileUploadService();