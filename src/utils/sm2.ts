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
  synonyms?: string;
  examples?: string[];
  
  // Stats
  state: CardState;
  nextReviewDate: number; // Timestamp
  interval: number;
  easeFactor: number;
  createdAt: number; // Timestamp
  
  // V9: User Feedback
  user_notes?: string;

  // V17: Word Forms
  word_forms?: {
      noun?: string;
      verb?: string;
      adj?: string;
      adv?: string;
      past?: string;
      pp?: string;
  };
}

// Configuration similar to Anki defaults
const SETTINGS = {
  learningSteps: [1, 10], // Minutes
  relearningSteps: [10], // Minutes
  graduatingInterval: 1, // Days
  easyInterval: 4, // Days (Restored to default SM-2)
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
      } else {
          // Good (4) or Easy (5)
          
          if (next.state === CardState.RELEARNING) {
               // Graduated back from Lapse
               next.state = CardState.REVIEW;
               next.interval = 1; // Reset to 1 day
          } else {
               // Standard Review
               next.interval = Math.round(next.interval * next.easeFactor);
               if (rating === 5) {
                   next.interval = Math.round(next.interval * SETTINGS.easyBonus);
               }
          }
          
          // SM-2 Ease Factor Formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
          // q = rating (0-5)
          const q = rating;
          const newEF = next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
          next.easeFactor = Math.max(1.3, newEF); // Minimum EF is 1.3

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
        synonyms: row.synonyms || undefined,
        examples: (() => {
            if (Array.isArray(row.examples)) return row.examples as string[];
            if (typeof row.examples === 'string') {
                try {
                    return JSON.parse(row.examples) as string[];
                } catch (e) {
                    return [row.examples]; // Fallback if not JSON
                }
            }
            return undefined;
        })(),
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor,
        createdAt: new Date(row.created_at).getTime(),
        // @ts-ignore - Supabase types might not be regenerated yet
        user_notes: row.user_notes || undefined,
        // @ts-ignore
        word_forms: row.word_forms || undefined
    }
}
