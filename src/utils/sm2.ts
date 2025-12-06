
export const CardState = {
  NEW: 'NEW',
  LEARNING: 'LEARNING',
  REVIEW: 'REVIEW',
  RELEARNING: 'RELEARNING',
} as const;

export type CardState = typeof CardState[keyof typeof CardState];

export interface CardStats {
  state: CardState;
  stepIndex: number; // For learning/relearning steps
  interval: number; // In days (or minutes if < 1, but usually stored in minutes for learning)
  easeFactor: number;
  repetitions: number; // Consecutive correct
  nextReviewDate: number; // Timestamp
  lapses: number; // How many times it was forgotten
}

export const initialStats: CardStats = {
  state: CardState.NEW,
  stepIndex: 0,
  interval: 0,
  easeFactor: 2.5,
  repetitions: 0,
  nextReviewDate: 0, // 0 means "Ready now" for new cards
  lapses: 0,
};

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
  current: CardStats,
  rating: number
): CardStats {
  const now = Date.now();
  let next = { ...current };

  // --- NEW or LEARNING ---
  if (next.state === CardState.NEW || next.state === CardState.LEARNING) {
    if (rating === 0) {
        // Again: Reset step
        next.state = CardState.LEARNING;
        next.stepIndex = 0;
        next.nextReviewDate = now + SETTINGS.learningSteps[0] * 60 * 1000;
    } else if (rating === 3) {
        // Hard: Repeat step (no advance), allow slight delay? Anki usually treats Hard on learning as "avg of 2 steps".
        // For simplicity: Stay on current step, review again effectively same time or slightly later.
        // Let's just set it to current step interval.
        const stepMin = SETTINGS.learningSteps[next.stepIndex];
        next.state = CardState.LEARNING;
        next.nextReviewDate = now + stepMin * 60 * 1000;
    } else if (rating === 4) {
        // Good: Advance step
        if (next.stepIndex < SETTINGS.learningSteps.length - 1) {
            // Move to next step
            next.stepIndex++;
            next.state = CardState.LEARNING;
            const stepMin = SETTINGS.learningSteps[next.stepIndex];
            next.nextReviewDate = now + stepMin * 60 * 1000;
        } else {
            // Graduate
            next.state = CardState.REVIEW;
            next.stepIndex = 0;
            next.interval = SETTINGS.graduatingInterval;
            next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
        }
    } else if (rating === 5) {
        // Easy: Graduate immediately (to Easy Interval)
        next.state = CardState.REVIEW;
        next.stepIndex = 0;
        next.interval = SETTINGS.easyInterval;
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    }
    return next;
  }

  // --- REVIEW or RELEARNING ---
  // If Relearning, it behaves like Learning but keeps Review stats underneath
  if (next.state === CardState.RELEARNING) {
      if (rating === 0) {
          next.stepIndex = 0;
          next.nextReviewDate = now + SETTINGS.relearningSteps[0] * 60 * 1000;
      } else if (rating === 4) {
          if (next.stepIndex < SETTINGS.relearningSteps.length - 1) {
              next.stepIndex++;
              next.nextReviewDate = now + SETTINGS.relearningSteps[next.stepIndex] * 60 * 1000;
          } else {
              // Graduate back to Review
              next.state = CardState.REVIEW;
              // New interval = max(1, original_interval * new_interval_factor??)
              // Anki reduces interval on lapse. default is 0% (reset to 1) or specific %.
              // Let's set to 1 day for simplicity on lapse recovery, or keep it short.
              next.interval = 1; 
              next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
          }
      } else if (rating === 5) {
          // Instant graduate
          next.state = CardState.REVIEW;
          next.interval = 4;
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
      return next;
  }

  // --- REVIEW (Stable) ---
  if (rating === 0) {
      // Lapse
      next.state = CardState.RELEARNING;
      next.stepIndex = 0;
      next.lapses++;
      next.easeFactor = Math.max(1.3, next.easeFactor - 0.2); // Anki penalty
      next.interval = 1; // Temporary placeholder, will be overridden by step
      next.nextReviewDate = now + SETTINGS.relearningSteps[0] * 60 * 1000;
  } else if (rating === 3) {
      // Hard
      next.interval = Math.max(1, next.interval * SETTINGS.hardInterval);
      next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
      next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
  } else if (rating === 4) {
      // Good
      next.interval = Math.round(next.interval * next.easeFactor);
      next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
  } else if (rating === 5) {
      // Easy
      next.easeFactor += 0.15;
      next.interval = Math.round(next.interval * next.easeFactor * SETTINGS.easyBonus);
      next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
  }

  return next;
}
