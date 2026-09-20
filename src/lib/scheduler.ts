import { createEmptyCard, fsrs, Rating, State } from 'ts-fsrs';
import type { Card, Grade } from 'ts-fsrs';
import { applyMastery } from '../utils/sm2.ts';
import type { SRSCard } from '../utils/sm2';
import type { Deck, ReviewEvent, StoredFSRS, StudyStats } from './studyTypes';

export const SCHEDULER_VERSION = 'ts-fsrs@5.4.2-retention-0.90';
const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: true, maximum_interval: 1095,
  learning_steps: ['10m'], relearning_steps: ['10m'] });
const grades: Record<ReviewEvent['rating'], Grade> = { 0: Rating.Again, 3: Rating.Hard, 4: Rating.Good, 5: Rating.Easy };
const states = { [State.New]: 'NEW', [State.Learning]: 'LEARNING', [State.Review]: 'REVIEW', [State.Relearning]: 'RELEARNING' } as const;

function store(card: Card): StoredFSRS {
  return { ...card, due: card.due.toISOString(), last_review: card.last_review?.toISOString() };
}

export function studyStats(card: StudyStats): StudyStats {
  return {
    state: card.state, nextReviewDate: card.nextReviewDate, interval: card.interval, easeFactor: card.easeFactor,
    masteryLevel: card.masteryLevel ?? 0, consecutiveCorrect: card.consecutiveCorrect ?? 0,
    consecutiveIncorrect: card.consecutiveIncorrect ?? 0, totalReviews: card.totalReviews ?? 0,
    lapses: card.lapses ?? 0, priority: card.priority ?? 'medium',
  };
}

/** Old deadlines remain untouched until a real rating. The first rating anchors
 * FSRS at the current time; smoothed legacy due dates are never fake history. */
export function nextReview<T extends SRSCard>(card: T, rating: ReviewEvent['rating'], now = Date.now()): T {
  const result = scheduler.next(card.fsrs ?? createEmptyCard(new Date(now)), new Date(now), grades[rating]);
  const next = {
    ...card, state: states[result.card.state], nextReviewDate: result.card.due.getTime(),
    interval: result.card.state === State.Review ? result.card.scheduled_days : Math.max(1, (result.card.due.getTime() - now) / 60000),
    fsrs: store(result.card), scheduleRevision: (card.scheduleRevision ?? 0) + 1,
  };
  applyMastery(card, rating, next);
  return next;
}

export function makeReview<T extends SRSCard & { id: string }>(card: T, deck: Deck,
  rating: ReviewEvent['rating'], durationMs: number, now = Date.now(), id = crypto.randomUUID()) {
  const updated = { ...nextReview(card, rating, now), scheduleEventId: id };
  const event: ReviewEvent = {
    id, deck, card_id: card.id, expected_revision: card.scheduleRevision ?? 0,
    parent_event_id: card.scheduleEventId ?? null, rating, reviewed_at: new Date(now).toISOString(),
    duration_ms: Math.max(0, Math.min(1200000, Math.round(durationMs))),
    before_stats: studyStats(card), after_stats: studyStats(updated),
    fsrs_before: card.fsrs ?? null, fsrs_after: updated.fsrs!,
    initialization: card.fsrs ? null : card.state === 'NEW' ? 'new' : 'legacy', algorithm: SCHEDULER_VERSION,
  };
  return { updated, event };
}

export function previewReview(card: SRSCard, rating: ReviewEvent['rating']): string {
  const now = Date.now();
  const delay = nextReview(card, rating, now).nextReviewDate - now;
  if (delay < 3600000) return `${Math.max(1, Math.round(delay / 60000))}m`;
  if (delay < 86400000) return `${Math.round(delay / 3600000)}h`;
  return `${Math.round(delay / 86400000)}d`;
}

export function recallPriority(card: SRSCard, now = Date.now()): number {
  if (card.fsrs) return scheduler.get_retrievability(card.fsrs, new Date(now), false);
  return 1 / (1 + Math.max(0, now - card.nextReviewDate) / 86400000 / Math.max(1, card.interval));
}
