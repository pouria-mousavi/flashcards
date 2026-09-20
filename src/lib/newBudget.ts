import { studyDay } from './studyTime';

/**
 * Daily pacing.
 *
 * A brand-new card is stored with next_review = now(), so without pacing the app
 * counts every card you have never met as "overdue" — 679 unseen cards showed up
 * as homework you were already behind on. Anki solves this by introducing new
 * cards at a daily rate; this is that rate, plus a governor that keeps the whole
 * day honest.
 *
 * Budget is consumed only when a NEW card is actually rated, so merely opening
 * the app never burns the allowance. Tracked per user per Stockholm day.
 */

/**
 * The day's target: how many DISTINCT cards you intend to study.
 *
 * Lowered 50 → 25 on 2026-08-19. Pouria: "there's some days that I don't feel
 * like studying ... then everything gets piled up and it gets almost impossible
 * to recover." Two days off had produced a 182-card wall.
 *
 * 25 is survivable AND sufficient: simulated against the real 663-card schedule
 * with new words paused, the backlog drains to zero by day 60 and the deck's
 * demand falls from 50.8/day to 13.4/day as cards mature. Read from localStorage
 * so it can be raised again from the app once the pile is gone.
 */
export const DEFAULT_DAILY_TARGET = 25;
const TARGET_KEY = 'sv_daily_target';

/** The user's chosen daily target, or the default. */
export function dailyTarget(): number {
  try {
    const v = parseInt(localStorage.getItem(TARGET_KEY) ?? '', 10);
    if (Number.isFinite(v) && v >= 10 && v <= 200) return v;
  } catch { /* unavailable — fall through */ }
  return DEFAULT_DAILY_TARGET;
}

export function setDailyTarget(n: number): void {
  try { localStorage.setItem(TARGET_KEY, String(n)); } catch { /* ignore */ }
}

/** @deprecated read `dailyTarget()` instead — kept so callers keep compiling. */
export const DAILY_TARGET = DEFAULT_DAILY_TARGET;

/**
 * Hard cap on new cards per day, whatever the governor computes.
 *
 * At most two new Swedish cards while rebuilding a sustainable A1 routine.
 *
 * New cards come out of the session size. When overdue reviews fill the
 * available slots, intake pauses; deadlines are never shifted to make room.
 * Both languages additionally share the daily timer in studyTime.ts.
 *
 * Every new card adds future reviews, so intake is the first thing to cut.
 */
export const NEW_CAP = 2;

/**
 * How many new cards to introduce today, given how much review work is already
 * owed. This is the governor: it fills the day up to DAILY_TARGET and no further,
 * so a heavy review day automatically throttles intake instead of compounding it,
 * and a light day opens back up.
 *
 * Replaces the old fixed NEW_PER_DAY = 12, which could not see its own future and
 * so kept adding cards on days that were already full.
 */
export function newAllowanceToday(
  reviewsDueToday: number,
  uid: string | null,
  target: number = dailyTarget(),
  cap: number = NEW_CAP,
): number {
  const room = target - reviewsDueToday;
  const budget = Math.max(0, Math.min(cap, room));
  return Math.max(0, budget - introducedToday(uid));
}

/**
 * Maintain existing English cards; pause new intake while Swedish is the active
 * course. Both decks share the same twenty-minute daily allowance.
 */
export const DAILY_TARGET_EN = 35;
export const NEW_CAP_EN = 0;

interface DayState {
  date: string;
  ids: string[];    // cards moved out of NEW today
  done?: string[];  // DISTINCT card ids rated today (reviews + new)
}

const key = (uid: string | null) => `sv_new_today:${uid ?? 'anon'}`;

function localToday(): string {
  return studyDay(Date.now());
}

function read(uid: string | null): DayState {
  try {
    const raw = JSON.parse(localStorage.getItem(key(uid)) || 'null');
    if (raw && raw.date === localToday() && Array.isArray(raw.ids)) {
      // `done` was a number before 2026-08-11; drop the old shape rather than
      // mixing counts with ids.
      return { ...raw, done: Array.isArray(raw.done) ? raw.done : [] };
    }
  } catch { /* corrupt or unavailable — start the day fresh */ }
  return { date: localToday(), ids: [], done: [] };
}

function write(uid: string | null, st: DayState): void {
  try { localStorage.setItem(key(uid), JSON.stringify(st)); } catch { /* storage full — degrade */ }
}

/** How many new cards have already been introduced today. */
export function introducedToday(uid: string | null): number {
  return read(uid).ids.length;
}

/** Record that a card left NEW today. Idempotent per card. */
export function markNewIntroduced(uid: string | null, cardId: string): void {
  const st = read(uid);
  if (st.ids.includes(cardId)) return;
  st.ids.push(cardId);
  write(uid, st);
}

/**
 * Count one card against today's total. Counts DISTINCT cards, not ratings:
 * a card seen twice through the learning steps is one word studied, not two.
 * (Before 2026-08-11 this incremented per rating, so "50 cards" silently meant
 * ~35 actual words.)
 */
export function markCardStudied(uid: string | null, cardId: string): void {
  const st = read(uid);
  st.done = st.done ?? [];
  if (st.done.includes(cardId)) return;
  st.done.push(cardId);
  write(uid, st);
}

/** Distinct cards studied today. */
export function studiedToday(uid: string | null): number {
  return (read(uid).done ?? []).length;
}
