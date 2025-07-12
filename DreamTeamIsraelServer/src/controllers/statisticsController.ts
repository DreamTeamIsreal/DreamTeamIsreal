import { Request, Response } from 'express';
import { statisticsService } from '../services/statisticsService';
import { logger } from '../utils/logger';

export class StatisticsController {

  /**
   * Get comprehensive public statistics
   */
  async getPublicStatistics(req: Request, res: Response) {
    try {
      const statistics = await statisticsService.getComprehensiveStatistics();

      res.json({
        success: true,
        data: statistics
      });

    } catch (error) {
      logger.error('Error fetching public statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  /**
   * Get current national dream team (top ministers)
   */
  async getNationalDreamTeam(req: Request, res: Response) {
    try {
      const dreamTeam = await statisticsService.getNationalDreamTeam();

      res.json({
        success: true,
        data: {
          nationalDreamTeam: dreamTeam,
          totalPositions: 18, // Number of ministerial positions
          filledPositions: dreamTeam.length
        }
      });

    } catch (error) {
      logger.error('Error fetching national dream team:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch national dream team'
      });
    }
  }

  /**
   * Get current Knesset committees dream team
   */
  async getKnessetCommittees(req: Request, res: Response) {
    try {
      const committees = await statisticsService.getKnessetCommittees();

      res.json({
        success: true,
        data: {
          knessetCommittees: committees,
          totalCommittees: 15, // Number of Knesset committees
          filledCommittees: committees.length
        }
      });

    } catch (error) {
      logger.error('Error fetching Knesset committees:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Knesset committees'
      });
    }
  }

  /**
   * Get candidates for a specific position
   */
  async getCandidatesForPosition(req: Request, res: Response) {
    try {
      const { positionId } = req.params;
      const { type } = req.query;

      if (!positionId) {
        return res.status(400).json({
          success: false,
          message: 'Position ID is required'
        });
      }

      if (!type || !['minister', 'committee'].includes(type as string)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be "minister" or "committee"'
        });
      }

      const candidates = await statisticsService.getCandidatesForPosition(
        positionId, 
        type as 'minister' | 'committee'
      );

      res.json({
        success: true,
        data: {
          positionId,
          type,
          candidates,
          totalCandidates: candidates.length
        }
      });

    } catch (error) {
      logger.error('Error fetching candidates for position:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch candidates for position'
      });
    }
  }

  /**
   * Get total participant count
   */
  async getTotalParticipants(req: Request, res: Response) {
    try {
      const totalParticipants = await statisticsService.getTotalParticipants();

      res.json({
        success: true,
        data: {
          totalParticipants
        }
      });

    } catch (error) {
      logger.error('Error fetching total participants:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch participant count'
      });
    }
  }

  /**
   * Get total registered candidates count
   */
  async getRegisteredCandidates(req: Request, res: Response) {
    try {
      const registeredCandidates = await statisticsService.getRegisteredCandidates();

      res.json({
        success: true,
        data: {
          registeredCandidates
        }
      });

    } catch (error) {
      logger.error('Error fetching registered candidates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registered candidates count'
      });
    }
  }

  /**
   * Get quiz completion statistics
   */
  async getQuizStatistics(req: Request, res: Response) {
    try {
      const quizStats = await statisticsService.getQuizStatistics();

      res.json({
        success: true,
        data: quizStats
      });

    } catch (error) {
      logger.error('Error fetching quiz statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz statistics'
      });
    }
  }

  /**
   * Get supporter statistics
   */
  async getSupporterStatistics(req: Request, res: Response) {
    try {
      const supporterStats = await statisticsService.getSupporterStatistics();

      res.json({
        success: true,
        data: supporterStats
      });

    } catch (error) {
      logger.error('Error fetching supporter statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch supporter statistics'
      });
    }
  }

  /**
   * Get real-time dashboard data (admin only)
   */
  async getDashboardData(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      // Gather all statistics in parallel
      const [
        totalParticipants,
        registeredCandidates,
        nationalDreamTeam,
        knessetCommittees,
        quizStats,
        supporterStats
      ] = await Promise.all([
        statisticsService.getTotalParticipants(),
        statisticsService.getRegisteredCandidates(),
        statisticsService.getNationalDreamTeam(),
        statisticsService.getKnessetCommittees(),
        statisticsService.getQuizStatistics(),
        statisticsService.getSupporterStatistics()
      ]);

      const dashboardData = {
        overview: {
          totalParticipants,
          registeredCandidates,
          quizCompletionRate: quizStats.completionRate,
          totalSupports: supporterStats.totalSupports
        },
        dreamTeams: {
          nationalDreamTeam,
          knessetCommittees
        },
        engagement: {
          quiz: quizStats,
          supporters: supporterStats
        },
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: dashboardData
      });

    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  }

  /**
   * Get trends and analytics (admin only)
   */
  async getTrends(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { timeframe } = req.query;
      const validTimeframes = ['24h', '7d', '30d', '90d'];
      
      if (timeframe && !validTimeframes.includes(timeframe as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid timeframe. Use: 24h, 7d, 30d, or 90d'
        });
      }

      // This would be implemented with actual trend calculations
      // For now, return placeholder data
      const trends = {
        participantGrowth: {
          timeframe: timeframe || '7d',
          data: [
            { date: '2024-01-01', count: 1000 },
            { date: '2024-01-02', count: 1250 },
            { date: '2024-01-03', count: 1500 },
            // ... more data points
          ]
        },
        candidateRegistrations: {
          timeframe: timeframe || '7d',
          data: [
            { date: '2024-01-01', count: 50 },
            { date: '2024-01-02', count: 75 },
            { date: '2024-01-03', count: 100 },
            // ... more data points
          ]
        },
        quizCompletions: {
          timeframe: timeframe || '7d',
          data: [
            { date: '2024-01-01', count: 200 },
            { date: '2024-01-02', count: 300 },
            { date: '2024-01-03', count: 450 },
            // ... more data points
          ]
        },
        supportActivity: {
          timeframe: timeframe || '7d',
          data: [
            { date: '2024-01-01', count: 500 },
            { date: '2024-01-02', count: 750 },
            { date: '2024-01-03', count: 1200 },
            // ... more data points
          ]
        }
      };

      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      logger.error('Error fetching trends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trends'
      });
    }
  }

  /**
   * Get geographic distribution statistics
   */
  async getGeographicDistribution(req: Request, res: Response) {
    try {
      // This would be implemented with actual geographic analysis
      // For now, return placeholder data for Israeli cities
      const distribution = {
        participants: {
          'תל אביב': 15000,
          'ירושלים': 12000,
          'חיפה': 8000,
          'באר שבע': 5000,
          'נתניה': 4000,
          'פתח תקווה': 3500,
          'אשדוד': 3000,
          'ראשון לציון': 2500,
          'אשקלון': 2000,
          'רחובות': 1500
        },
        candidates: {
          'תל אביב': 45,
          'ירושלים': 38,
          'חיפה': 22,
          'באר שבע': 15,
          'נתניה': 12,
          'פתח תקווה': 10,
          'אשדוד': 8,
          'ראשון לציון': 7,
          'אשקלון': 5,
          'רחובות': 4
        }
      };

      res.json({
        success: true,
        data: distribution
      });

    } catch (error) {
      logger.error('Error fetching geographic distribution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch geographic distribution'
      });
    }
  }

  /**
   * Export statistics data (admin only)
   */
  async exportStatistics(req: Request, res: Response) {
    try {
      // Check if user is admin
      if (!req.user!.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { format } = req.query;
      const validFormats = ['json', 'csv'];
      
      if (format && !validFormats.includes(format as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid format. Use: json or csv'
        });
      }

      const exportFormat = (format as string) || 'json';
      
      // Get comprehensive statistics
      const statistics = await statisticsService.getComprehensiveStatistics();
      const quizStats = await statisticsService.getQuizStatistics();
      const supporterStats = await statisticsService.getSupporterStatistics();

      const exportData = {
        generatedAt: new Date().toISOString(),
        overview: statistics,
        quiz: quizStats,
        supporters: supporterStats
      };

      if (exportFormat === 'csv') {
        // Convert to CSV format
        const csvHeaders = ['Metric', 'Value'];
        const csvRows = [
          ['Total Participants', statistics.totalParticipants],
          ['Registered Candidates', statistics.registeredCandidates],
          ['Quiz Completion Rate', `${quizStats.completionRate}%`],
          ['Total Quiz Responses', quizStats.totalResponses],
          ['Total Supports', supporterStats.totalSupports],
          ['Avg Supports Per Candidate', supporterStats.avgSupportsPerCandidate]
        ];

        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="dreamteam-statistics-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="dreamteam-statistics-${new Date().toISOString().split('T')[0]}.json"`);
        res.json(exportData);
      }

    } catch (error) {
      logger.error('Error exporting statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export statistics'
      });
    }
  }
}

export const statisticsController = new StatisticsController();