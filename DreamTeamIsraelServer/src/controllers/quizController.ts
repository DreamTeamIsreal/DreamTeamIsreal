import { Request, Response } from 'express';
import { quizService } from '../services/quizService';
import { candidateService } from '../services/candidateService';
import { logger } from '../utils/logger';
import { validationResult } from 'express-validator';

export class QuizController {

  /**
   * Get all quiz questions
   */
  async getQuestions(req: Request, res: Response) {
    try {
      const questions = await quizService.getAllQuestions();

      return res.json({
        success: true,
        data: questions
      });

    } catch (error) {
      logger.error('Error fetching quiz questions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz questions'
      });
    }
  }

  /**
   * Save partial quiz answers (draft mode)
   */
  async savePartialAnswers(req: Request, res: Response) {
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
      const { answers } = req.body;

      // Validate answers format
      if (!Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Answers must be an array'
        });
      }

      // Validate each answer
      for (const answer of answers) {
        if (!answer.questionId || typeof answer.answer !== 'number') {
          return res.status(400).json({
            success: false,
            message: 'Each answer must have questionId (string) and answer (number)'
          });
        }

        if (answer.answer < 1 || answer.answer > 5) {
          return res.status(400).json({
            success: false,
            message: 'Answer values must be between 1 and 5'
          });
        }
      }

      await quizService.savePartialAnswers(userId, answers);

      return res.json({ // Added return
        success: true,
        message: 'Partial answers saved successfully',
        data: {
          savedAnswers: answers.length
        }
      });

    } catch (error) {
      logger.error('Error saving partial answers:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save partial answers'
      });
    }
  }

  /**
   * Submit final quiz answers
   */
  async submitFinalAnswers(req: Request, res: Response) {
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
      const { answers } = req.body;

      // Validate answers format
      if (!Array.isArray(answers) || answers.length !== 100) {
        return res.status(400).json({
          success: false,
          message: 'Must provide exactly 100 answers'
        });
      }

      // Validate each answer
      for (const answer of answers) {
        if (!answer.questionId || typeof answer.answer !== 'number') {
          return res.status(400).json({
            success: false,
            message: 'Each answer must have questionId (string) and answer (number)'
          });
        }

        if (answer.answer < 1 || answer.answer > 5) {
          return res.status(400).json({
            success: false,
            message: 'Answer values must be between 1 and 5'
          });
        }
      }

      await quizService.submitFinalAnswers(userId, answers);

      return res.json({ // Added return
        success: true,
        message: 'Quiz completed successfully',
        data: {
          completedAnswers: answers.length
        }
      });

    } catch (error) {
      logger.error('Error submitting final answers:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit quiz'
      });
    }
  }

  /**
   * Get user's quiz answers
   */
  async getUserAnswers(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const answers = await quizService.getUserAnswers(userId);

      return res.json({ // Added return
        success: true,
        data: {
          answers,
          totalAnswered: answers.length
        }
      });

    } catch (error) {
      logger.error('Error fetching user answers:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: 'Failed to fetch user answers'
      });
    }
  }

  /**
   * Get quiz completion status
   */
  async getCompletionStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const status = await quizService.getQuizCompletionStatus(userId);

      return res.json({ // Added return
        success: true,
        data: status
      });

    } catch (error) {
      logger.error('Error fetching completion status:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: 'Failed to fetch completion status'
      });
    }
  }

  /**
   * Calculate quiz match with specific candidate
   */
  async calculateCandidateMatch(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { candidateId } = req.params;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          message: 'Candidate ID is required'
        });
      }

      // Verify candidate exists
      const candidate = await candidateService.getCandidateById(candidateId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }

      const matchPercentage = await quizService.calculateQuizMatch(userId, candidateId);

      return res.json({ // Added return
        success: true,
        data: {
          candidateId,
          candidateName: candidate.fullName,
          quizMatchPercentage: matchPercentage
        }
      });

    } catch (error) {
      logger.error('Error calculating candidate match:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: 'Failed to calculate candidate match'
      });
    }
  }

  /**
   * Get quiz statistics (admin only)
   */
  async getQuizStatistics(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const statistics = await quizService.getQuizStatistics();

      return res.json({ // Added return
        success: true,
        data: statistics
      });

    } catch (error) {
      logger.error('Error fetching quiz statistics:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: 'Failed to fetch quiz statistics'
      });
    }
  }

  /**
   * Batch calculate matches for multiple candidates
   */
  async batchCalculateMatches(req: Request, res: Response) {
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
      const { candidateIds } = req.body;

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

      // Calculate matches for all candidates
      const matches = await Promise.all(
          candidateIds.map(async (candidateId: string) => {
            try {
              const candidate = await candidateService.getCandidateById(candidateId);
              if (!candidate) {
                return {
                  candidateId,
                  quizMatchPercentage: 0,
                  error: 'Candidate not found'
                };
              }

              const matchPercentage = await quizService.calculateQuizMatch(userId, candidateId);
              return {
                candidateId,
                candidateName: candidate.fullName,
                quizMatchPercentage: matchPercentage
              };
            } catch (error) {
              return {
                candidateId,
                quizMatchPercentage: 0,
                error: 'Failed to calculate match'
              };
            }
          })
      );

      return res.json({ // Added return
        success: true,
        data: {
          matches,
          totalCalculated: matches.length
        }
      });

    } catch (error) {
      logger.error('Error in batch calculate matches:', error);
      return res.status(500).json({ // Added return
        success: false,
        message: 'Failed to calculate batch matches'
      });
    }
  }
}

export const quizController = new QuizController();