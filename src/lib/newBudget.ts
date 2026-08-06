/**
 * Daily new-card allowance.
 *
 * A brand-new card is stored with next_review = now(), so without this the app
 * counts every card you have never met as "overdue" — 612 unseen cards showed
 * up as homework you were already behind on. Anki solves this by introducing
 * new cards at a fixed daily rate; this is that rate.
 *
 * Budget is consumed only when a NEW card is actually rated, so merely opening
 * the app never burns the allowance. Tracked per user per local day.
 */

/**
 * Why 12 and not more: every new card generates ~7 reviews over the following
 * year (intervals ≈ 1, 3, 8, 20, 50, 125, 300 days), so a steady intake of N
 * per day settles at roughly 8N cards/day once reviews are counted. At 25/day
 * that was ~183 reviews/day — measured, and about double a 100-card day — which
 * is why the queue grew no matter how much was studied. 12/day settles near the
 * 100/day ceiling.
 */
export const NEW_PER_DAY = 12;

interface DayState {
  date: string;
  ids: string[]; // cards moved out of NEW today
}

const key = (uid: string | null) => `sv_new_today:${uid ?? 'anon'}`;

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function read(uid: string | null): DayState {
  try {
    const raw = JSON.parse(localStorage.getItem(key(uid)) || 'null');
    if (raw && raw.date === localToday() && Array.isArray(raw.ids)) return raw;
  } catch { /* corrupt or unavailable — start the day fresh */ }
  return { date: localToday(), ids: [] };
}

/** How many new cards may still be introduced today. */
export function remainingNewToday(uid: string | null, perDay = NEW_PER_DAY): number {
  return Math.max(0, perDay - read(uid).ids.length);
}

/** Record that a card left NEW today. Idempotent per card. */
export function markNewIntroduced(uid: string | null, cardId: string): void {
  const st = read(uid);
  if (st.ids.includes(cardId)) return;
  st.ids.push(cardId);
  try { localStorage.setItem(key(uid), JSON.stringify(st)); } catch { /* storage full — degrade */ }
}
