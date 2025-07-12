import { DreamTeamSelection } from '../types';
import { encryptionService } from './encryption';
import { fakeDataService } from './fakeDataService';
import { query, withTransaction } from '../config/database';
import { logger, securityLogger } from '../utils/logger';
import crypto from 'crypto';

export class DreamTeamService {

  /**
   * Select a candidate for a position
   */
  async selectCandidate(userId: string, positionId: string, candidateId: string, selectionType: 'minister' | 'committee'): Promise<string> {
    try {
      const selectionId = crypto.randomUUID();

      const realSelectionData = {
        id: selectionId,
        userHashId: userId, // Using userId as hash for now
        positionId,
        candidateId,
        selectionType,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Encrypt sensitive fields if needed
      const encryptedSelectionData = {
        ...realSelectionData,
        metadataTag: encryptionService.generateRecordIntegrityTag(realSelectionData, true)
      };

      // Generate fake selection records
      const fakeSelections = fakeDataService.generateFakeDreamTeamSelections(realSelectionData);

      await withTransaction(async (client) => {
        // Insert real selection
        await client.query(`
          INSERT INTO dream_team_selections (
            id, user_hash_id, position_id, candidate_id, selection_type, 
            created_at, updated_at, metadata_tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          encryptedSelectionData.id, encryptedSelectionData.userHashId,
          encryptedSelectionData.positionId, encryptedSelectionData.candidateId,
          encryptedSelectionData.selectionType, encryptedSelectionData.createdAt,
          encryptedSelectionData.updatedAt, encryptedSelectionData.metadataTag
        ]);

        // Insert fake selections
        for (const fakeSelection of fakeSelections) {
          await client.query(`
            INSERT INTO dream_team_selections (
              id, user_hash_id, position_id, candidate_id, selection_type, 
              created_at, updated_at, metadata_tag
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            fakeSelection.id, fakeSelection.userHashId,
            fakeSelection.positionId, fakeSelection.candidateId,
            fakeSelection.selectionType, fakeSelection.createdAt,
            fakeSelection.updatedAt, fakeSelection.metadataTag
          ]);
        }
      });

      // Log fake data generation
      fakeDataService.logFakeDataGeneration('dream_team_selection', 1, fakeSelections.length);

      logger.info('Dream team selection created successfully', { selectionId, userId, positionId, candidateId });
      securityLogger.dataAccess(userId, 'dream_team_selection', 'CREATE', 'dream_team_service');

      return selectionId;
    } catch (error) {
      logger.error('Error creating dream team selection:', error);
      throw new Error('Failed to create dream team selection');
    }
  }

  /**
   * Get user's dream team selections
   */
  async getUserSelections(userId: string): Promise<DreamTeamSelection[]> {
    try {
      const result = await query(`
        SELECT * FROM dream_team_selections 
        WHERE user_hash_id = $1
        ORDER BY created_at DESC
      `, [userId]);

      const selections: DreamTeamSelection[] = [];

      for (const row of result.rows) {
        // Verify this is a real record
        const integrityCheck = encryptionService.verifyRecordIntegrity(
          row.metadata_tag,
          {
            id: row.id,
            userHashId: row.user_hash_id,
            positionId: row.position_id,
            candidateId: row.candidate_id,
            selectionType: row.selection_type,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }
        );

        if (integrityCheck.isReal) {
          selections.push(this.mapRowToSelection(row));
        }
      }

      return selections;
    } catch (error) {
      logger.error('Error fetching user selections:', error);
      throw new Error('Failed to fetch user selections');
    }
  }

  /**
   * Update a dream team selection
   */
  async updateSelection(selectionId: string, candidateId: string): Promise<void> {
    try {
      const result = await query(`
        UPDATE dream_team_selections 
        SET candidate_id = $1, updated_at = $2
        WHERE id = $3
      `, [candidateId, new Date(), selectionId]);

      if (result.rowCount === 0) {
        throw new Error('Selection not found');
      }

      logger.info('Dream team selection updated successfully', { selectionId, candidateId });
    } catch (error) {
      logger.error('Error updating dream team selection:', error);
      throw new Error('Failed to update dream team selection');
    }
  }

  /**
   * Delete a dream team selection
   */
  async deleteSelection(selectionId: string): Promise<void> {
    try {
      const result = await query(`
        DELETE FROM dream_team_selections 
        WHERE id = $1
      `, [selectionId]);

      if (result.rowCount === 0) {
        throw new Error('Selection not found');
      }

      logger.info('Dream team selection deleted successfully', { selectionId });
    } catch (error) {
      logger.error('Error deleting dream team selection:', error);
      throw new Error('Failed to delete dream team selection');
    }
  }

  /**
   * Get all dream team selections (for statistics)
   */
  async getAllSelections(): Promise<DreamTeamSelection[]> {
    try {
      const result = await query(`
        SELECT * FROM dream_team_selections 
        ORDER BY created_at DESC
      `);

      const selections: DreamTeamSelection[] = [];

      for (const row of result.rows) {
        // Verify this is a real record
        const integrityCheck = encryptionService.verifyRecordIntegrity(
          row.metadata_tag,
          {
            id: row.id,
            userHashId: row.user_hash_id,
            positionId: row.position_id,
            candidateId: row.candidate_id,
            selectionType: row.selection_type,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }
        );

        if (integrityCheck.isReal) {
          selections.push(this.mapRowToSelection(row));
        }
      }

      return selections;
    } catch (error) {
      logger.error('Error fetching all selections:', error);
      throw new Error('Failed to fetch selections');
    }
  }

  /**
   * Map database row to DreamTeamSelection object
   */
  private mapRowToSelection(row: any): DreamTeamSelection {
    return {
      id: row.id,
      userHashId: row.user_hash_id,
      positionId: row.position_id,
      candidateId: row.candidate_id,
      selectionType: row.selection_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadataTag: row.metadata_tag
    };
  }
}

export const dreamTeamService = new DreamTeamService();