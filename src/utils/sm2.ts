import type { Database } from '../types/supabase';

export const CardState = {
  NEW: 'NEW',
  LEARNING: 'LEARNING',
  REVIEW: 'REVIEW',
  RELEARNING: 'RELEARNING',
} as const;

export type CardState = typeof CardState[keyof typeof CardState];

export interface OtherMeaning {
  english: string;
  persian: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  pronunciation?: string;
  tone?: string;
  synonyms?: string;
  examples?: string[];

  // Stats (NEVER touch during data migration)
  state: CardState;
  nextReviewDate: number;
  interval: number;
  easeFactor: number;
  createdAt: number;

  user_notes?: string;

  word_forms?: {
      noun?: string;
      verb?: string;
      adj?: string;
      adv?: string;
      past?: string;
      pp?: string;
  };

  other_meanings?: OtherMeaning[];
  native_speaking?: boolean;
}

// Anki-like SM-2 configuration
const SETTINGS = {
  learningSteps: [1, 10],       // Minutes
  relearningSteps: [10],         // Minutes
  graduatingInterval: 1,         // Days
  easyInterval: 4,               // Days
  minimumInterval: 1,            // Days
  easyBonus: 1.3,
  hardInterval: 1.2,
  lapseNewInterval: 0.5,         // After lapse, new interval = old * this (minimum 1 day)
  maxInterval: 365,              // Cap at 1 year
};

/**
 * SM-2 Algorithm Implementation
 * Rating: 0=Again, 3=Hard, 4=Good, 5=Easy
 */
export function calculateSM2(
  card: Flashcard,
  rating: number
): Partial<Flashcard> {
  const now = Date.now();
  const next = { ...card };

  // Infer learning step from interval
  let stepIndex = 0;
  if (next.state === CardState.LEARNING) {
      if (next.interval >= 10) stepIndex = 1;
  }

  // Store the previous interval for lapse recovery
  const previousReviewInterval = next.state === CardState.REVIEW ? next.interval : 1;

  // --- NEW or LEARNING ---
  if (next.state === CardState.NEW || next.state === CardState.LEARNING) {
    if (rating === 0) {
        next.state = CardState.LEARNING;
        next.interval = SETTINGS.learningSteps[0];
        next.nextReviewDate = now + next.interval * 60 * 1000;
    } else if (rating === 3) {
        next.state = CardState.LEARNING;
        if (next.interval === 0) next.interval = 1;
        next.nextReviewDate = now + next.interval * 60 * 1000;
    } else if (rating === 4) {
        if (stepIndex < SETTINGS.learningSteps.length - 1) {
            next.interval = SETTINGS.learningSteps[stepIndex + 1];
            next.state = CardState.LEARNING;
            next.nextReviewDate = now + next.interval * 60 * 1000;
        } else {
            next.state = CardState.REVIEW;
            next.interval = SETTINGS.graduatingInterval;
            next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
        }
    } else if (rating === 5) {
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.easyInterval;
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    }
  }

  // --- REVIEW ---
  else if (next.state === CardState.REVIEW) {
      if (rating === 0) {
          // Lapse: move to relearning
          next.state = CardState.RELEARNING;
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
          // Store the pre-lapse interval so we can recover it
          next.interval = SETTINGS.relearningSteps[0]; // 10m in minutes
          next.nextReviewDate = now + next.interval * 60 * 1000;
      } else if (rating === 3) {
          // Hard: small increase, penalty to ease
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(next.interval * SETTINGS.hardInterval));
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) {
          // Good: standard interval growth
          next.interval = Math.round(next.interval * next.easeFactor);
          // SM-2 ease factor adjustment
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 5) {
          // Easy: interval * EF * easyBonus
          next.interval = Math.round(next.interval * next.easeFactor * SETTINGS.easyBonus);
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
  }

  // --- RELEARNING ---
  else if (next.state === CardState.RELEARNING) {
      if (rating === 0) {
          // Again: stay in relearning
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
          next.interval = SETTINGS.relearningSteps[0];
          next.nextReviewDate = now + next.interval * 60 * 1000;
      } else if (rating === 3) {
          // Hard: graduate back but with reduced interval
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(previousReviewInterval * SETTINGS.lapseNewInterval));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) {
          // Good: graduate back
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(previousReviewInterval * SETTINGS.lapseNewInterval));
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 5) {
          // Easy: graduate back with better interval
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, previousReviewInterval);
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
  }

  // Cap interval
  if (next.state === CardState.REVIEW) {
      next.interval = Math.min(next.interval, SETTINGS.maxInterval);
  }

  return next;
}

// Mapper to convert DB Row -> App Flashcard
export function mapRowToCard(row: Database['public']['Tables']['cards']['Row']): Flashcard {
    return {
        id: row.id,
        front: row.front,
        back: row.back,
        pronunciation: row.pronunciation || undefined,
        tone: row.tone || undefined,
        synonyms: row.synonyms || undefined,
        examples: (() => {
            if (Array.isArray(row.examples)) return row.examples as string[];
            if (typeof row.examples === 'string') {
                try {
                    return JSON.parse(row.examples) as string[];
                } catch {
                    return [row.examples];
                }
            }
            return undefined;
        })(),
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor,
        createdAt: new Date(row.created_at).getTime(),
        user_notes: row.user_notes || undefined,
        word_forms: (() => {
            if (row.word_forms && typeof row.word_forms === 'object' && !Array.isArray(row.word_forms)) {
                const wf = row.word_forms as Record<string, unknown>;
                const result: Flashcard['word_forms'] = {};
                for (const key of ['noun', 'verb', 'adj', 'adv', 'past', 'pp'] as const) {
                    if (wf[key] && typeof wf[key] === 'string') {
                        result[key] = wf[key] as string;
                    }
                }
                return Object.keys(result).length > 0 ? result : undefined;
            }
            return undefined;
        })(),
        other_meanings: (() => {
            if (Array.isArray(row.other_meanings)) {
                return (row.other_meanings as unknown as OtherMeaning[]).filter(
                    m => m && typeof m.english === 'string' && typeof m.persian === 'string'
                );
            }
            return undefined;
        })(),
        native_speaking: row.native_speaking ?? false,
    };
}
