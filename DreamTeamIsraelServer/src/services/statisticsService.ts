import { StatsResponse, DreamTeamCandidate } from '../types';
import { encryptionService } from './encryption';
import { query } from '../config/database';
import { logger, securityLogger } from '../utils/logger';

export class StatisticsService {

  /**
   * Get total number of real participants
   */
  async getTotalParticipants(): Promise<number> {
    try {
      const result = await query(`SELECT * FROM users`);
      
      let realUsersCount = 0;
      let fakeRecordsFiltered = 0;

      // Filter out fake users
      for (const row of result.rows) {
        const recordData = {
          israelId: row.israel_id,
          fullName: row.full_name,
          dateOfBirth: row.date_of_birth,
          mobilePhoneNumber: row.mobile_phone_number,
          email: row.email,
          city: row.city,
          passwordHash: row.password_hash,
          mfaSecret: row.mfa_secret,
          mfaEnabled: row.mfa_enabled,
          roles: row.roles,
          emailVerified: row.email_verified,
          phoneVerified: row.phone_verified
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          realUsersCount++;
        } else {
          fakeRecordsFiltered++;
        }
      }

      securityLogger.fakeDataQuery('system', 'total_participants', fakeRecordsFiltered);
      return realUsersCount;

    } catch (error) {
      logger.error('Error fetching total participants:', error);
      throw new Error('Failed to fetch total participants');
    }
  }

  /**
   * Get total number of real registered candidates
   */
  async getRegisteredCandidates(): Promise<number> {
    try {
      const result = await query(`
        SELECT * FROM candidates WHERE status = 'approved'
      `);
      
      let realCandidatesCount = 0;
      let fakeRecordsFiltered = 0;

      // Filter out fake candidates
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
          realCandidatesCount++;
        } else {
          fakeRecordsFiltered++;
        }
      }

      securityLogger.fakeDataQuery('system', 'registered_candidates', fakeRecordsFiltered);
      return realCandidatesCount;

    } catch (error) {
      logger.error('Error fetching registered candidates:', error);
      throw new Error('Failed to fetch registered candidates');
    }
  }

  /**
   * Get national dream team (top candidate for each minister position)
   */
  async getNationalDreamTeam(): Promise<DreamTeamCandidate[]> {
    try {
      // Get all approved minister candidates
      const result = await query(`
        SELECT c.*, u.city as user_city, p.name as position_name
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN positions p ON c.desired_position = p.id
        WHERE c.status = 'approved' AND c.candidacy_type = 'Minister'
        ORDER BY c.desired_position, c.number_of_votes DESC, c.number_of_supporters DESC
      `);

      const realCandidates: any[] = [];
      let fakeRecordsFiltered = 0;

      // Filter out fake candidates
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
          realCandidates.push(row);
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Group by position and get top candidate for each
      const positionMap = new Map<string, any>();
      
      for (const candidate of realCandidates) {
        const position = candidate.desired_position;
        if (position && !positionMap.has(position)) {
          positionMap.set(position, candidate);
        }
      }

      // Calculate total votes per position for percentage calculation
      const positionTotals = await this.calculatePositionTotals('minister');

      // Map to DreamTeamCandidate format
      const dreamTeam = Array.from(positionMap.values()).map(candidate => {
        const totalVotesForPosition = positionTotals.get(candidate.desired_position) || 1;
        const percentageOfVotes = (candidate.number_of_votes / totalVotesForPosition) * 100;

        return {
          candidateId: candidate.id,
          profileImageUrl: candidate.profile_image_url,
          fullName: candidate.full_name,
          desiredPosition: candidate.desired_position,
          desiredCommittee: undefined,
          district: candidate.user_city ? this.decryptUserCity(candidate.user_city) : 'Unknown',
          numberOfVotes: candidate.number_of_votes,
          numberOfSupporters: candidate.number_of_supporters,
          percentageOfVotes: Math.round(percentageOfVotes * 100) / 100
        };
      });

      securityLogger.fakeDataQuery('system', 'national_dream_team', fakeRecordsFiltered);
      return dreamTeam;

    } catch (error) {
      logger.error('Error fetching national dream team:', error);
      throw new Error('Failed to fetch national dream team');
    }
  }

  /**
   * Get Knesset committees dream team (top candidate for each committee)
   */
  async getKnessetCommittees(): Promise<DreamTeamCandidate[]> {
    try {
      // Get all approved committee candidates
      const result = await query(`
        SELECT c.*, u.city as user_city, p.name as committee_name
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN positions p ON c.desired_committee = p.id
        WHERE c.status = 'approved' AND c.candidacy_type = 'Knesset Committee'
        ORDER BY c.desired_committee, c.number_of_votes DESC, c.number_of_supporters DESC
      `);

      const realCandidates: any[] = [];
      let fakeRecordsFiltered = 0;

      // Filter out fake candidates
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
          realCandidates.push(row);
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Group by committee and get top candidate for each
      const committeeMap = new Map<string, any>();
      
      for (const candidate of realCandidates) {
        const committee = candidate.desired_committee;
        if (committee && !committeeMap.has(committee)) {
          committeeMap.set(committee, candidate);
        }
      }

      // Calculate total votes per committee for percentage calculation
      const committeeTotals = await this.calculatePositionTotals('committee');

      // Map to DreamTeamCandidate format
      const dreamTeam = Array.from(committeeMap.values()).map(candidate => {
        const totalVotesForCommittee = committeeTotals.get(candidate.desired_committee) || 1;
        const percentageOfVotes = (candidate.number_of_votes / totalVotesForCommittee) * 100;

        return {
          candidateId: candidate.id,
          profileImageUrl: candidate.profile_image_url,
          fullName: candidate.full_name,
          desiredPosition: undefined,
          desiredCommittee: candidate.desired_committee,
          district: candidate.user_city ? this.decryptUserCity(candidate.user_city) : 'Unknown',
          numberOfVotes: candidate.number_of_votes,
          numberOfSupporters: candidate.number_of_supporters,
          percentageOfVotes: Math.round(percentageOfVotes * 100) / 100
        };
      });

      securityLogger.fakeDataQuery('system', 'knesset_committees', fakeRecordsFiltered);
      return dreamTeam;

    } catch (error) {
      logger.error('Error fetching Knesset committees:', error);
      throw new Error('Failed to fetch Knesset committees');
    }
  }

  /**
   * Get candidates for a specific position
   */
  async getCandidatesForPosition(positionId: string, type: 'minister' | 'committee'): Promise<DreamTeamCandidate[]> {
    try {
      const field = type === 'minister' ? 'desired_position' : 'desired_committee';
      const candidacyType = type === 'minister' ? 'Minister' : 'Knesset Committee';

      const result = await query(`
        SELECT c.*, u.city as user_city
        FROM candidates c
        JOIN users u ON c.user_id = u.id
        WHERE c.status = 'approved' 
        AND c.candidacy_type = $1 
        AND c.${field} = $2
        ORDER BY c.number_of_votes DESC, c.number_of_supporters DESC
      `, [candidacyType, positionId]);

      const realCandidates: DreamTeamCandidate[] = [];
      let fakeRecordsFiltered = 0;

      // Filter out fake candidates
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
          realCandidates.push({
            candidateId: row.id,
            profileImageUrl: row.profile_image_url,
            fullName: row.full_name,
            desiredPosition: type === 'minister' ? row.desired_position : undefined,
            desiredCommittee: type === 'committee' ? row.desired_committee : undefined,
            district: row.user_city ? this.decryptUserCity(row.user_city) : 'Unknown',
            numberOfVotes: row.number_of_votes,
            numberOfSupporters: row.number_of_supporters,
            percentageOfVotes: 0 // Will be calculated below
          });
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Calculate percentage of votes for each candidate
      const totalVotes = realCandidates.reduce((sum, candidate) => sum + candidate.numberOfVotes, 0);
      
      if (totalVotes > 0) {
        realCandidates.forEach(candidate => {
          candidate.percentageOfVotes = Math.round((candidate.numberOfVotes / totalVotes) * 10000) / 100;
        });
      }

      securityLogger.fakeDataQuery('system', `candidates_for_${type}_${positionId}`, fakeRecordsFiltered);
      return realCandidates;

    } catch (error) {
      logger.error('Error fetching candidates for position:', error);
      throw new Error('Failed to fetch candidates for position');
    }
  }

  /**
   * Get comprehensive statistics
   */
  async getComprehensiveStatistics(): Promise<StatsResponse> {
    try {
      const [totalParticipants, registeredCandidates, nationalDreamTeam, knesssetCommittees] = await Promise.all([
        this.getTotalParticipants(),
        this.getRegisteredCandidates(),
        this.getNationalDreamTeam(),
        this.getKnessetCommittees()
      ]);

      return {
        totalParticipants,
        registeredCandidates,
        nationalDreamTeam,
        knesssetCommittees
      };

    } catch (error) {
      logger.error('Error fetching comprehensive statistics:', error);
      throw new Error('Failed to fetch comprehensive statistics');
    }
  }

  /**
   * Calculate total votes per position/committee
   */
  private async calculatePositionTotals(type: 'minister' | 'committee'): Promise<Map<string, number>> {
    const field = type === 'minister' ? 'desired_position' : 'desired_committee';
    const candidacyType = type === 'minister' ? 'Minister' : 'Knesset Committee';

    const result = await query(`
      SELECT c.${field} as position_id, c.number_of_votes, c.metadata_tag,
             c.user_id, c.candidacy_type, c.full_name, c.professional_experience, c.education, c.personal_vision
      FROM candidates c
      WHERE c.status = 'approved' AND c.candidacy_type = $1
    `, [candidacyType]);

    const positionTotals = new Map<string, number>();
    let fakeRecordsFiltered = 0;

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
        const positionId = row.position_id;
        const currentTotal = positionTotals.get(positionId) || 0;
        positionTotals.set(positionId, currentTotal + row.number_of_votes);
      } else {
        fakeRecordsFiltered++;
      }
    }

    securityLogger.fakeDataQuery('system', `position_totals_${type}`, fakeRecordsFiltered);
    return positionTotals;
  }

  /**
   * Decrypt user city (helper method)
   */
  private decryptUserCity(encryptedCity: string): string {
    try {
      return encryptionService.decrypt(JSON.parse(encryptedCity));
    } catch (error) {
      logger.warn('Failed to decrypt user city:', error);
      return 'Unknown';
    }
  }

  /**
   * Get quiz completion statistics
   */
  async getQuizStatistics(): Promise<{
    totalResponses: number;
    completionRate: number;
    avgAnswersPerUser: number;
  }> {
    try {
      const result = await query(`
        SELECT qa.*, u.metadata_tag as user_metadata_tag
        FROM quiz_answers qa
        JOIN users u ON qa.user_hash_id = u.id::text
      `);

      let realAnswersCount = 0;
      const userAnswerCounts = new Map<string, number>();
      let fakeRecordsFiltered = 0;

      for (const row of result.rows) {
        const recordData = {
          userHashId: row.user_hash_id,
          questionId: row.question_id,
          answer: row.answer
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          realAnswersCount++;
          const userHash = row.user_hash_id;
          const currentCount = userAnswerCounts.get(userHash) || 0;
          userAnswerCounts.set(userHash, currentCount + 1);
        } else {
          fakeRecordsFiltered++;
        }
      }

      const totalUsers = userAnswerCounts.size;
      const completedUsers = Array.from(userAnswerCounts.values()).filter(count => count === 100).length;
      const completionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;
      const avgAnswersPerUser = totalUsers > 0 ? realAnswersCount / totalUsers : 0;

      securityLogger.fakeDataQuery('system', 'quiz_statistics', fakeRecordsFiltered);

      return {
        totalResponses: realAnswersCount,
        completionRate: Math.round(completionRate * 100) / 100,
        avgAnswersPerUser: Math.round(avgAnswersPerUser * 100) / 100
      };

    } catch (error) {
      logger.error('Error fetching quiz statistics:', error);
      throw new Error('Failed to fetch quiz statistics');
    }
  }

  /**
   * Get supporter statistics
   */
  async getSupporterStatistics(): Promise<{
    totalSupports: number;
    avgSupportsPerCandidate: number;
    topSupportedCandidates: { candidateId: string; fullName: string; supporters: number }[];
  }> {
    try {
      const result = await query(`
        SELECT s.*, c.full_name, c.metadata_tag as candidate_metadata_tag,
               c.user_id, c.candidacy_type, c.professional_experience, c.education, c.personal_vision
        FROM supporters s
        JOIN candidates c ON s.candidate_id = c.id
        WHERE c.status = 'approved'
      `);

      let realSupportsCount = 0;
      const candidateSupports = new Map<string, { name: string; count: number }>();
      let fakeRecordsFiltered = 0;

      for (const row of result.rows) {
        // Verify supporter record
        const supporterData = {
          userHashId: row.user_hash_id,
          candidateId: row.candidate_id
        };

        const supporterCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, supporterData);
        
        // Verify candidate record
        const candidateData = {
          userId: row.user_id,
          candidacyType: row.candidacy_type,
          fullName: row.full_name,
          professionalExperience: row.professional_experience,
          education: row.education,
          personalVision: row.personal_vision
        };

        const candidateCheck = encryptionService.verifyRecordIntegrity(row.candidate_metadata_tag, candidateData);
        
        if (supporterCheck.isReal && candidateCheck.isReal) {
          realSupportsCount++;
          const candidateId = row.candidate_id;
          const current = candidateSupports.get(candidateId) || { name: row.full_name, count: 0 };
          candidateSupports.set(candidateId, { name: current.name, count: current.count + 1 });
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Get top supported candidates
      const topSupportedCandidates = Array.from(candidateSupports.entries())
        .map(([candidateId, data]) => ({
          candidateId,
          fullName: data.name,
          supporters: data.count
        }))
        .sort((a, b) => b.supporters - a.supporters)
        .slice(0, 10);

      const totalCandidates = candidateSupports.size;
      const avgSupportsPerCandidate = totalCandidates > 0 ? realSupportsCount / totalCandidates : 0;

      securityLogger.fakeDataQuery('system', 'supporter_statistics', fakeRecordsFiltered);

      return {
        totalSupports: realSupportsCount,
        avgSupportsPerCandidate: Math.round(avgSupportsPerCandidate * 100) / 100,
        topSupportedCandidates
      };

    } catch (error) {
      logger.error('Error fetching supporter statistics:', error);
      throw new Error('Failed to fetch supporter statistics');
    }
  }
}

export const statisticsService = new StatisticsService();