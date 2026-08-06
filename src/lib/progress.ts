import { supabase } from './supabase';
import type { SwedishCard } from '../utils/sm2';
import { CardState } from '../utils/sm2';

/**
 * Progress & weak-area reporting.
 *
 * Ideas ported from github.com/m98/fluent: a session log (streaks + accuracy
 * trend), per-item mastery levels, and a mistakes database — the last one
 * reframed for a flashcard deck, where "error pattern" means the card topic you
 * fail most rather than a free-text mistake.
 */

export interface DaySession {
  studied_on: string;
  cards_done: number;
  correct: number;
  again_count: number;
}

/** Record one rated card. Fire-and-forget — never blocks the review loop. */
export function logReview(rating: number): void {
  supabase.rpc('sv_log_review', { p_correct: rating >= 3, p_again: rating === 0 })
    .then(undefined, () => { /* stats are best-effort; never interrupt studying */ });
}

export async function fetchSessions(days = 120): Promise<DaySession[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const { data } = await supabase
    .from('sv_sessions')
    .select('studied_on, cards_done, correct, again_count')
    .gte('studied_on', since)
    .order('studied_on', { ascending: false });
  return (data as DaySession[]) ?? [];
}

/** Consecutive days studied, counting back from today (yesterday still counts). */
export function currentStreak(sessions: DaySession[]): number {
  const days = new Set(sessions.filter(s => s.cards_done > 0).map(s => s.studied_on));
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);
  // A streak survives until you miss a whole day.
  let cursor = days.has(iso(today)) ? today : days.has(iso(yesterday)) ? yesterday : null;
  if (!cursor) return 0;
  let n = 0;
  while (days.has(iso(cursor))) {
    n++;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return n;
}

export interface TopicStat {
  topic: string;
  cards: number;
  struggling: number;   // high priority or repeatedly failed
  avgMastery: number;
  weakness: number;     // 0-1, share of started cards that are struggling
}

/** Which grammar areas are actually costing you — the mistakes-db idea. */
export function topicStats(cards: SwedishCard[]): TopicStat[] {
  const by = new Map<string, SwedishCard[]>();
  for (const c of cards) {
    const t = c.topic || 'Phrases & vocabulary';
    (by.get(t) ?? by.set(t, []).get(t)!).push(c);
  }
  const out: TopicStat[] = [];
  for (const [topic, list] of by) {
    const started = list.filter(c => c.state !== CardState.NEW);
    if (started.length < 4) continue;                       // too few to judge
    const struggling = started.filter(
      c => c.priority === 'high' || (c.lapses ?? 0) >= 2 || c.easeFactor < 2.1
    ).length;
    const avgMastery = started.reduce((s, c) => s + (c.masteryLevel ?? 0), 0) / started.length;
    out.push({
      topic,
      cards: list.length,
      struggling,
      avgMastery: Math.round(avgMastery * 10) / 10,
      weakness: struggling / started.length,
    });
  }
  return out.sort((a, b) => b.weakness - a.weakness);
}

/** How many cards sit at each mastery level 0-5. */
export function masteryBreakdown(cards: SwedishCard[]): number[] {
  const out = [0, 0, 0, 0, 0, 0];
  for (const c of cards) {
    if (c.state === CardState.NEW) continue;
    out[Math.min(5, Math.max(0, c.masteryLevel ?? 0))]++;
  }
  return out;
}
