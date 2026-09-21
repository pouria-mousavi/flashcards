interface Candidate { id: string; back: string; state: string }
export const CALM_ROUND_SIZE = 5;

/** One short due card opens the round; the rest retain scheduler order. */
export function calmReviewOrder<T extends Candidate>(cards: T[]): T[] {
  const warmup = cards.find(c => c.state === 'REVIEW' && c.back.trim().split(/\s+/).length <= 5);
  return warmup ? [warmup, ...cards.filter(c => c.id !== warmup.id)] : cards;
}
