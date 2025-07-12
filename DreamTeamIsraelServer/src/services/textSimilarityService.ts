import { logger } from '../utils/logger';
import crypto from 'crypto';

export class TextSimilarityService {

  /**
   * Calculate text similarity using cosine similarity of embeddings
   * This is a placeholder implementation. In production, you would use:
   * - OpenAI Embeddings API
   * - Cohere Embeddings
   * - Local sentence transformers
   */
  async calculateTextSimilarity(text1: string, text2: string): Promise<number> {
    try {
      // PLACEHOLDER: Simple hash-based similarity for demonstration
      // Replace with actual AI/ML embeddings in production
      const similarity = this.calculateSimpleTextSimilarity(text1, text2);
      
      logger.debug('Text similarity calculated', { 
        text1Length: text1.length, 
        text2Length: text2.length, 
        similarity 
      });

      return similarity;

    } catch (error) {
      logger.error('Error calculating text similarity:', error);
      throw new Error('Failed to calculate text similarity');
    }
  }

  /**
   * Calculate vision-based matching between voter and candidate
   */
  async calculateVisionMatch(
    voterVision: string, 
    candidateVision: string, 
    candidateWorkPlans: {
      fiveYearPlan?: string;
      longTermVision2048?: string;
      detailedAnnualPlan?: string;
      visionAndWorkPlanInCommittee?: string;
    }
  ): Promise<number> {
    try {
      if (!voterVision.trim()) {
        return 0; // No voter vision to compare
      }

      // Combine all candidate texts
      const combinedCandidateText = [
        candidateVision,
        candidateWorkPlans.fiveYearPlan || '',
        candidateWorkPlans.longTermVision2048 || '',
        candidateWorkPlans.detailedAnnualPlan || '',
        candidateWorkPlans.visionAndWorkPlanInCommittee || ''
      ].filter(text => text.trim()).join(' ');

      if (!combinedCandidateText.trim()) {
        return 0; // No candidate content to compare
      }

      // Calculate similarity
      const similarity = await this.calculateTextSimilarity(voterVision, combinedCandidateText);

      return Math.round(similarity * 100); // Return as percentage

    } catch (error) {
      logger.error('Error calculating vision match:', error);
      throw new Error('Failed to calculate vision match');
    }
  }

  /**
   * Batch calculate similarities for multiple candidates
   */
  async batchCalculateVisionMatches(
    voterVision: string,
    candidates: Array<{
      id: string;
      vision: string;
      workPlans: {
        fiveYearPlan?: string;
        longTermVision2048?: string;
        detailedAnnualPlan?: string;
        visionAndWorkPlanInCommittee?: string;
      };
    }>
  ): Promise<Array<{ candidateId: string; visionMatchPercentage: number }>> {
    try {
      if (!voterVision.trim()) {
        return candidates.map(c => ({ candidateId: c.id, visionMatchPercentage: 0 }));
      }

      const results = await Promise.all(
        candidates.map(async (candidate) => {
          const matchPercentage = await this.calculateVisionMatch(
            voterVision,
            candidate.vision,
            candidate.workPlans
          );

          return {
            candidateId: candidate.id,
            visionMatchPercentage: matchPercentage
          };
        })
      );

      return results;

    } catch (error) {
      logger.error('Error in batch vision matching:', error);
      throw new Error('Failed to calculate batch vision matches');
    }
  }

  /**
   * Simple text similarity implementation (placeholder)
   * Replace with actual AI/ML embeddings in production
   */
  private calculateSimpleTextSimilarity(text1: string, text2: string): number {
    // Normalize texts
    const normalizedText1 = this.normalizeText(text1);
    const normalizedText2 = this.normalizeText(text2);

    if (!normalizedText1 || !normalizedText2) {
      return 0;
    }

    // Simple word overlap similarity
    const words1 = new Set(normalizedText1.split(/\s+/));
    const words2 = new Set(normalizedText2.split(/\s+/));

    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);

    // Jaccard similarity
    const jaccardSimilarity = intersection.size / union.size;

    // Length-based weighting
    const lengthRatio = Math.min(text1.length, text2.length) / Math.max(text1.length, text2.length);
    
    // Combined similarity score
    return (jaccardSimilarity * 0.7 + lengthRatio * 0.3);
  }

  /**
   * Normalize text for comparison
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0590-\u05FF]/g, '') // Keep Hebrew characters
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * PRODUCTION IMPLEMENTATION PLACEHOLDER
   * Replace this with actual OpenAI embeddings integration
   */
  async calculateOpenAIEmbeddingSimilarity(text1: string, text2: string): Promise<number> {
    try {
      // This would be the actual implementation using OpenAI
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        logger.warn('OpenAI API key not configured, falling back to simple similarity');
        return this.calculateSimpleTextSimilarity(text1, text2);
      }

      // PLACEHOLDER: Actual OpenAI integration would look like:
      /*
      const openai = new OpenAI({ apiKey: openaiApiKey });
      
      const [embedding1, embedding2] = await Promise.all([
        openai.embeddings.create({
          model: "text-embedding-3-small",
          input: text1,
        }),
        openai.embeddings.create({
          model: "text-embedding-3-small", 
          input: text2,
        })
      ]);

      const vector1 = embedding1.data[0].embedding;
      const vector2 = embedding2.data[0].embedding;

      return this.cosineSimilarity(vector1, vector2);
      */

      // For now, return simple similarity
      return this.calculateSimpleTextSimilarity(text1, text2);

    } catch (error) {
      logger.error('Error with OpenAI embedding similarity:', error);
      // Fallback to simple similarity
      return this.calculateSimpleTextSimilarity(text1, text2);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Extract key themes/topics from text
   * This is a simple implementation - would use NLP libraries in production
   */
  extractKeyThemes(text: string): string[] {
    const normalizedText = this.normalizeText(text);
    
    // Hebrew and English political keywords
    const politicalKeywords = [
      'כלכלה', 'economy', 'economic',
      'חינוך', 'education', 'educational',
      'בריאות', 'health', 'healthcare',
      'ביטחון', 'security', 'defense',
      'חברה', 'society', 'social',
      'סביבה', 'environment', 'environmental',
      'טכנולוגיה', 'technology', 'tech',
      'חדשנות', 'innovation', 'innovative',
      'משפט', 'justice', 'legal',
      'דמוקרטיה', 'democracy', 'democratic',
      'שוויון', 'equality', 'equal',
      'צדק', 'justice', 'fair',
      'פיתוח', 'development', 'develop',
      'תשתיות', 'infrastructure',
      'תעסוקה', 'employment', 'jobs',
      'דיור', 'housing', 'homes',
      'תחבורה', 'transportation', 'transport'
    ];

    const foundThemes = politicalKeywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );

    return [...new Set(foundThemes)]; // Remove duplicates
  }

  /**
   * Calculate thematic overlap between voter and candidate
   */
  calculateThematicSimilarity(voterText: string, candidateText: string): number {
    const voterThemes = new Set(this.extractKeyThemes(voterText));
    const candidateThemes = new Set(this.extractKeyThemes(candidateText));

    if (voterThemes.size === 0 || candidateThemes.size === 0) {
      return 0;
    }

    const intersection = new Set([...voterThemes].filter(theme => candidateThemes.has(theme)));
    const union = new Set([...voterThemes, ...candidateThemes]);

    return intersection.size / union.size;
  }

  /**
   * Advanced similarity calculation combining multiple methods
   */
  async calculateAdvancedSimilarity(
    voterText: string, 
    candidateText: string
  ): Promise<{
    overallSimilarity: number;
    textSimilarity: number;
    thematicSimilarity: number;
    embeddingSimilarity?: number;
  }> {
    try {
      const [textSimilarity, thematicSimilarity] = await Promise.all([
        this.calculateTextSimilarity(voterText, candidateText),
        Promise.resolve(this.calculateThematicSimilarity(voterText, candidateText))
      ]);

      // Try embedding similarity if available
      let embeddingSimilarity: number | undefined;
      try {
        embeddingSimilarity = await this.calculateOpenAIEmbeddingSimilarity(voterText, candidateText);
      } catch (error) {
        logger.debug('Embedding similarity not available:', error);
      }

      // Weighted combination
      let overallSimilarity: number;
      if (embeddingSimilarity !== undefined) {
        overallSimilarity = (
          textSimilarity * 0.3 + 
          thematicSimilarity * 0.2 + 
          embeddingSimilarity * 0.5
        );
      } else {
        overallSimilarity = (
          textSimilarity * 0.6 + 
          thematicSimilarity * 0.4
        );
      }

      return {
        overallSimilarity: Math.round(overallSimilarity * 10000) / 100, // 2 decimal places
        textSimilarity: Math.round(textSimilarity * 10000) / 100,
        thematicSimilarity: Math.round(thematicSimilarity * 10000) / 100,
        embeddingSimilarity: embeddingSimilarity ? Math.round(embeddingSimilarity * 10000) / 100 : undefined
      };

    } catch (error) {
      logger.error('Error calculating advanced similarity:', error);
      throw new Error('Failed to calculate advanced similarity');
    }
  }

  /**
   * Cache similarity calculations to improve performance
   */
  private similarityCache = new Map<string, number>();

  private getCacheKey(text1: string, text2: string): string {
    const hash1 = crypto.createHash('sha256').update(text1).digest('hex').substring(0, 16);
    const hash2 = crypto.createHash('sha256').update(text2).digest('hex').substring(0, 16);
    return `${hash1}_${hash2}`;
  }

  async calculateCachedSimilarity(text1: string, text2: string): Promise<number> {
    const cacheKey = this.getCacheKey(text1, text2);
    
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey)!;
    }

    const similarity = await this.calculateTextSimilarity(text1, text2);
    this.similarityCache.set(cacheKey, similarity);

         // Limit cache size
     if (this.similarityCache.size > 1000) {
       const firstKey = this.similarityCache.keys().next().value;
       if (firstKey) {
         this.similarityCache.delete(firstKey);
       }
     }

    return similarity;
  }
}

export const textSimilarityService = new TextSimilarityService();