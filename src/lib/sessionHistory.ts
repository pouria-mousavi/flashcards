import { studyDay } from './studyTime.ts';

export interface DaySession {
  studied_on: string;
  cards_done: number;
  correct: number;
  again_count: number;
}
export interface HistoryReview { reviewed_at: string; rating: number }

/** Legacy day totals are retained; only new, accepted review events are added. */
export function mergeSessions(legacy: DaySession[], events: HistoryReview[]): DaySession[] {
  const days = new Map(legacy.map(day => [day.studied_on, { ...day }]));
  for (const event of events) {
    const date = studyDay(Date.parse(event.reviewed_at));
    const day = days.get(date) ?? { studied_on: date, cards_done: 0, correct: 0, again_count: 0 };
    day.cards_done++;
    if (event.rating === 0) day.again_count++;
    else day.correct++;
    days.set(date, day);
  }
  return [...days.values()].sort((a, b) => b.studied_on.localeCompare(a.studied_on));
}
