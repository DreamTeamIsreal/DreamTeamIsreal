import { Request, Response } from 'express';
import { candidateService } from '../services/candidateService';
import { textSimilarityService } from '../services/textSimilarityService';
import { fileUploadService } from '../services/fileUploadService';
import { logger } from '../utils/logger';
import { validationResult } from 'express-validator';
import { CandidateSearchParams } from '../types';

export class CandidateController {

  /**
   * Submit or update candidate profile
   */
  async submitCandidate(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.userId;
      const candidateData = req.body;

      // Validate required fields
      if (!candidateData.fullName || !candidateData.candidacyType) {
        return res.status(400).json({
          success: false,
          message: 'Full name and candidacy type are required'
        });
      }

      // Validate candidacy type
      if (!['Minister', 'Knesset Committee'].includes(candidateData.candidacyType)) {
        return res.status(400).json({
          success: false,
          message: 'Candidacy type must be "Minister" or "Knesset Committee"'
        });
      }

      // Validate position/committee selection
      if (candidateData.candidacyType === 'Minister' && !candidateData.desiredPosition) {
        return res.status(400).json({
          success: false,
          message: 'Desired position is required for Minister candidacy'
        });
      }

      if (candidateData.candidacyType === 'Knesset Committee' && !candidateData.desiredCommittee) {
        return res.status(400).json({
          success: false,
          message: 'Desired committee is required for Knesset Committee candidacy'
        });
      }

      const candidateId = await candidateService.submitCandidate(userId, candidateData);

      res.json({
        success: true,
        message: 'Candidate profile submitted successfully',
        data: {
          candidateId
        }
      });

    } catch (error) {
      logger.error('Error submitting candidate:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit candidate'
      });
    }
  }

  /**
   * Get user's own candidate profile
   */
  async getMyProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const candidate = await candidateService.getCandidateByUserId(userId);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'No candidate profile found'
        });
      }

      res.json({
        success: true,
        data: candidate
      });

    } catch (error) {
      logger.error('Error fetching candidate profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch candidate profile'
      });
    }
  }

  /**
   * Get public candidate profile by ID
   */
  async getCandidateProfile(req: Request, res: Response) {
    try {
      const { candidateId } = req.params;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
      }

      const candidate = await candidateService.getCandidateById(candidateId);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }

      // Return public profile (exclude sensitive fields)
      const publicProfile = {
        id: candidate.id,
        candidacyType: candidate.candidacyType,
        profileImageUrl: candidate.profileImageUrl,
        fullName: candidate.fullName,
        desiredPosition: candidate.desiredPosition,
        desiredCommittee: candidate.desiredCommittee,
        professionalExperience: candidate.professionalExperience,
        education: candidate.education,
        personalVision: candidate.personalVision,
        fiveYearPlan: candidate.fiveYearPlan,
        longTermVision2048: candidate.longTermVision2048,
        detailedAnnualPlan: candidate.detailedAnnualPlan,
        visionAndWorkPlanInCommittee: candidate.visionAndWorkPlanInCommittee,
        introductionVideoLink: candidate.introductionVideoLink,
        additionalDebateQuestion: candidate.additionalDebateQuestion,
        numberOfVotes: candidate.numberOfVotes,
        numberOfSupporters: candidate.numberOfSupporters,
        city: candidate.city,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt
      };

      res.json({
        success: true,
        data: publicProfile
      });

    } catch (error) {
      logger.error('Error fetching candidate profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch candidate profile'
      });
    }
  }

  /**
   * Search public candidates
   */
  async searchCandidates(req: Request, res: Response) {
    try {
      const searchParams: CandidateSearchParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 20, 100),
        search: req.query.search as string,
        district: req.query.district as string,
        position: req.query.position as string,
        candidacyType: req.query.candidacyType as 'Minister' | 'Knesset Committee'
      };

      // Validate parameters
      if (searchParams.page < 1) searchParams.page = 1;
      if (searchParams.limit < 1) searchParams.limit = 20;

      const voterId = req.user?.userId; // Optional for anonymous access
      const result = await candidateService.getPublicCandidates(searchParams, voterId);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      logger.error('Error searching candidates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search candidates'
      });
    }
  }

  /**
   * Support a candidate
   */
  async supportCandidate(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { candidateId } = req.params;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
      }

      await candidateService.supportCandidate(userId, candidateId);

      res.json({
        success: true,
        message: 'Candidate supported successfully'
      });

    } catch (error) {
      logger.error('Error supporting candidate:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to support candidate'
      });
    }
  }

  /**
   * Upload candidate document
   */
  async uploadDocument(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { documentType } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      if (!documentType) {
        return res.status(400).json({
          success: false,
          message: 'Document type is required'
        });
      }

      // Validate document type
      const validDocumentTypes = ['profile', 'police_record', 'wealth_declaration', 'conflict_of_interest', 'cv'];
      if (!validDocumentTypes.includes(documentType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid document type'
        });
      }

      // Validate file
      const validation = fileUploadService.validateCandidateDocument(
        documentType as any, 
        file
      );

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.error
        });
      }

      // Get candidate profile
      const candidate = await candidateService.getCandidateByUserId(userId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate profile not found. Please create a profile first.'
        });
      }

      // File is already uploaded to S3 by multer middleware
      const fileUrl = (file as any).location || file.path;

      // Update candidate with document URL
      const updateData: any = {};
      switch (documentType) {
        case 'profile':
          updateData.profileImageUrl = fileUrl;
          break;
        case 'police_record':
          updateData.policeRecordUrl = fileUrl;
          break;
        case 'wealth_declaration':
          updateData.wealthDeclarationUrl = fileUrl;
          break;
        case 'conflict_of_interest':
          updateData.conflictOfInterestUrl = fileUrl;
          break;
        case 'cv':
          updateData.cvUrl = fileUrl;
          break;
      }

      await candidateService.submitCandidate(userId, updateData);

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          documentType,
          fileUrl
        }
      });

    } catch (error) {
      logger.error('Error uploading document:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload document'
      });
    }
  }

  /**
   * Calculate vision-based similarity with candidates
   */
  async calculateVisionSimilarity(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { voterVision, candidateIds } = req.body;

      if (!voterVision || typeof voterVision !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Voter vision is required and must be a string'
        });
      }

      if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'candidateIds must be a non-empty array'
        });
      }

      if (candidateIds.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 50 candidates allowed per batch'
        });
      }

      // Get candidate data
      const candidates = await Promise.all(
        candidateIds.map(async (candidateId: string) => {
          const candidate = await candidateService.getCandidateById(candidateId);
          if (!candidate) {
            return null;
          }

          return {
            id: candidate.id,
            vision: candidate.personalVision,
            workPlans: {
              fiveYearPlan: candidate.fiveYearPlan,
              longTermVision2048: candidate.longTermVision2048,
              detailedAnnualPlan: candidate.detailedAnnualPlan,
              visionAndWorkPlanInCommittee: candidate.visionAndWorkPlanInCommittee
            }
          };
        })
      );

      // Filter out null candidates
      const validCandidates = candidates.filter(c => c !== null) as any[];

      // Calculate vision similarities
      const similarities = await textSimilarityService.batchCalculateVisionMatches(
        voterVision,
        validCandidates
      );

      res.json({
        success: true,
        data: {
          similarities,
          totalCalculated: similarities.length
        }
      });

    } catch (error) {
      logger.error('Error calculating vision similarity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate vision similarity'
      });
    }
  }

  /**
   * Get positions/committees list
   */
  async getPositions(req: Request, res: Response) {
    try {
      const { type } = req.query;

      let whereClause = '';
      if (type === 'minister') {
        whereClause = "WHERE type = 'minister'";
      } else if (type === 'committee') {
        whereClause = "WHERE type = 'committee'";
      }

      // This would need to be implemented in a positions service
      // For now, return a placeholder response
      const positions = [
        // Ministers
        { id: '1', name: 'ראש הממשלה', type: 'minister' },
        { id: '2', name: 'שר הביטחון', type: 'minister' },
        { id: '3', name: 'שר החוץ', type: 'minister' },
        // ... more positions
        
        // Committees  
        { id: '101', name: 'ועדת הכספים', type: 'committee' },
        { id: '102', name: 'ועדת החוץ והביטחון', type: 'committee' },
        // ... more committees
      ];

      const filteredPositions = type ? 
        positions.filter(p => p.type === type) : 
        positions;

      res.json({
        success: true,
        data: filteredPositions
      });

    } catch (error) {
      logger.error('Error fetching positions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch positions'
      });
    }
  }

  /**
   * Get candidate statistics (admin only)
   */
  async getCandidateStatistics(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      // This would be implemented with actual statistics
      const statistics = {
        totalCandidates: 0,
        approvedCandidates: 0,
        pendingCandidates: 0,
        ministerCandidates: 0,
        committeeCandidates: 0,
        averageAge: 0,
        genderDistribution: { male: 0, female: 0, other: 0 },
        districtDistribution: {}
      };

      res.json({
        success: true,
        data: statistics
      });

    } catch (error) {
      logger.error('Error fetching candidate statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch candidate statistics'
      });
    }
  }

  /**
   * Admin: Approve/reject candidate
   */
  async moderateCandidate(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { candidateId } = req.params;
      const { action, reason } = req.body;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
      }

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be "approve" or "reject"'
        });
      }

      const candidate = await candidateService.getCandidateById(candidateId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }

      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      await candidateService.submitCandidate(candidate.userId, { status: newStatus });

      res.json({
        success: true,
        message: `Candidate ${action}d successfully`,
        data: {
          candidateId,
          newStatus,
          reason
        }
      });

    } catch (error) {
      logger.error('Error moderating candidate:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to moderate candidate'
      });
    }
  }
}

export const candidateController = new CandidateController();