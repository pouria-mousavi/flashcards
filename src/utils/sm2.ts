import type { Database } from '../types/supabase';

export const CardState = {
  NEW: 'NEW',
  LEARNING: 'LEARNING',
  REVIEW: 'REVIEW',
  RELEARNING: 'RELEARNING',
} as const;

export type CardState = typeof CardState[keyof typeof CardState];

// The shape of a card as used in the UI (camelCase)
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  pronunciation?: string;
  tone?: string;
  examples?: string[];
  
  // Stats
  state: CardState;
  nextReviewDate: number; // Timestamp
  interval: number;
  easeFactor: number;
}

// Configuration similar to Anki defaults
const SETTINGS = {
  learningSteps: [1, 10], // Minutes
  relearningSteps: [10], // Minutes
  graduatingInterval: 1, // Days
  easyInterval: 4, // Days
  minimumInterval: 1,
  easyBonus: 1.3,
  intervalModifier: 1.0,
  hardInterval: 1.2, // Multiplier for Hard
};

/**
 * Calculates new stats based on the user's rating.
 * Rating: 0=Again, 3=Hard, 4=Good, 5=Easy
 */
export function calculateSM2(
  card: Flashcard,
  rating: number
): Partial<Flashcard> {
  const now = Date.now();
  let next = { ...card };
  
  // We use a stepIndex in logic but typically state is enough for simple approximation.
  // Real Anki stores 'step' index. For this simple app, we infer step from state/interval slightly or just simplify.
  // Let's assume:
  // LEARNING -> step 0 (1m).
  // If we want 2 steps, we need to store step index in DB.
  // Schema didn't have step_index.
  // Simplification for V1 DB: 
  // LEARNING means "in ephemeral steps". We can just use the 'interval' field to store 'minutes' when in learning?
  // OR just cycle learning: Again -> 1m, Good -> 10m -> Review.
  
  // Let's use 'interval' as 'minutes' when in LEARNING state.
  
  let stepIndex = 0;
  if (next.state === CardState.LEARNING) {
      if (next.interval === 1) stepIndex = 0;
      else if (next.interval === 10) stepIndex = 1;
      else if (next.interval > 10) stepIndex = 1; // Cap
  }

  // --- NEW or LEARNING ---
  if (next.state === CardState.NEW || next.state === CardState.LEARNING) {
    if (rating === 0) {
        // Again
        next.state = CardState.LEARNING;
        next.interval = SETTINGS.learningSteps[0]; // 1 min
        next.nextReviewDate = now + next.interval * 60 * 1000;
    } else if (rating === 3) {
        // Hard (Repeat step)
        next.state = CardState.LEARNING;
        // Keep current interval but update review time
        if (next.interval === 0) next.interval = 1; 
        next.nextReviewDate = now + next.interval * 60 * 1000;
    } else if (rating === 4) {
        // Good
        if (stepIndex < SETTINGS.learningSteps.length - 1) {
            // Next step
            next.interval = SETTINGS.learningSteps[stepIndex + 1];
            next.state = CardState.LEARNING;
            next.nextReviewDate = now + next.interval * 60 * 1000;
        } else {
            // Graduate
            next.state = CardState.REVIEW;
            next.interval = SETTINGS.graduatingInterval; // 1 Day
            next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
        }
    } else if (rating === 5) {
        // Easy
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.easyInterval;
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    }
  }

  // --- REVIEW (Stable) ---
  else if (next.state === CardState.REVIEW || next.state === CardState.RELEARNING) {
      if (rating === 0) {
          // Lapse
          next.state = CardState.RELEARNING;
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2); 
          next.interval = 10; // Relearn step (10m)
          next.nextReviewDate = now + next.interval * 60 * 1000;
      } else if (rating === 3) {
          // Hard
          next.interval = Math.max(1, Math.floor(next.interval * SETTINGS.hardInterval));
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) {
          // Good
                if (next.state === CardState.RELEARNING) {
                     // Graduated back
                     next.state = CardState.REVIEW;
                     next.interval = 1; // Reset to 1 day or calculate based on lapse? Anki defaults to 1.
                } else {
                     next.interval = Math.round(next.interval * next.easeFactor);
                }
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 5) {
          // Easy
          if (next.state === CardState.RELEARNING) next.state = CardState.REVIEW;
          next.easeFactor += 0.15;
          next.interval = Math.round(next.interval * next.easeFactor * SETTINGS.easyBonus);
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
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
        examples: row.examples || undefined,
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor
    }
}
