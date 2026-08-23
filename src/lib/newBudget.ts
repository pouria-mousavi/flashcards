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
 * Paused at 0 on 2026-08-19 to drain the backlog, reopened at 5 on 2026-08-23.
 * Pouria: "I really prefer to start learning the new words that I'm learning in
 * the course immediately ... out of those 25 words that I review, just put five
 * words that are new?"
 *
 * The five come OUT OF the 25, not on top of it. That only works if the review
 * schedule is levelled to `dailyTarget() - NEW_CAP` rather than to the full
 * target — otherwise reviews fill every slot and the governor computes an
 * allowance of zero. See REVIEW_TARGET below and its use in App.tsx.
 *
 * Every new card costs several future review slots as it climbs the ladder
 * (1 → 3 → 8 → 20 → 50 days …), so intake is always the first thing to cut.
 */
export const NEW_CAP = 5;

/**
 * How many REVIEW slots a day may hold, leaving room for NEW_CAP new cards
 * inside the same daily total. This is what the backlog leveller aims at, so
 * that `newAllowanceToday` always finds NEW_CAP worth of space.
 */
export function reviewTarget(): number {
  return Math.max(5, dailyTarget() - NEW_CAP);
}

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
