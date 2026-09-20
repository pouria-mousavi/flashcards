import { supabase } from './supabase';
import { ReviewStore } from './reviewStore';
import type { ReviewResult } from './reviewStore';
import { browserStudyTimeStorage, studyDay, studyDayStart } from './studyTime';
import type { StudyState } from './studyTypes';
import { markCardStudied, markNewIntroduced } from './newBudget';

export const reviewStore = new ReviewStore({
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: key => localStorage.removeItem(key),
  keys: () => Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)!).filter(Boolean),
});

async function assertAccount(uid: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user.id !== uid) throw new Error('Sign in again to sync your study session.');
  return session.access_token;
}

async function rpc(uid: string, name: string, body: object): Promise<unknown> {
  const token = await assertAccount(uid);
  // Bind the request to the captured account even if sign-in changes in flight.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/${name}`, {
    signal: controller.signal,
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Study sync failed (${response.status}). Your reviews remain saved on this device.`);
  return await response.json();
  } finally { clearTimeout(timeout); }
}

export async function flushStudyReviews(uid: string) {
  return reviewStore.flush(uid, async event => {
    const result = await rpc(uid, 'record_study_review', { p_event: event }) as ReviewResult;
    if (!['applied', 'duplicate', 'conflict'].includes(result?.status)) throw new Error('Review save was not confirmed.');
    return result;
  });
}

export async function loadStudyStates(uid: string) {
  await assertAccount(uid);
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('study_card_state').select('*').eq('user_id', uid)
      .order('deck').order('card_id').range(from, from + 999);
    if (error) throw error;
    for (const row of (data ?? []) as StudyState[]) reviewStore.remember(uid, row);
    if (!data || data.length < 1000) break;
  }
  // Restore today's intake on another device as well as its schedules.
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('study_review_events')
      .select('card_id, deck, payload').eq('user_id', uid).eq('status', 'applied')
      .gte('reviewed_at', new Date(studyDayStart(Date.now())).toISOString())
      .order('id').range(from, from + 999);
    if (error) throw error;
    for (const row of data ?? []) {
      const budgetUid = row.deck === 'swedish' ? uid : `${uid}:en`;
      markCardStudied(budgetUid, row.card_id);
      if (row.payload.before_stats.state === 'NEW') markNewIntroduced(budgetUid, row.card_id);
    }
    if (!data || data.length < 1000) break;
  }
}

interface TimeSegment { id: string; studied_on: string; started_at: string; ended_at: string }
const timeSync = new Map<string, Promise<void>>();
export async function syncStudyTime(uid: string): Promise<void> {
  const existing = timeSync.get(uid);
  if (existing) return existing;
  const task = (async () => {
    await assertAccount(uid);
    const prefix = `flashcards:study-time:v1:${encodeURIComponent(uid)}:`;
    const earliest = studyDay(Date.now() - 2 * 86400000);
    const segments = browserStudyTimeStorage.entries().flatMap(([key, value]) => {
      if (!key.startsWith(prefix)) return [];
      const [day, id] = key.slice(prefix.length).split(':');
      if (day < earliest) return [];
      const [start, end] = JSON.parse(value) as [number, number];
      return [{ id, studied_on: day, started_at: new Date(start).toISOString(), ended_at: new Date(end).toISOString() }];
    });
    // Keep requests bounded after a long day with many separate sessions.
    for (let offset = 0; offset < Math.max(1, segments.length); offset += 400) {
      const data = await rpc(uid, 'sync_study_time', { p_segments: segments.slice(offset, offset + 400) });
      for (const remote of (data ?? []) as TimeSegment[]) {
        const key = `${prefix}${remote.studied_on}:${remote.id}`;
        const local = browserStudyTimeStorage.entries().find(([k]) => k === key);
        const range = local ? JSON.parse(local[1]) as [number, number] : [Infinity, -Infinity];
        browserStudyTimeStorage.setItem(key, JSON.stringify([
          Math.min(range[0], Date.parse(remote.started_at)), Math.max(range[1], Date.parse(remote.ended_at)),
        ]));
      }
    }
  })().finally(() => { timeSync.delete(uid); });
  timeSync.set(uid, task);
  return task;
}
