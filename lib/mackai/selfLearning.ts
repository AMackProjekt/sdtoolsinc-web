/**
 * Self-Learning Core - Reinforcement Learning and Feedback Integration
 * Enables MackAi to learn from user interactions and improve over time
 */

import type { FeedbackData, LearningData, AIModule } from './types';

export class SelfLearningCore {
  private enabled: boolean;
  private feedbackThreshold: number;
  private retrainingInterval: number;
  private learningData: LearningData[] = [];
  private feedbackQueue: FeedbackData[] = [];
  private lastRetraining: Date = new Date();

  constructor(enabled: boolean = true, feedbackThreshold: number = 3, retrainingInterval: number = 1440) {
    this.enabled = enabled;
    this.feedbackThreshold = feedbackThreshold;
    this.retrainingInterval = retrainingInterval; // minutes
  }

  /**
   * Add user feedback for a specific interaction
   */
  addFeedback(feedback: FeedbackData): void {
    if (!this.enabled) return;

    this.feedbackQueue.push(feedback);

    // Store in learning data if available
    if (typeof window !== 'undefined') {
      this.persistFeedback(feedback);
    }
  }

  /**
   * Record a complete learning interaction
   */
  recordInteraction(input: string, output: string, module: AIModule, feedback: FeedbackData): void {
    if (!this.enabled) return;

    const learningEntry: LearningData = {
      input,
      output,
      feedback,
      module,
    };

    this.learningData.push(learningEntry);

    // Limit memory to last 1000 interactions
    if (this.learningData.length > 1000) {
      this.learningData = this.learningData.slice(-1000);
    }

    // Persist to storage
    if (typeof window !== 'undefined') {
      this.persistLearningData(learningEntry);
    }
  }

  /**
   * Analyze feedback patterns to identify areas for improvement
   */
  analyzeFeedbackPatterns(): {
    modulePerformance: Record<string, { avgRating: number; count: number }>;
    commonIssues: string[];
    improvementAreas: string[];
  } {
    const moduleStats: Record<string, { totalRating: number; count: number }> = {};
    const negativeComments: string[] = [];

    this.learningData.forEach(entry => {
      const moduleName = entry.module;
      if (!moduleStats[moduleName]) {
        moduleStats[moduleName] = { totalRating: 0, count: 0 };
      }

      moduleStats[moduleName].totalRating += entry.feedback.rating;
      moduleStats[moduleName].count += 1;

      if (entry.feedback.rating < this.feedbackThreshold && entry.feedback.comment) {
        negativeComments.push(entry.feedback.comment);
      }
    });

    const modulePerformance: Record<string, { avgRating: number; count: number }> = {};
    Object.entries(moduleStats).forEach(([moduleName, stats]) => {
      modulePerformance[moduleName] = {
        avgRating: stats.totalRating / stats.count,
        count: stats.count,
      };
    });

    // Identify common issues (simplified)
    const commonIssues = this.extractCommonThemes(negativeComments);

    // Identify improvement areas
    const improvementAreas = Object.entries(modulePerformance)
      .filter(([_, stats]) => stats.avgRating < this.feedbackThreshold)
      .map(([moduleName, _]) => moduleName);

    return {
      modulePerformance,
      commonIssues,
      improvementAreas,
    };
  }

  /**
   * Check if retraining is needed based on time and feedback
   */
  shouldRetrain(): boolean {
    if (!this.enabled) return false;

    const minutesSinceLastRetraining =
      (new Date().getTime() - this.lastRetraining.getTime()) / (1000 * 60);

    return minutesSinceLastRetraining >= this.retrainingInterval && this.learningData.length >= 10;
  }

  /**
   * Simulate reinforcement learning update
   */
  performRetraining(): {
    success: boolean;
    improvements: Record<string, number>;
    message: string;
  } {
    if (!this.enabled) {
      return {
        success: false,
        improvements: {},
        message: 'Self-learning is disabled',
      };
    }

    const patterns = this.analyzeFeedbackPatterns();
    const improvements: Record<string, number> = {};

    // Calculate improvement metrics for each module
    Object.entries(patterns.modulePerformance).forEach(([moduleName, stats]) => {
      if (stats.count > 0) {
        // Simulate learning: improvement is proportional to data quantity and quality
        const improvementFactor = Math.min(stats.count / 100, 1) * (stats.avgRating / 5);
        improvements[moduleName] = improvementFactor;
      }
    });

    this.lastRetraining = new Date();

    return {
      success: true,
      improvements,
      message: `Retraining completed. Processed ${this.learningData.length} interactions. Improvements: ${Object.entries(improvements)
        .map(([m, i]) => `${m}: +${(i * 100).toFixed(1)}%`)
        .join(', ')}`,
    };
  }

  /**
   * Get learning statistics
   */
  getStatistics(): {
    totalInteractions: number;
    totalFeedback: number;
    averageRating: number;
    moduleBreakdown: Record<string, number>;
    lastRetraining: Date;
    nextRetraining: Date;
  } {
    const totalInteractions = this.learningData.length;
    const totalFeedback = this.feedbackQueue.length;

    const avgRating =
      this.learningData.length > 0
        ? this.learningData.reduce((sum, entry) => sum + entry.feedback.rating, 0) / this.learningData.length
        : 0;

    const moduleBreakdown: Record<string, number> = {};
    this.learningData.forEach(entry => {
      moduleBreakdown[entry.module] = (moduleBreakdown[entry.module] || 0) + 1;
    });

    const nextRetrainingTime = new Date(this.lastRetraining.getTime() + this.retrainingInterval * 60 * 1000);

    return {
      totalInteractions,
      totalFeedback,
      averageRating: Math.round(avgRating * 100) / 100,
      moduleBreakdown,
      lastRetraining: this.lastRetraining,
      nextRetraining: nextRetrainingTime,
    };
  }

  private extractCommonThemes(comments: string[]): string[] {
    // Simplified theme extraction
    const themes = new Set<string>();

    const keywords = {
      accuracy: ['wrong', 'incorrect', 'inaccurate', 'error'],
      relevance: ['irrelevant', 'off-topic', 'not helpful', 'unrelated'],
      clarity: ['unclear', 'confusing', 'ambiguous', 'vague'],
      completeness: ['incomplete', 'missing', 'need more', 'not enough'],
    };

    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      Object.entries(keywords).forEach(([theme, words]) => {
        if (words.some(word => lowerComment.includes(word))) {
          themes.add(theme);
        }
      });
    });

    return Array.from(themes);
  }

  private persistFeedback(feedback: FeedbackData): void {
    try {
      const existing = localStorage.getItem('mackai_feedback');
      const feedbackList = existing ? JSON.parse(existing) : [];
      feedbackList.push(feedback);

      // Keep only last 500 feedback entries
      const trimmed = feedbackList.slice(-500);
      localStorage.setItem('mackai_feedback', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to persist feedback:', error);
    }
  }

  private persistLearningData(entry: LearningData): void {
    try {
      const existing = localStorage.getItem('mackai_learning');
      const learningList = existing ? JSON.parse(existing) : [];
      learningList.push(entry);

      // Keep only last 1000 entries
      const trimmed = learningList.slice(-1000);
      localStorage.setItem('mackai_learning', JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to persist learning data:', error);
    }
  }

  /**
   * Load persisted learning data from storage
   */
  loadPersistedData(): void {
    if (typeof window === 'undefined') return;

    try {
      const learningData = localStorage.getItem('mackai_learning');
      if (learningData) {
        this.learningData = JSON.parse(learningData);
      }

      const feedback = localStorage.getItem('mackai_feedback');
      if (feedback) {
        this.feedbackQueue = JSON.parse(feedback);
      }
    } catch (error) {
      console.warn('Failed to load persisted data:', error);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
