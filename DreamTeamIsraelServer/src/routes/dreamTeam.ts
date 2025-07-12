import { Router } from 'express';
import { body, param } from 'express-validator';
import { dreamTeamController } from '../controllers/dreamTeamController';
import { authenticate } from '../middleware/auth';
import { validateInput } from '../middleware/security';

const router = Router();

// Apply authentication middleware to all dream team routes
router.use(authenticate);

/**
 * @route POST /api/dreamteam/select
 * @desc Select a candidate for a position
 * @access Private
 */
router.post('/select', [
  body('positionId')
    .isString()
    .notEmpty()
    .withMessage('Position ID is required'),
  body('candidateId')
    .isString()
    .notEmpty()
    .withMessage('Candidate ID is required'),
  body('selectionType')
    .isIn(['minister', 'committee'])
    .withMessage('Selection type must be either "minister" or "committee"'),
  validateInput([
    body('positionId').isString().notEmpty(),
    body('candidateId').isString().notEmpty(),
    body('selectionType').isIn(['minister', 'committee'])
  ])
], dreamTeamController.selectCandidate);

/**
 * @route GET /api/dreamteam/selections
 * @desc Get user's dream team selections
 * @access Private
 */
router.get('/selections', dreamTeamController.getUserSelections);

/**
 * @route PUT /api/dreamteam/selections/:selectionId
 * @desc Update a dream team selection
 * @access Private
 */
router.put('/selections/:selectionId', [
  param('selectionId')
    .isUUID()
    .withMessage('Invalid selection ID format'),
  body('candidateId')
    .isString()
    .notEmpty()
    .withMessage('Candidate ID is required'),
  validateInput([
    param('selectionId').isUUID(),
    body('candidateId').isString().notEmpty()
  ])
], dreamTeamController.updateSelection);

/**
 * @route DELETE /api/dreamteam/selections/:selectionId
 * @desc Delete a dream team selection
 * @access Private
 */
router.delete('/selections/:selectionId', [
  param('selectionId')
    .isUUID()
    .withMessage('Invalid selection ID format'),
  validateInput([
    param('selectionId').isUUID()
  ])
], dreamTeamController.deleteSelection);

/**
 * @route GET /api/dreamteam/all-selections
 * @desc Get all dream team selections (for statistics)
 * @access Private (Admin only in future)
 */
router.get('/all-selections', dreamTeamController.getAllSelections);

export default router;