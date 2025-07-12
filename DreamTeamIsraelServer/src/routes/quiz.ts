import express, { Request, Response, NextFunction } from 'express'; // Add Request, Response, NextFunction for catchAsync
import { body } from 'express-validator';
import { quizController } from '../controllers/quizController';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

// Define catchAsync function locally or import from a utility file
// For this example, I'll define it here for completeness.
// In a real project, you would typically have this in a 'utils' folder.
type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => { // Explicitly return void
    Promise.resolve(fn(req, res, next)).catch(next); // Ensure it's a Promise and catch errors
  };
};


const router = express.Router();

// Rate limiters for different quiz operations
const quizGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many quiz requests, please try again later', // Added trailing comma for consistency
});

const quizSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour
  message: 'Too many quiz submissions, please try again later', // Added trailing comma
});

// Validation schemas
const partialAnswersValidation = [
  body('answers')
      .isArray({ min: 1, max: 100 })
      .withMessage('Answers must be an array with 1-100 items'),
  body('answers.*.questionId')
      .isUUID()
      .withMessage('Question ID must be a valid UUID'),
  body('answers.*.answer')
      .isInt({ min: 1, max: 5 })
      .withMessage('Answer must be an integer between 1 and 5'), // Added trailing comma
];

const finalAnswersValidation = [
  body('answers')
      .isArray({ min: 100, max: 100 })
      .withMessage('Must provide exactly 100 answers'),
  body('answers.*.questionId')
      .isUUID()
      .withMessage('Question ID must be a valid UUID'),
  body('answers.*.answer')
      .isInt({ min: 1, max: 5 })
      .withMessage('Answer must be an integer between 1 and 5'), // Added trailing comma
];

const batchMatchValidation = [
  body('candidateIds')
      .isArray({ min: 1, max: 50 })
      .withMessage('candidateIds must be an array with 1-50 items'),
  body('candidateIds.*')
      .isUUID()
      .withMessage('Each candidate ID must be a valid UUID'), // Added trailing comma
];

/**
 * @route GET /api/quiz/questions
 * @desc Get all quiz questions
 * @access Public (but recommended to be authenticated)
 */
router.get('/questions', quizGeneralLimiter, catchAsync(quizController.getQuestions));

/**
 * @route POST /api/quiz/partial-answers
 * @desc Save partial quiz answers (draft mode)
 * @access Private
 */
router.post(
    '/partial-answers',
    authenticate,
    quizSubmissionLimiter,
    partialAnswersValidation,
    catchAsync(quizController.savePartialAnswers), // Apply catchAsync
);

/**
 * @route POST /api/quiz/submit
 * @desc Submit final quiz answers (all 100 questions)
 * @access Private
 */
router.post(
    '/submit',
    authenticate,
    quizSubmissionLimiter,
    finalAnswersValidation,
    catchAsync(quizController.submitFinalAnswers), // Apply catchAsync
);

/**
 * @route GET /api/quiz/my-answers
 * @desc Get user's own quiz answers
 * @access Private
 */
router.get('/my-answers', authenticate, quizGeneralLimiter, catchAsync(quizController.getUserAnswers));

/**
 * @route GET /api/quiz/completion-status
 * @desc Get quiz completion status for current user
 * @access Private
 */
router.get('/completion-status', authenticate, quizGeneralLimiter, catchAsync(quizController.getCompletionStatus));

/**
 * @route GET /api/quiz/match/:candidateId
 * @desc Calculate quiz match with specific candidate
 * @access Private
 */
router.get('/match/:candidateId', authenticate, quizGeneralLimiter, catchAsync(quizController.calculateCandidateMatch));

/**
 * @route POST /api/quiz/batch-matches
 * @desc Calculate quiz matches for multiple candidates
 * @access Private
 */
router.post(
    '/batch-matches',
    authenticate,
    quizGeneralLimiter,
    batchMatchValidation,
    catchAsync(quizController.batchCalculateMatches), // Apply catchAsync
);

/**
 * @route GET /api/quiz/statistics
 * @desc Get quiz statistics (admin only)
 * @access Private (Admin)
 */
router.get('/statistics', authenticate, quizGeneralLimiter, catchAsync(quizController.getQuizStatistics));

export default router;