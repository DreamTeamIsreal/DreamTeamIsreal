import { Candidate, CandidateSearchParams, DreamTeamCandidate, Supporter, ComparisonMatch } from '../types';
import { encryptionService } from './encryption';
import { fakeDataService } from './fakeDataService';
import { quizService } from './quizService';
import { query, withTransaction } from '../config/database';
import { logger, securityLogger } from '../utils/logger';
import crypto from 'crypto';

export class CandidateService {

  /**
   * Submit or update candidate profile
   */
  async submitCandidate(userId: string, candidateData: Partial<Candidate>): Promise<string> {
    try {
      // Check if user already has a candidate profile
      const existingCandidate = await this.getCandidateByUserId(userId);
      
      if (existingCandidate) {
        // Update existing candidate
        return await this.updateCandidate(existingCandidate.id, candidateData);
      } else {
        // Create new candidate
        return await this.createCandidate(userId, candidateData);
      }

    } catch (error) {
      logger.error('Error submitting candidate:', error);
      throw new Error('Failed to submit candidate');
    }
  }

  /**
   * Create new candidate
   */
  private async createCandidate(userId: string, candidateData: Partial<Candidate>): Promise<string> {
    const candidateId = crypto.randomUUID();

    const realCandidateData = {
      id: candidateId,
      userId,
      candidacyType: candidateData.candidacyType || 'Minister',
      profileImageUrl: candidateData.profileImageUrl,
      fullName: candidateData.fullName || '',
      desiredPosition: candidateData.desiredPosition,
      desiredCommittee: candidateData.desiredCommittee,
      professionalExperience: candidateData.professionalExperience || '',
      education: candidateData.education || '',
      personalVision: candidateData.personalVision || '',
      policeRecordUrl: candidateData.policeRecordUrl,
      wealthDeclarationUrl: candidateData.wealthDeclarationUrl,
      conflictOfInterestUrl: candidateData.conflictOfInterestUrl,
      cvUrl: candidateData.cvUrl,
      fiveYearPlan: candidateData.fiveYearPlan,
      longTermVision2048: candidateData.longTermVision2048,
      detailedAnnualPlan: candidateData.detailedAnnualPlan,
      visionAndWorkPlanInCommittee: candidateData.visionAndWorkPlanInCommittee,
      introductionVideoLink: candidateData.introductionVideoLink,
      additionalDebateQuestion: candidateData.additionalDebateQuestion,
      status: candidateData.status || 'draft',
      numberOfVotes: 0,
      numberOfSupporters: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Encrypt sensitive fields
    const encryptedCandidateData = {
      ...realCandidateData,
      professionalExperience: JSON.stringify(encryptionService.encrypt(realCandidateData.professionalExperience)),
      education: JSON.stringify(encryptionService.encrypt(realCandidateData.education)),
      personalVision: JSON.stringify(encryptionService.encrypt(realCandidateData.personalVision)),
      fiveYearPlan: realCandidateData.fiveYearPlan ? JSON.stringify(encryptionService.encrypt(realCandidateData.fiveYearPlan)) : undefined,
      longTermVision2048: realCandidateData.longTermVision2048 ? JSON.stringify(encryptionService.encrypt(realCandidateData.longTermVision2048)) : undefined,
      detailedAnnualPlan: realCandidateData.detailedAnnualPlan ? JSON.stringify(encryptionService.encrypt(realCandidateData.detailedAnnualPlan)) : undefined,
      visionAndWorkPlanInCommittee: realCandidateData.visionAndWorkPlanInCommittee ? JSON.stringify(encryptionService.encrypt(realCandidateData.visionAndWorkPlanInCommittee)) : undefined,
      additionalDebateQuestion: realCandidateData.additionalDebateQuestion ? JSON.stringify(encryptionService.encrypt(realCandidateData.additionalDebateQuestion)) : undefined,
      metadataTag: encryptionService.generateRecordIntegrityTag(realCandidateData, true)
    };

    // Generate fake candidate records
    const fakeCandidates = fakeDataService.generateFakeCandidates(realCandidateData);

    await withTransaction(async (client) => {
      // Insert real candidate
      await client.query(`
        INSERT INTO candidates (
          id, user_id, candidacy_type, profile_image_url, full_name, desired_position, 
          desired_committee, professional_experience, education, personal_vision,
          police_record_url, wealth_declaration_url, conflict_of_interest_url, cv_url,
          five_year_plan, long_term_vision_2048, detailed_annual_plan, 
          vision_and_work_plan_in_committee, introduction_video_link, 
          additional_debate_question, status, number_of_votes, number_of_supporters, metadata_tag
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      `, [
        encryptedCandidateData.id, encryptedCandidateData.userId, encryptedCandidateData.candidacyType,
        encryptedCandidateData.profileImageUrl, encryptedCandidateData.fullName, encryptedCandidateData.desiredPosition,
        encryptedCandidateData.desiredCommittee, encryptedCandidateData.professionalExperience, encryptedCandidateData.education,
        encryptedCandidateData.personalVision, encryptedCandidateData.policeRecordUrl, encryptedCandidateData.wealthDeclarationUrl,
        encryptedCandidateData.conflictOfInterestUrl, encryptedCandidateData.cvUrl, encryptedCandidateData.fiveYearPlan,
        encryptedCandidateData.longTermVision2048, encryptedCandidateData.detailedAnnualPlan, encryptedCandidateData.visionAndWorkPlanInCommittee,
        encryptedCandidateData.introductionVideoLink, encryptedCandidateData.additionalDebateQuestion, encryptedCandidateData.status,
        encryptedCandidateData.numberOfVotes, encryptedCandidateData.numberOfSupporters, encryptedCandidateData.metadataTag
      ]);

      // Insert fake candidates
      for (const fakeCandidate of fakeCandidates) {
        await client.query(`
          INSERT INTO candidates (
            id, user_id, candidacy_type, profile_image_url, full_name, desired_position, 
            desired_committee, professional_experience, education, personal_vision,
            police_record_url, wealth_declaration_url, conflict_of_interest_url, cv_url,
            five_year_plan, long_term_vision_2048, detailed_annual_plan, 
            vision_and_work_plan_in_committee, introduction_video_link, 
            additional_debate_question, status, number_of_votes, number_of_supporters, metadata_tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `, [
          fakeCandidate.id, fakeCandidate.userId, fakeCandidate.candidacyType,
          fakeCandidate.profileImageUrl, fakeCandidate.fullName, fakeCandidate.desiredPosition,
          fakeCandidate.desiredCommittee, fakeCandidate.professionalExperience, fakeCandidate.education,
          fakeCandidate.personalVision, fakeCandidate.policeRecordUrl, fakeCandidate.wealthDeclarationUrl,
          fakeCandidate.conflictOfInterestUrl, fakeCandidate.cvUrl, fakeCandidate.fiveYearPlan,
          fakeCandidate.longTermVision2048, fakeCandidate.detailedAnnualPlan, fakeCandidate.visionAndWorkPlanInCommittee,
          fakeCandidate.introductionVideoLink, fakeCandidate.additionalDebateQuestion, fakeCandidate.status,
          fakeCandidate.numberOfVotes, fakeCandidate.numberOfSupporters, fakeCandidate.metadataTag
        ]);
      }

      // Update user roles to include 'candidate'
      await client.query(`
        UPDATE users 
        SET roles = CASE 
          WHEN 'candidate' = ANY(roles) THEN roles 
          ELSE array_append(roles, 'candidate') 
        END
        WHERE id = $1
      `, [userId]);
    });

    // Log fake data generation
    fakeDataService.logFakeDataGeneration('candidate_creation', 1, fakeCandidates.length);

    logger.info('Candidate created successfully', { candidateId, userId });
    securityLogger.dataAccess(userId, 'candidate_creation', 'CREATE', 'candidate_service');

    return candidateId;
  }

  /**
   * Update existing candidate
   */
  private async updateCandidate(candidateId: string, candidateData: Partial<Candidate>): Promise<string> {
    // Get existing candidate to verify ownership and get current data
    const existingCandidate = await this.getCandidateById(candidateId);
    if (!existingCandidate) {
      throw new Error('Candidate not found');
    }

    // Merge with existing data (excluding non-updatable fields)
    const { id, userId, createdAt, metadataTag, ...updatableFields } = existingCandidate;
    const updatedCandidateData = {
      ...updatableFields,
      ...candidateData,
      updatedAt: new Date()
    };

    // Encrypt sensitive fields
    const encryptedFields: any = {};
    if (candidateData.professionalExperience !== undefined) {
      encryptedFields.professional_experience = JSON.stringify(encryptionService.encrypt(candidateData.professionalExperience));
    }
    if (candidateData.education !== undefined) {
      encryptedFields.education = JSON.stringify(encryptionService.encrypt(candidateData.education));
    }
    if (candidateData.personalVision !== undefined) {
      encryptedFields.personal_vision = JSON.stringify(encryptionService.encrypt(candidateData.personalVision));
    }
    if (candidateData.fiveYearPlan !== undefined) {
      encryptedFields.five_year_plan = candidateData.fiveYearPlan ? JSON.stringify(encryptionService.encrypt(candidateData.fiveYearPlan)) : null;
    }
    if (candidateData.longTermVision2048 !== undefined) {
      encryptedFields.long_term_vision_2048 = candidateData.longTermVision2048 ? JSON.stringify(encryptionService.encrypt(candidateData.longTermVision2048)) : null;
    }
    if (candidateData.detailedAnnualPlan !== undefined) {
      encryptedFields.detailed_annual_plan = candidateData.detailedAnnualPlan ? JSON.stringify(encryptionService.encrypt(candidateData.detailedAnnualPlan)) : null;
    }
    if (candidateData.visionAndWorkPlanInCommittee !== undefined) {
      encryptedFields.vision_and_work_plan_in_committee = candidateData.visionAndWorkPlanInCommittee ? JSON.stringify(encryptionService.encrypt(candidateData.visionAndWorkPlanInCommittee)) : null;
    }
    if (candidateData.additionalDebateQuestion !== undefined) {
      encryptedFields.additional_debate_question = candidateData.additionalDebateQuestion ? JSON.stringify(encryptionService.encrypt(candidateData.additionalDebateQuestion)) : null;
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    // Add non-encrypted fields
    const directFields = [
      'candidacy_type', 'profile_image_url', 'full_name', 'desired_position', 
      'desired_committee', 'police_record_url', 'wealth_declaration_url', 
      'conflict_of_interest_url', 'cv_url', 'introduction_video_link', 'status'
    ];

    for (const field of directFields) {
      const jsField = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      if (candidateData[jsField as keyof Candidate] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(candidateData[jsField as keyof Candidate]);
        paramIndex++;
      }
    }

    // Add encrypted fields
    for (const [field, value] of Object.entries(encryptedFields)) {
      updateFields.push(`${field} = $${paramIndex}`);
      updateValues.push(value);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return candidateId; // No updates needed
    }

    // Add updated_at
    updateFields.push(`updated_at = $${paramIndex}`);
    updateValues.push(new Date());
    paramIndex++;

    // Add candidate ID for WHERE clause
    updateValues.push(candidateId);

    await query(`
      UPDATE candidates 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
    `, updateValues);

    logger.info('Candidate updated successfully', { candidateId });
    securityLogger.dataAccess(existingCandidate.userId, 'candidate_update', 'UPDATE', 'candidate_service');

    return candidateId;
  }

  /**
   * Get candidate by ID (filtering out fake records)
   */
  async getCandidateById(candidateId: string): Promise<Candidate | null> {
    try {
      const result = await query(`
        SELECT c.*, u.city as user_city
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
      `, [candidateId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];

      // Verify this is a real record
      const recordData = {
        userId: row.user_id,
        candidacyType: row.candidacy_type,
        fullName: row.full_name,
        professionalExperience: row.professional_experience,
        education: row.education,
        personalVision: row.personal_vision
      };

      const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
      
      if (!integrityCheck.isReal) {
        return null; // This is a fake record
      }

      return this.mapRowToCandidate(row);

    } catch (error) {
      logger.error('Error fetching candidate by ID:', error);
      throw new Error('Failed to fetch candidate');
    }
  }

  /**
   * Get candidate by user ID
   */
  async getCandidateByUserId(userId: string): Promise<Candidate | null> {
    try {
      const result = await query(`
        SELECT c.*, u.city as user_city
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = $1
      `, [userId]);

      // Filter real records
      for (const row of result.rows) {
        const recordData = {
          userId: row.user_id,
          candidacyType: row.candidacy_type,
          fullName: row.full_name,
          professionalExperience: row.professional_experience,
          education: row.education,
          personalVision: row.personal_vision
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          return this.mapRowToCandidate(row);
        }
      }

      return null;

    } catch (error) {
      logger.error('Error fetching candidate by user ID:', error);
      throw new Error('Failed to fetch candidate');
    }
  }

  /**
   * Get public candidates with search and filtering
   */
  async getPublicCandidates(searchParams: CandidateSearchParams, voterId?: string): Promise<{
    candidates: DreamTeamCandidate[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      let whereClause = "WHERE c.status = 'approved'";
      const queryParams: any[] = [];
      let paramIndex = 1;

      // Add search filters
      if (searchParams.district) {
        whereClause += ` AND u.city = $${paramIndex}`;
        queryParams.push(searchParams.district);
        paramIndex++;
      }

      if (searchParams.position) {
        whereClause += ` AND c.desired_position = $${paramIndex}`;
        queryParams.push(searchParams.position);
        paramIndex++;
      }

      if (searchParams.search) {
        whereClause += ` AND (c.full_name ILIKE $${paramIndex} OR c.professional_experience ILIKE $${paramIndex})`;
        queryParams.push(`%${searchParams.search}%`);
        paramIndex++;
      }

      // Get total count
      const countResult = await query(`
        SELECT COUNT(*) as total
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        ${whereClause}
      `, queryParams);

      // Get candidates with pagination
      const offset = (searchParams.page - 1) * searchParams.limit;
      const candidatesResult = await query(`
        SELECT c.*, u.city as user_city
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        ${whereClause}
        ORDER BY c.number_of_votes DESC, c.number_of_supporters DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...queryParams, searchParams.limit, offset]);

      const realCandidates: DreamTeamCandidate[] = [];
      let fakeRecordsFiltered = 0;

      // Filter out fake records and calculate matches
      for (const row of candidatesResult.rows) {
        const recordData = {
          userId: row.user_id,
          candidacyType: row.candidacy_type,
          fullName: row.full_name,
          professionalExperience: row.professional_experience,
          education: row.education,
          personalVision: row.personal_vision
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          const candidate = this.mapRowToCandidate(row);
          const dreamTeamCandidate: DreamTeamCandidate = {
            candidateId: candidate.id,
            profileImageUrl: candidate.profileImageUrl,
            fullName: candidate.fullName,
            desiredPosition: candidate.desiredPosition,
            desiredCommittee: candidate.desiredCommittee,
            district: candidate.city || 'Unknown', // From user's city
            numberOfVotes: candidate.numberOfVotes,
            numberOfSupporters: candidate.numberOfSupporters,
            percentageOfVotes: 0 // Will be calculated separately if needed
          };

          realCandidates.push(dreamTeamCandidate);
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Calculate comparison matches if voter is provided
      if (voterId) {
        for (const candidate of realCandidates) {
          // This would be calculated by the quiz service
          // For now, we'll leave it as a placeholder
        }
      }

      securityLogger.fakeDataQuery(voterId || 'anonymous', 'get_public_candidates', fakeRecordsFiltered);

      return {
        candidates: realCandidates,
        total: parseInt(countResult.rows[0].total),
        page: searchParams.page,
        limit: searchParams.limit
      };

    } catch (error) {
      logger.error('Error fetching public candidates:', error);
      throw new Error('Failed to fetch candidates');
    }
  }

  /**
   * Support a candidate
   */
  async supportCandidate(userId: string, candidateId: string): Promise<void> {
    try {
      // Verify candidate exists and is real
      const candidate = await this.getCandidateById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Generate anonymous user hash
      const userHashId = encryptionService.generateAnonymousUserHash(userId, 'supporter');

      // Check if user already supports this candidate
      const existingSupport = await query(`
        SELECT id FROM supporters 
        WHERE user_hash_id = $1 AND candidate_id = $2
      `, [userHashId, candidateId]);

      if (existingSupport.rows.length > 0) {
        throw new Error('User already supports this candidate');
      }

      const realSupporterData = {
        id: crypto.randomUUID(),
        userHashId,
        candidateId,
        createdAt: new Date()
      };

      // Generate fake supporters
      const fakeSupporters = fakeDataService.generateFakeSupporters(realSupporterData);

      await withTransaction(async (client) => {
        // Insert real supporter
        const metadataTag = encryptionService.generateRecordIntegrityTag(realSupporterData, true);
        await client.query(`
          INSERT INTO supporters (id, user_hash_id, candidate_id, metadata_tag)
          VALUES ($1, $2, $3, $4)
        `, [realSupporterData.id, realSupporterData.userHashId, realSupporterData.candidateId, metadataTag]);

        // Insert fake supporters
        for (const fakeSupporter of fakeSupporters) {
          await client.query(`
            INSERT INTO supporters (id, user_hash_id, candidate_id, metadata_tag)
            VALUES ($1, $2, $3, $4)
          `, [fakeSupporter.id, fakeSupporter.userHashId, fakeSupporter.candidateId, fakeSupporter.metadataTag]);
        }

        // Update candidate supporter count (only count real supporters)
        const realSupportersCount = await this.getRealSupportersCount(candidateId);
        await client.query(`
          UPDATE candidates 
          SET number_of_supporters = $1
          WHERE id = $2
        `, [realSupportersCount + 1, candidateId]);
      });

      // Log fake data generation
      fakeDataService.logFakeDataGeneration('candidate_support', 1, fakeSupporters.length);

      logger.info('Candidate supported successfully', { userId, candidateId });
      securityLogger.dataAccess(userId, 'candidate_support', 'CREATE', 'candidate_service');

    } catch (error) {
      logger.error('Error supporting candidate:', error);
      throw new Error('Failed to support candidate');
    }
  }

  /**
   * Get real supporters count (filtering fake records)
   */
  private async getRealSupportersCount(candidateId: string): Promise<number> {
    const result = await query(`
      SELECT * FROM supporters WHERE candidate_id = $1
    `, [candidateId]);

    let realCount = 0;
    for (const row of result.rows) {
      const recordData = {
        userHashId: row.user_hash_id,
        candidateId: row.candidate_id
      };

      const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
      if (integrityCheck.isReal) {
        realCount++;
      }
    }

    return realCount;
  }

  /**
   * Map database row to Candidate object with decryption
   */
  private mapRowToCandidate(row: any): Candidate {
    return {
      id: row.id,
      userId: row.user_id,
      candidacyType: row.candidacy_type,
      profileImageUrl: row.profile_image_url,
      fullName: row.full_name,
      desiredPosition: row.desired_position,
      desiredCommittee: row.desired_committee,
      professionalExperience: row.professional_experience ? encryptionService.decrypt(JSON.parse(row.professional_experience)) : '',
      education: row.education ? encryptionService.decrypt(JSON.parse(row.education)) : '',
      personalVision: row.personal_vision ? encryptionService.decrypt(JSON.parse(row.personal_vision)) : '',
      policeRecordUrl: row.police_record_url,
      wealthDeclarationUrl: row.wealth_declaration_url,
      conflictOfInterestUrl: row.conflict_of_interest_url,
      cvUrl: row.cv_url,
      fiveYearPlan: row.five_year_plan ? encryptionService.decrypt(JSON.parse(row.five_year_plan)) : undefined,
      longTermVision2048: row.long_term_vision_2048 ? encryptionService.decrypt(JSON.parse(row.long_term_vision_2048)) : undefined,
      detailedAnnualPlan: row.detailed_annual_plan ? encryptionService.decrypt(JSON.parse(row.detailed_annual_plan)) : undefined,
      visionAndWorkPlanInCommittee: row.vision_and_work_plan_in_committee ? encryptionService.decrypt(JSON.parse(row.vision_and_work_plan_in_committee)) : undefined,
      introductionVideoLink: row.introduction_video_link,
      additionalDebateQuestion: row.additional_debate_question ? encryptionService.decrypt(JSON.parse(row.additional_debate_question)) : undefined,
      status: row.status,
      numberOfVotes: row.number_of_votes,
      numberOfSupporters: row.number_of_supporters,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadataTag: row.metadata_tag,
      city: row.user_city ? encryptionService.decrypt(JSON.parse(row.user_city)) : undefined
    };
  }
}

export const candidateService = new CandidateService();