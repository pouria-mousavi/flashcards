import type { Card } from 'ts-fsrs';

export type Deck = 'swedish' | 'english' | 'grammar';
export type StoredFSRS = Omit<Card, 'due' | 'last_review'> & { due: string; last_review?: string };
export interface SchedulerMetadata {
  fsrs?: StoredFSRS;
  scheduleRevision?: number;
  scheduleEventId?: string | null;
}
export interface StudyStats {
  state: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  nextReviewDate: number;
  interval: number;
  easeFactor: number;
  masteryLevel?: number;
  consecutiveCorrect?: number;
  consecutiveIncorrect?: number;
  totalReviews?: number;
  lapses?: number;
  priority?: 'high' | 'medium' | 'low';
}
export interface StudyState {
  user_id: string;
  deck: Deck;
  card_id: string;
  revision: number;
  last_event_id: string;
  fsrs: StoredFSRS;
  stats: StudyStats;
}
export interface ReviewEvent {
  id: string;
  deck: Deck;
  card_id: string;
  expected_revision: number;
  parent_event_id: string | null;
  rating: 0 | 3 | 4 | 5;
  reviewed_at: string;
  duration_ms: number;
  before_stats: StudyStats;
  after_stats: StudyStats;
  fsrs_before: StoredFSRS | null;
  fsrs_after: StoredFSRS;
  initialization: 'new' | 'legacy' | null;
  algorithm: string;
}
