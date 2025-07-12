import { Request, Response } from 'express';
import { dreamTeamService } from '../services/dreamTeamService';
import { logger } from '../utils/logger';
import { validationResult } from 'express-validator';

export class DreamTeamController {

  /**
   * Select a candidate for a position
   */
  async selectCandidate(req: Request, res: Response) {
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
      const { positionId, candidateId, selectionType } = req.body;

      // Validate selection type
      if (!['minister', 'committee'].includes(selectionType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid selection type. Must be "minister" or "committee"'
        });
      }

      const selectionId = await dreamTeamService.selectCandidate(
        userId,
        positionId,
        candidateId,
        selectionType
      );

      return res.json({
        success: true,
        message: 'Candidate selected successfully',
        data: {
          selectionId,
          positionId,
          candidateId,
          selectionType
        }
      });

    } catch (error) {
      logger.error('Error selecting candidate:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to select candidate'
      });
    }
  }

  /**
   * Get user's dream team selections
   */
  async getUserSelections(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const selections = await dreamTeamService.getUserSelections(userId);

      return res.json({
        success: true,
        data: {
          selections,
          totalSelections: selections.length
        }
      });

    } catch (error) {
      logger.error('Error fetching user selections:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user selections'
      });
    }
  }

  /**
   * Update a dream team selection
   */
  async updateSelection(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { selectionId } = req.params;
      const { candidateId } = req.body;

      await dreamTeamService.updateSelection(selectionId, candidateId);

      return res.json({
        success: true,
        message: 'Selection updated successfully'
      });

    } catch (error) {
      logger.error('Error updating selection:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update selection'
      });
    }
  }

  /**
   * Delete a dream team selection
   */
  async deleteSelection(req: Request, res: Response) {
    try {
      const { selectionId } = req.params;

      await dreamTeamService.deleteSelection(selectionId);

      return res.json({
        success: true,
        message: 'Selection deleted successfully'
      });

    } catch (error) {
      logger.error('Error deleting selection:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete selection'
      });
    }
  }

  /**
   * Get all dream team selections (for statistics)
   */
  async getAllSelections(req: Request, res: Response) {
    try {
      const selections = await dreamTeamService.getAllSelections();

      return res.json({
        success: true,
        data: {
          selections,
          totalSelections: selections.length
        }
      });

    } catch (error) {
      logger.error('Error fetching all selections:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch selections'
      });
    }
  }
}

export const dreamTeamController = new DreamTeamController();