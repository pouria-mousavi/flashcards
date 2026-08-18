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
 * the app never burns the allowance. Tracked per user per local day.
 */

/**
 * The day's target: how many DISTINCT cards you intend to study.
 *
 * Set from Pouria's own stated capacity (2026-08-11): "let's say I can only read
 * 50 cards per day ... I will dedicate time and make sure I am doing 50 words
 * per day." Revealed capacity is actually higher — 63 and 59 on 8–9 Aug — so 50
 * is a comfortable target rather than a stretch, and `studiedToday` lets the UI
 * offer more once it is met instead of stopping dead.
 */
export const DAILY_TARGET = 50;

/**
 * Hard cap on new cards per day, whatever the governor computes.
 *
 * Every new card costs several future review slots as it climbs the ladder
 * (1 → 3 → 8 → 20 → 50 days …), so an unbounded governor would drain the new
 * pool during a quiet week and mint an avalanche a month later.
 *
 * Lowered 15 → 10 on 2026-08-18, when graduatingInterval and easyInterval went
 * back to the Anki defaults. The shorter early rungs add one review per card in
 * its first year, so intake has to come down to stay inside 50/day. Simulated at
 * the measured 28% again-rate: 15/day leaves 25 cards of rollover by day 180 and
 * finishes the unseen pile on day 302; 10/day leaves 1 and finishes on day 286 —
 * fewer new cards per day is actually FASTER, because nothing piles up.
 */
export const NEW_CAP = 10;

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
  target: number = DAILY_TARGET,
  cap: number = NEW_CAP,
): number {
  const room = target - reviewsDueToday;
  const budget = Math.max(0, Math.min(cap, room));
  return Math.max(0, budget - introducedToday(uid));
}

/**
 * English deck — its own, smaller budget, because Swedish is the active course.
 *
 * Pouria's choice (2026-08-11) after being shown the trade-off: "a slow trickle".
 * The 512 cards with real traction cost ~26 reviews/day, so 35 leaves room for
 * about 5 new words most days. The other 6,253 words wait; at this rate the deck
 * is a multi-year project, which is the honest picture rather than a promise.
 */
export const DAILY_TARGET_EN = 35;
export const NEW_CAP_EN = 5;

interface DayState {
  date: string;
  ids: string[];    // cards moved out of NEW today
  done?: string[];  // DISTINCT card ids rated today (reviews + new)
}

const key = (uid: string | null) => `sv_new_today:${uid ?? 'anon'}`;

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
