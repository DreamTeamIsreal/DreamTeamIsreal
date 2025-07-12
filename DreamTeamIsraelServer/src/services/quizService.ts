import { QuizQuestion, QuizAnswer, ComparisonMatch } from '../types';
import { encryptionService } from './encryption';
import { fakeDataService } from './fakeDataService';
import { query, withTransaction } from '../config/database';
import { logger, securityLogger } from '../utils/logger';
import crypto from 'crypto';

export class QuizService {

  /**
   * Get all quiz questions
   */
  async getAllQuestions(): Promise<QuizQuestion[]> {
    try {
      const result = await query(`
        SELECT id, question, order_index, created_at
        FROM quiz_questions
        ORDER BY order_index ASC
      `);

      // Section mapping: 7 sections, 15 questions each, in order
      const sectionKeys = [
        'security',
        'economy',
        'education_health_welfare',
        'interior_justice_local_government',
        'transportation_housing_energy_environment',
        'society_culture_religion_state',
        'governance_transparency_ethics'
      ];
      const questionsPerSection = 15;

      return result.rows.map((row: any) => {
        // Determine section and question number
        const sectionIndex = Math.floor((row.order_index - 1) / questionsPerSection);
        const questionNumber = ((row.order_index - 1) % questionsPerSection) + 1;
        const category = sectionKeys[sectionIndex] || 'general';
        const key = `${category}.q${questionNumber}`;
        return {
          id: row.id,
          question: row.question,
          orderIndex: row.order_index,
          createdAt: row.created_at,
          category,
          key
        };
      });

    } catch (error) {
      logger.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  /**
   * Save partial quiz answers (draft mode)
   */
  async savePartialAnswers(userId: string, answers: { questionId: string; answer: number }[]): Promise<void> {
    try {
      // Generate anonymous user hash for this context
      const userHashId = encryptionService.generateAnonymousUserHash(userId, 'quiz_answers');

      // Delete existing partial answers for this user
      await query(`
        DELETE FROM quiz_answers 
        WHERE user_hash_id = $1
      `, [userHashId]);

      const realAnswers: Partial<QuizAnswer>[] = [];
      let fakeAnswersCount = 0;
      
      await withTransaction(async (client) => {
        for (const answer of answers) {
          const realAnswerData = {
            id: crypto.randomUUID(),
            userHashId,
            questionId: answer.questionId,
            answer: answer.answer,
            createdAt: new Date()
          };

          // Generate metadata tag for real answer
          const metadataTag = encryptionService.generateRecordIntegrityTag(realAnswerData, true);

          // Insert real answer
          await client.query(`
            INSERT INTO quiz_answers (id, user_hash_id, question_id, answer, metadata_tag)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            realAnswerData.id,
            realAnswerData.userHashId,
            realAnswerData.questionId,
            realAnswerData.answer,
            metadataTag
          ]);

          realAnswers.push(realAnswerData);
        }

        // Generate and insert fake answers
        const fakeAnswers = fakeDataService.generateFakeQuizAnswers(realAnswers);
        fakeAnswersCount = fakeAnswers.length;
        
        for (const fakeAnswer of fakeAnswers) {
          await client.query(`
            INSERT INTO quiz_answers (id, user_hash_id, question_id, answer, metadata_tag)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            fakeAnswer.id,
            fakeAnswer.userHashId,
            fakeAnswer.questionId,
            fakeAnswer.answer,
            fakeAnswer.metadataTag
          ]);
        }
      });

      // Log fake data generation
      fakeDataService.logFakeDataGeneration('quiz_partial_answers', realAnswers.length, fakeAnswersCount);
      
      logger.info('Partial quiz answers saved', { userId, answerCount: answers.length });

    } catch (error) {
      logger.error('Error saving partial quiz answers:', error);
      throw new Error('Failed to save partial answers');
    }
  }

  /**
   * Submit final quiz answers
   */
  async submitFinalAnswers(userId: string, answers: { questionId: string; answer: number }[]): Promise<void> {
    try {
      // Validate that all 100 questions are answered
      if (answers.length !== 100) {
        throw new Error('All 100 questions must be answered');
      }

      // Verify all question IDs exist
      const questionIds = answers.map(a => a.questionId);
      const existingQuestions = await query(`
        SELECT id FROM quiz_questions WHERE id = ANY($1)
      `, [questionIds]);

      if (existingQuestions.rows.length !== 100) {
        throw new Error('Invalid question IDs provided');
      }

      // Save answers (this will replace any existing partial answers)
      await this.savePartialAnswers(userId, answers);

      logger.info('Final quiz answers submitted', { userId, answerCount: answers.length });
      securityLogger.dataAccess(userId, 'quiz_final_submission', 'CREATE', 'quiz_service');

    } catch (error) {
      logger.error('Error submitting final quiz answers:', error);
      throw new Error('Failed to submit final answers');
    }
  }

  /**
   * Get user's own quiz answers (filtering out fake records)
   */
  async getUserAnswers(userId: string): Promise<QuizAnswer[]> {
    try {
      const userHashId = encryptionService.generateAnonymousUserHash(userId, 'quiz_answers');

      // Get all records for this user hash (real + fake)
      const result = await query(`
        SELECT qa.*, qq.question
        FROM quiz_answers qa
        JOIN quiz_questions qq ON qa.question_id = qq.id
        WHERE qa.user_hash_id = $1
        ORDER BY qq.order_index ASC
      `, [userHashId]);

      const realAnswers: QuizAnswer[] = [];
      let fakeRecordsFiltered = 0;

      // Filter out fake records using integrity verification
      for (const row of result.rows) {
        const recordData = {
          userHashId: row.user_hash_id,
          questionId: row.question_id,
          answer: row.answer
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          realAnswers.push({
            id: row.id,
            userHashId: row.user_hash_id,
            questionId: row.question_id,
            answer: row.answer,
            createdAt: row.created_at,
            metadataTag: row.metadata_tag
          });
        } else {
          fakeRecordsFiltered++;
        }
      }

      // Log fake data filtering for monitoring
      securityLogger.fakeDataQuery(userId, 'get_user_quiz_answers', fakeRecordsFiltered);

      return realAnswers;

    } catch (error) {
      logger.error('Error fetching user quiz answers:', error);
      throw new Error('Failed to fetch user answers');
    }
  }

  /**
   * Calculate quiz-based matching percentage between voter and candidate
   */
  async calculateQuizMatch(voterId: string, candidateId: string): Promise<number> {
    try {
      // Get voter's answers
      const voterAnswers = await this.getUserAnswers(voterId);
      if (voterAnswers.length === 0) {
        return 0; // Voter hasn't completed quiz
      }

      // Get candidate's answers
      const candidateAnswers = await this.getUserAnswers(candidateId);
      if (candidateAnswers.length === 0) {
        return 0; // Candidate hasn't completed quiz
      }

      // Create maps for easy lookup
      const voterAnswerMap = new Map(voterAnswers.map(a => [a.questionId, a.answer]));
      const candidateAnswerMap = new Map(candidateAnswers.map(a => [a.questionId, a.answer]));

      let totalScore = 0;
      let questionsCompared = 0;

      // Calculate match for each question both have answered
      for (const [questionId, voterAnswer] of voterAnswerMap) {
        const candidateAnswer = candidateAnswerMap.get(questionId);
        if (candidateAnswer !== undefined) {
          // Calculate similarity: 0 difference = 100%, 4 difference = 0%
          const difference = Math.abs(voterAnswer - candidateAnswer);
          const questionScore = Math.max(0, (4 - difference) / 4);
          totalScore += questionScore;
          questionsCompared++;
        }
      }

      if (questionsCompared === 0) {
        return 0;
      }

      // Return percentage (0-100)
      return Math.round((totalScore / questionsCompared) * 100);

    } catch (error) {
      logger.error('Error calculating quiz match:', error);
      throw new Error('Failed to calculate quiz match');
    }
  }

  /**
   * Get completion status for a user
   */
  async getQuizCompletionStatus(userId: string): Promise<{
    completed: boolean;
    answeredQuestions: number;
    totalQuestions: number;
  }> {
    try {
      const userAnswers = await this.getUserAnswers(userId);
      const totalQuestions = 100; // Fixed number of questions

      return {
        completed: userAnswers.length === totalQuestions,
        answeredQuestions: userAnswers.length,
        totalQuestions
      };

    } catch (error) {
      logger.error('Error checking quiz completion status:', error);
      throw new Error('Failed to check completion status');
    }
  }

  /**
   * Get quiz statistics (admin only)
   */
  async getQuizStatistics(): Promise<{
    totalResponses: number;
    averageCompletionRate: number;
    questionStats: { questionId: string; averageAnswer: number; responseCount: number }[];
  }> {
    try {
      // Get all real quiz answers by filtering fake records
      const result = await query(`
        SELECT qa.*, qq.question
        FROM quiz_answers qa
        JOIN quiz_questions qq ON qa.question_id = qq.id
      `);

      const realAnswers: QuizAnswer[] = [];
      let totalFakeRecordsFiltered = 0;

      // Filter out fake records
      for (const row of result.rows) {
        const recordData = {
          userHashId: row.user_hash_id,
          questionId: row.question_id,
          answer: row.answer
        };

        const integrityCheck = encryptionService.verifyRecordIntegrity(row.metadata_tag, recordData);
        
        if (integrityCheck.isReal) {
          realAnswers.push({
            id: row.id,
            userHashId: row.user_hash_id,
            questionId: row.question_id,
            answer: row.answer,
            createdAt: row.created_at,
            metadataTag: row.metadata_tag
          });
        } else {
          totalFakeRecordsFiltered++;
        }
      }

      // Calculate statistics
      const userCompletions = new Map<string, number>();
      const questionStats = new Map<string, { totalAnswers: number; sumAnswers: number; count: number }>();

      for (const answer of realAnswers) {
        // Track user completions
        const currentCount = userCompletions.get(answer.userHashId) || 0;
        userCompletions.set(answer.userHashId, currentCount + 1);

        // Track question statistics
        const stats = questionStats.get(answer.questionId) || { totalAnswers: 0, sumAnswers: 0, count: 0 };
        stats.sumAnswers += answer.answer;
        stats.count += 1;
        questionStats.set(answer.questionId, stats);
      }

      // Calculate completion rate
      const totalUsers = userCompletions.size;
      const completedUsers = Array.from(userCompletions.values()).filter(count => count === 100).length;
      const averageCompletionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

      // Prepare question statistics
      const questionStatsArray = Array.from(questionStats.entries()).map(([questionId, stats]) => ({
        questionId,
        averageAnswer: stats.count > 0 ? stats.sumAnswers / stats.count : 0,
        responseCount: stats.count
      }));

      securityLogger.fakeDataQuery('system', 'quiz_statistics', totalFakeRecordsFiltered);

      return {
        totalResponses: realAnswers.length,
        averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
        questionStats: questionStatsArray
      };

    } catch (error) {
      logger.error('Error fetching quiz statistics:', error);
      throw new Error('Failed to fetch quiz statistics');
    }
  }
}

export const quizService = new QuizService();