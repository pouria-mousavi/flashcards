
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { mapRowToCard, mapGrammarRowToCard, mapSwedishRowToCard, isGrammarCard, LEARNING_REQUEUE_WINDOW_MS } from './utils/sm2';
import { SESSION_KEY, SWEDISH_SESSION_KEY, ACTIVE_LANGUAGE_KEY } from './lib/session';
import type { Flashcard, GrammarCard, StudyCard, SwedishCard, Lang, CardState } from './utils/sm2';

// --- Durable SRS writes -----------------------------------------------------
// Every rating's DB write is buffered locally first and cleared on success, so a
// killed app / dropped network replays instead of resurrecting an old due date.
// Namespaced by the signed-in user so two accounts on one device never mix; and
// op-aware so per-user Swedish progress can UPSERT into sv_progress while the
// author's English decks still UPDATE by id.
let currentUid: string | null = null;
// The buffer key is derived from an EXPLICIT uid captured at queue time — never
// the live `currentUid`. So a write that resolves AFTER an account switch still
// clears (and later replays) under the namespace it was originally queued under,
// instead of leaking into or orphaning against whoever is signed in now.
function pendingKey(uid: string | null) { return `pending_srs_updates_v3:${uid ?? 'anon'}`; }

interface PendingUpdate {
  table: string;
  id: string;                      // card id — buffer key + .eq() target for updates
  op: 'update' | 'upsert';
  payload: Record<string, any>;    // fields to write (upsert payload includes conflict keys)
  conflict?: string;               // onConflict columns for upsert
  ts: number;
}

function readPendingUpdates(uid: string | null): Record<string, PendingUpdate> {
  try { return JSON.parse(localStorage.getItem(pendingKey(uid)) || '{}'); } catch { return {}; }
}
function writePendingUpdates(uid: string | null, map: Record<string, PendingUpdate>) {
  try { localStorage.setItem(pendingKey(uid), JSON.stringify(map)); } catch { /* storage full — degrade */ }
}
function queuePending(uid: string | null, table: string, id: string, op: 'update' | 'upsert', payload: Record<string, any>, conflict?: string): number {
  const map = readPendingUpdates(uid);
  const ts = Date.now();
  map[`${table}:${id}`] = { table, id, op, payload, conflict, ts };
  writePendingUpdates(uid, map);
  return ts;
}
// Only clears the entry if it is still the SAME version that was written —
// a slow older write must never delete a newer rating from the buffer.
function clearPending(uid: string | null, table: string, id: string, ts: number) {
  const map = readPendingUpdates(uid);
  const key = `${table}:${id}`;
  if (map[key] && map[key].ts === ts) {
    delete map[key];
    writePendingUpdates(uid, map);
  }
}

// Every SRS DB write — direct rating writes AND buffered replays — funnels
// through this single chain, so two writes to the same row are never in flight
// at once. Submission order == commit order, so a newer rating can't be
// clobbered by an older buffered replay landing last.
let writeChain: Promise<unknown> = Promise.resolve();
function serializeWrite<T>(fn: () => PromiseLike<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(() => {}, () => {});
  return run;
}

let flushInProgress = false;
async function flushPendingUpdates(uid: string | null) {
  if (flushInProgress || !uid) return;
  flushInProgress = true;
  try {
    for (const key of Object.keys(readPendingUpdates(uid))) {
      // Re-read right before writing — the entry may have been replaced by a
      // newer rating (or already cleared) while earlier writes were in flight.
      const p = readPendingUpdates(uid)[key];
      if (!p) continue;
      const { error } = await serializeWrite(() => p.op === 'upsert'
        ? supabase.from(p.table).upsert(p.payload, { onConflict: p.conflict })
        : supabase.from(p.table).update(p.payload).eq('id', p.id));
      if (!error) clearPending(uid, p.table, p.id, p.ts);
    }
  } finally {
    flushInProgress = false;
  }
}

// Supabase caps un-paginated selects at 1000 rows — always page through, with
// a stable ORDER BY so page boundaries can't skip or duplicate rows.
async function fetchAllRows(table: string, orderCol = 'id'): Promise<any[]> {
  const all: any[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

// Overlay a still-pending (unflushed) SRS write onto a freshly fetched card so
// the UI reflects the user's latest ratings even if the network write failed.
function overlayPending<C extends { id: string; state: CardState; nextReviewDate: number; interval: number; easeFactor: number }>(
  card: C, table: string, pending: Record<string, PendingUpdate>
): C {
  const p = pending[`${table}:${card.id}`];
  if (!p) return card;
  const f = p.payload;
  return {
    ...card,
    state: f.state as CardState,
    nextReviewDate: new Date(f.next_review).getTime(),
    interval: f.interval,
    easeFactor: f.ease_factor,
  };
}
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';
import SwedishDashboard from './components/SwedishDashboard';
import SwedishStudySession from './components/SwedishStudySession';
import SwedishReference from './components/SwedishReference';
import SwedishGrammar from './components/SwedishGrammar';
import Auth from './components/Auth';
import AccountPanel from './components/AccountPanel';
import { fetchRole } from './lib/auth';
import type { Role } from './lib/auth';
import { setTtsTier } from './lib/tts';
import { AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'study' | 'add';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [grammarCards, setGrammarCards] = useState<GrammarCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [restoredSession, setRestoredSession] = useState<{ queue: StudyCard[], index: number, isFlipped: boolean } | null>(null);

  // --- Swedish: a fully separate deck + session, never merged with English ---
  const [swedishCards, setSwedishCards] = useState<SwedishCard[]>([]);
  const [swedishSession, setSwedishSession] = useState<{ queue: SwedishCard[], index: number, isFlipped: boolean } | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Lang>(() =>
      localStorage.getItem(ACTIVE_LANGUAGE_KEY) === 'sv' ? 'sv' : 'en'
  );
  const initFailedRef = useRef(false);
  const [showSwedishReference, setShowSwedishReference] = useState(false);
  const [showSwedishGrammar, setShowSwedishGrammar] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // --- Auth: who is signed in (null = signed out or not approved) ---
  const [authReady, setAuthReady] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const isAdmin = !!role?.isAdmin;

  // --- Helper: rebuild session from localStorage + card data (vocab + grammar) ---
  const rebuildSessionFromStorage = useCallback((vocab: Flashcard[], grammar: GrammarCard[]) => {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;

      try {
          const session = JSON.parse(saved);
          if (session.uid && session.uid !== currentUid) { localStorage.removeItem(SESSION_KEY); return null; }
          if (session.cardIds && Array.isArray(session.cardIds)) {
              const lookup = new Map<string, StudyCard>();
              for (const c of vocab) lookup.set(c.id, c);
              for (const g of grammar) lookup.set(g.id, g);

              const queue = session.cardIds
                  .map((id: string) => lookup.get(id))
                  .filter((c: StudyCard | undefined): c is StudyCard => !!c);

              const index = Math.min(session.currentIndex || 0, queue.length);
              // A session whose index is past the end already finished —
              // clear it instead of clamping back onto the last rated card.
              if (queue.length === 0 || index >= queue.length) {
                  localStorage.removeItem(SESSION_KEY);
                  return null;
              }
              // Drop not-yet-shown cards that are nowhere near due (stale
              // session from another device / already rated elsewhere).
              const cutoff = Date.now() + LEARNING_REQUEUE_WINDOW_MS;
              const shown = queue.slice(0, index);
              const remaining = queue.slice(index).filter((c: StudyCard) => c.nextReviewDate <= cutoff);
              if (remaining.length === 0) {
                  localStorage.removeItem(SESSION_KEY);
                  return null;
              }
              return { queue: [...shown, ...remaining], index, isFlipped: session.isFlipped || false };
          }
      } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem(SESSION_KEY);
      }
      return null;
  }, []);

  // --- Helper: rebuild Swedish session from its OWN storage key (isolated) ---
  const rebuildSwedishSessionFromStorage = useCallback((deck: SwedishCard[]) => {
      const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
      if (!saved) return null;
      try {
          const session = JSON.parse(saved);
          if (session.uid && session.uid !== currentUid) { localStorage.removeItem(SWEDISH_SESSION_KEY); return null; }
          if (session.cardIds && Array.isArray(session.cardIds)) {
              const lookup = new Map<string, SwedishCard>();
              for (const c of deck) lookup.set(c.id, c);
              const queue = session.cardIds
                  .map((id: string) => lookup.get(id))
                  .filter((c: SwedishCard | undefined): c is SwedishCard => !!c);

              const index = Math.min(session.currentIndex || 0, queue.length);
              // A session whose index is past the end already finished —
              // clear it instead of clamping back onto the last rated card.
              if (queue.length === 0 || index >= queue.length) {
                  localStorage.removeItem(SWEDISH_SESSION_KEY);
                  return null;
              }
              // Drop not-yet-shown cards that are nowhere near due (stale
              // session from another device / already rated elsewhere).
              const cutoff = Date.now() + LEARNING_REQUEUE_WINDOW_MS;
              const shown = queue.slice(0, index);
              const remaining = queue.slice(index).filter((c: SwedishCard) => c.nextReviewDate <= cutoff);
              if (remaining.length === 0) {
                  localStorage.removeItem(SWEDISH_SESSION_KEY);
                  return null;
              }
              return { queue: [...shown, ...remaining], index, isFlipped: session.isFlipped || false };
          }
      } catch (err) {
          console.error("Failed to restore Swedish session", err);
          localStorage.removeItem(SWEDISH_SESSION_KEY);
      }
      return null;
  }, []);

  // --- Actions ---
  const saveCard = async (newCard: Flashcard) => {
      setCards(prev => [...prev, newCard]);

      const { error } = await supabase.from('cards').insert({
          id: newCard.id,
          front: newCard.front,
          back: newCard.back,
          pronunciation: newCard.pronunciation,
          tone: newCard.tone,
          synonyms: newCard.synonyms,
          examples: newCard.examples,
          word_forms: newCard.word_forms,
          other_meanings: newCard.other_meanings,
          state: newCard.state,
          next_review: new Date(newCard.nextReviewDate).toISOString(),
          interval: newCard.interval,
          ease_factor: newCard.easeFactor
      });
      if (error) console.error('Error saving:', error);
  };

  // Unified update dispatcher — routes to the right table based on card type
  const updateCardStats = async (updatedCard: StudyCard) => {
    const table = isGrammarCard(updatedCard) ? 'grammar_cards' : 'cards';

    if (isGrammarCard(updatedCard)) {
        setGrammarCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    } else {
        setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    }

    const fields = {
        state: updatedCard.state,
        next_review: new Date(updatedCard.nextReviewDate).toISOString(),
        interval: updatedCard.interval,
        ease_factor: updatedCard.easeFactor
    };
    // Buffer first so a killed app / failed request replays on next launch.
    const uid = currentUid;
    const ts = queuePending(uid, table, updatedCard.id, 'update', fields);
    const { error } = await serializeWrite(() => supabase.from(table).update(fields).eq('id', updatedCard.id));
    if (error) console.error(`Error updating ${table} (kept pending for replay):`, error);
    else clearPending(uid, table, updatedCard.id, ts);
  };

  // Swedish update — writes the CURRENT USER's progress into sv_progress. The
  // shared swedish_cards content is never touched here, so one user's ratings
  // can never affect anyone else's deck.
  const updateSwedishCardStats = async (updatedCard: SwedishCard) => {
    setSwedishCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    // Capture the uid ONCE up front: the payload, the buffer namespace, and the
    // later clear must all refer to the user who made this rating, even if the
    // account is switched while the write is in flight.
    const uid = currentUid;
    if (!uid) return;

    const payload = {
        user_id: uid,
        card_id: updatedCard.id,
        state: updatedCard.state,
        next_review: new Date(updatedCard.nextReviewDate).toISOString(),
        interval: updatedCard.interval,
        ease_factor: updatedCard.easeFactor,
        updated_at: new Date().toISOString(),
    };
    // Buffer first so a killed app / failed request replays on next launch.
    const ts = queuePending(uid, 'sv_progress', updatedCard.id, 'upsert', payload, 'user_id,card_id');
    const { error } = await serializeWrite(() => supabase.from('sv_progress').upsert(payload, { onConflict: 'user_id,card_id' }));
    if (error) console.error('Error updating sv_progress (kept pending for replay):', error);
    else clearPending(uid, 'sv_progress', updatedCard.id, ts);
  };

  // Swedish delete — removes ONLY from swedish_cards, never the English tables.
  const deleteSwedishCard = async (cardId: string) => {
    setSwedishCards(prev => prev.filter(c => c.id !== cardId));

    const { error } = await supabase.from('swedish_cards').delete().eq('id', cardId);
    if (error) {
      console.error('Error deleting swedish card:', error);
      alert('Failed to delete card from DB!');
    }
  };

  const deleteCard = async (cardId: string) => {
      setCards(prev => prev.filter(c => c.id !== cardId));

      const { error } = await supabase.from('cards').delete().eq('id', cardId);
      if (error) {
          console.error("Error deleting:", error);
          alert("Failed to delete card from DB!");
      }
  };

  // Fisher-Yates shuffle — used to break up topic clusters in NEW cards
  const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  };

  // Due cards across BOTH tables, merged and prioritized.
  const getDueCards = (): StudyCard[] => {
    const now = Date.now();
    const allDue: StudyCard[] = [
        ...cards.filter(c => c.nextReviewDate <= now),
        ...grammarCards.filter(c => c.nextReviewDate <= now),
    ];

    const newCards = allDue.filter(c => c.state === 'NEW');
    // Cards mid-acquisition (short intervals, due in minutes/hours). These are
    // the ones you JUST studied — they must be reinforced promptly or the memory
    // is lost. They always lead the review portion, ahead of the older backlog.
    const learning = allDue.filter(c => c.state === 'LEARNING' || c.state === 'RELEARNING');
    // Graduated cards waiting for their next spaced review.
    const reviews = allDue.filter(c => c.state === 'REVIEW');

    // Both sorted oldest-due-first within their tier.
    const sortedLearning = [...learning].sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);

    // NEW cards: shuffle to break up topic clusters from batch imports
    // (e.g., 6 "smell" words added together would otherwise cluster).
    // We still bias toward recently-added by taking the top 250 newest first.
    const recentNew = [...newCards]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 250);
    const shuffledNew = shuffle(recentNew);

    // Priority: NEW (LIFO) → actively-learning → graduated reviews.
    // Putting learning ahead of reviews is what surfaces cards you studied
    // recently instead of burying them under a months-old review backlog.
    return [...shuffledNew, ...sortedLearning, ...sortedReviews];
  };

  // Build a short, completable session.
  //
  // The key lever for finishing sessions: CAP new cards. New cards are
  // high-effort (building memory from scratch); reviews are quick wins.
  // A short session of mostly reviews + a few new cards is far easier to
  // finish than 60 brand-new words. (This is exactly Anki's new-cards-per-day model.)
  //
  // Defaults: 20 cards total, max 8 new. The new cards are spread evenly
  // among the reviews so you get a rhythm of quick-win → challenge → quick-win.
  const buildSession = (size = 20, newCap = 8): StudyCard[] => {
      const due = getDueCards(); // shuffled new first, then reviews by due date
      const newCards = due.filter(c => c.state === 'NEW');
      const reviewCards = due.filter(c => c.state !== 'NEW');

      let takeNew = Math.min(newCap, newCards.length);
      let takeReview = Math.min(size - takeNew, reviewCards.length);

      // Backfill: if reviews run short, top up with more new cards so the
      // session still reaches `size` (and vice versa).
      const shortfall = size - takeNew - takeReview;
      if (shortfall > 0) {
          if (newCards.length > takeNew) {
              takeNew = Math.min(newCards.length, takeNew + shortfall);
          } else if (reviewCards.length > takeReview) {
              takeReview = Math.min(reviewCards.length, takeReview + shortfall);
          }
      }

      const pickedNew = newCards.slice(0, takeNew);
      const pickedReview = reviewCards.slice(0, takeReview);

      // Spread the harder new cards evenly through the reviews. Start with a
      // review for an easy opener.
      const session: StudyCard[] = [...pickedReview];
      if (pickedNew.length > 0) {
          if (session.length === 0) return pickedNew;
          const gap = Math.max(1, Math.floor(session.length / pickedNew.length));
          pickedNew.forEach((card, i) => {
              const insertAt = Math.min(gap * (i + 1) + i, session.length);
              session.splice(insertAt, 0, card);
          });
      }
      return session;
  };

  // --- Swedish: same SRS prioritization as English, applied to the Swedish deck ---
  // Priority: NEW (LIFO, shuffled) → actively-learning → graduated reviews.
  const getSwedishDueCards = (): SwedishCard[] => {
      const now = Date.now();
      const allDue = swedishCards.filter(c => c.nextReviewDate <= now);
      const newCards = allDue.filter(c => c.state === 'NEW');
      const learning = allDue.filter(c => c.state === 'LEARNING' || c.state === 'RELEARNING');
      const reviews = allDue.filter(c => c.state === 'REVIEW');
      const sortedLearning = [...learning].sort((a, b) => a.nextReviewDate - b.nextReviewDate);
      const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);
      const recentNew = [...newCards].sort((a, b) => b.createdAt - a.createdAt).slice(0, 250);
      const shuffledNew = shuffle(recentNew);
      return [...shuffledNew, ...sortedLearning, ...sortedReviews];
  };

  const buildSwedishSession = (size = 20, newCap = 8): SwedishCard[] => {
      const due = getSwedishDueCards();
      const newCards = due.filter(c => c.state === 'NEW');
      const reviewCards = due.filter(c => c.state !== 'NEW');

      let takeNew = Math.min(newCap, newCards.length);
      let takeReview = Math.min(size - takeNew, reviewCards.length);

      const shortfall = size - takeNew - takeReview;
      if (shortfall > 0) {
          if (newCards.length > takeNew) takeNew = Math.min(newCards.length, takeNew + shortfall);
          else if (reviewCards.length > takeReview) takeReview = Math.min(reviewCards.length, takeReview + shortfall);
      }

      const pickedNew = newCards.slice(0, takeNew);
      const pickedReview = reviewCards.slice(0, takeReview);

      const session: SwedishCard[] = [...pickedReview];
      if (pickedNew.length > 0) {
          if (session.length === 0) return pickedNew;
          const gap = Math.max(1, Math.floor(session.length / pickedNew.length));
          pickedNew.forEach((card, i) => {
              const insertAt = Math.min(gap * (i + 1) + i, session.length);
              session.splice(insertAt, 0, card);
          });
      }
      return session;
  };

  // --- Auth lifecycle: resolve the session, track sign-in / sign-out ---
  useEffect(() => {
    let mounted = true;

    // Resolve the role, retrying transient failures. fetchRole THROWS on a
    // network/DB error (distinct from a clean "not approved" -> null), so a
    // flaky connection or a paused DB never downgrades a valid session to the
    // signed-out state and wipes the in-progress session.
    const resolveRole = async (attempts = 3): Promise<Role | null> => {
      for (let i = 0; i < attempts; i++) {
        try { return await fetchRole(); }
        catch { if (i < attempts - 1) await new Promise(res => setTimeout(res, 400)); }
      }
      throw new Error('role-unresolved');
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let r: Role | null = null;
      if (session) { try { r = await resolveRole(); } catch { r = null; } }
      if (!mounted) return;
      setRole(r);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) { setRole(null); return; }                 // genuine sign-out
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        let r: Role | null;
        try { r = await resolveRole(); }
        catch { return; }                                      // transient — keep current role, never log out
        setRole(prev => (prev && r && prev.userId === r.userId && prev.isAdmin === r.isAdmin) ? prev : r);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  // --- Role side-effects: uid namespace, voice tier, cleanup on sign-out ---
  useEffect(() => {
    currentUid = role?.userId ?? null;
    setTtsTier(role?.isAdmin ? 'azure' : 'browser');
    if (role && !role.isAdmin) {
      setActiveLanguage('sv');
      localStorage.setItem(ACTIVE_LANGUAGE_KEY, 'sv');
    }
    // Tear down ONLY on a genuine signed-out transition (auth resolved, no role).
    // Never during the pre-auth `null` on first mount, nor a transient
    // role-resolution blip — either would wipe the persisted study session out
    // from under a still-valid login before it can be restored.
    if (authReady && !role) {
      setCards([]); setGrammarCards([]); setSwedishCards([]);
      setRestoredSession(null); setSwedishSession(null);
      setShowAccount(false); setShowSwedishReference(false); setShowSwedishGrammar(false);
      setView('dashboard');
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SWEDISH_SESSION_KEY);
    }
  }, [role, authReady]);

  // --- Load decks + THIS user's progress once a role is known ---
  useEffect(() => {
    if (!authReady) return;
    if (!role) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      initFailedRef.current = false;
      try {
        await flushPendingUpdates(role.userId);
        const pending = readPendingUpdates(role.userId);

        // Swedish deck (everyone): shared content + this user's own progress.
        const svRows = await fetchAllRows('swedish_cards');
        const progRows = await fetchAllRows('sv_progress', 'card_id');
        const progMap = new Map<string, any>(progRows.map((p: any) => [p.card_id, p]));
        const mappedSwedish = svRows.map((r: any) => {
          const card = mapSwedishRowToCard(r);
          const p = progMap.get(r.id);
          if (p) {
            card.state = p.state as CardState;
            card.nextReviewDate = new Date(p.next_review).getTime();
            card.interval = p.interval;
            card.easeFactor = p.ease_factor;
          } else {
            card.state = 'NEW' as CardState;
            card.nextReviewDate = Date.now();
            card.interval = 0;
            card.easeFactor = 2.5;
          }
          return card;
        }).map(c => overlayPending(c, 'sv_progress', pending));
        if (cancelled) return;
        setSwedishCards(mappedSwedish);

        // English decks: author only.
        let mappedCards: Flashcard[] = [];
        let mappedGrammar: GrammarCard[] = [];
        let engOk = false;
        if (role.isAdmin) {
          engOk = true;
          try {
            const rows = await fetchAllRows('cards');
            mappedCards = rows.map(mapRowToCard).map(c => overlayPending(c, 'cards', pending));
            if (!cancelled) setCards(mappedCards);
          } catch (e) { engOk = false; console.error('Failed to load cards', e); }
          try {
            const rows = await fetchAllRows('grammar_cards');
            mappedGrammar = rows.map(mapGrammarRowToCard).map(c => overlayPending(c, 'grammar_cards', pending));
            if (!cancelled) setGrammarCards(mappedGrammar);
          } catch (e) { engOk = false; console.error('Failed to load grammar', e); }
        }

        // Restore in-flight sessions (uid-stamped; rebuild discards mismatches).
        const svSession = rebuildSwedishSessionFromStorage(mappedSwedish);
        if (svSession && !cancelled) setSwedishSession(svSession);
        const engSession = (role.isAdmin && engOk) ? rebuildSessionFromStorage(mappedCards, mappedGrammar) : null;
        if (engSession && !cancelled) setRestoredSession(engSession);

        const lang = role.isAdmin ? (localStorage.getItem(ACTIVE_LANGUAGE_KEY) === 'sv' ? 'sv' : 'en') : 'sv';
        if (!cancelled && ((lang === 'sv' && svSession) || (lang === 'en' && engSession))) {
          setView('study');
        }
      } catch (e) {
        initFailedRef.current = true;
        console.error('Failed to load data', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, role?.userId, role?.isAdmin]);

  // Retry buffered rating writes whenever connectivity/foreground returns.
  // If the initial load failed (offline launch), a reload gets the decks back.
  useEffect(() => {
    const flush = () => {
      if (initFailedRef.current && navigator.onLine) { window.location.reload(); return; }
      flushPendingUpdates(currentUid);
    };
    const onVisible = () => { if (document.visibilityState === 'visible') flush(); };
    window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('online', flush);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // --- Visibilitychange: re-sync the ACTIVE language's session on foreground ---
  useEffect(() => {
      const handleVisibility = () => {
          if (document.visibilityState !== 'visible') return;

          if (activeLanguage === 'sv') {
              if (swedishCards.length === 0) return;
              const session = rebuildSwedishSessionFromStorage(swedishCards);
              if (session) {
                  setSwedishSession(session);
              } else {
                  setSwedishSession(null);
                  if (view === 'study') setView('dashboard');
              }
          } else {
              if (cards.length === 0) return;
              const session = rebuildSessionFromStorage(cards, grammarCards);
              if (session) {
                  setRestoredSession(session);
              } else {
                  setRestoredSession(null);
                  if (view === 'study') setView('dashboard');
              }
          }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cards, grammarCards, swedishCards, activeLanguage, view, rebuildSessionFromStorage, rebuildSwedishSessionFromStorage]);

  // --- Beforeunload: safety net to ensure session is saved ---
  useEffect(() => {
      const handleBeforeUnload = () => {
          // Session state is already synced by StudySession component
          // This is just a safety net — nothing extra needed
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleStartStudy = (freshStart = false) => {
    if (!freshStart) {
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved && restoredSession) {
            // Re-read from localStorage to get latest index/flip state
            const session = rebuildSessionFromStorage(cards, grammarCards);
            if (session) {
                setRestoredSession(session);
            }
            setView('study');
            return;
        }
    }

    const due = buildSession(20, 8);
    if (due.length === 0) {
        alert("No cards due!");
        return;
    }

    const sessionData = {
        uid: currentUid,
        cardIds: due.map(c => c.id),
        currentIndex: 0,
        isFlipped: false,
        timestamp: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    setRestoredSession({ queue: due, index: 0, isFlipped: false });
    setView('study');
  };

  const handleSessionPause = () => {
      setView('dashboard');
  };

  const handleSessionComplete = () => {
      localStorage.removeItem(SESSION_KEY);
      setRestoredSession(null);
      setView('dashboard');
  };

  // --- Swedish session controls (mirror the English ones, separate storage) ---
  const handleStartSwedishStudy = (freshStart = false) => {
      if (!freshStart) {
          const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
          if (saved && swedishSession) {
              const session = rebuildSwedishSessionFromStorage(swedishCards);
              if (session) setSwedishSession(session);
              setView('study');
              return;
          }
      }

      const due = buildSwedishSession(50, 12);
      if (due.length === 0) {
          alert("No Swedish cards due!");
          return;
      }

      const sessionData = {
          uid: currentUid,
          cardIds: due.map(c => c.id),
          currentIndex: 0,
          isFlipped: false,
          timestamp: Date.now()
      };
      localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(sessionData));

      setSwedishSession({ queue: due, index: 0, isFlipped: false });
      setView('study');
  };

  const handleSwedishSessionComplete = () => {
      localStorage.removeItem(SWEDISH_SESSION_KEY);
      setSwedishSession(null);
      setView('dashboard');
  };

  // Switch between the English and Swedish sections. Always lands on the
  // dashboard so you never carry one language's view into the other.
  const switchLanguage = (lang: Lang) => {
      if (lang === activeLanguage) return;
      setActiveLanguage(lang);
      localStorage.setItem(ACTIVE_LANGUAGE_KEY, lang);
      setView('dashboard');
  };

  if (!isConfigured) {
      return (
          <div className="flex-center full-screen" style={{ flexDirection: 'column', color: 'var(--danger)', padding: '20px', textAlign: 'center' }}>
              <h1>⚠️ Configuration Missing</h1>
              <p>The App cannot connect to the Database.</p>
          </div>
      );
  }

  // Gate everything behind auth. Signed-out (or not-yet-approved) users get the
  // login/sign-up screen; nothing else in the app is reachable without a role.
  if (!authReady) {
      return <div className="flex-center full-screen" style={{ color: 'var(--accent-sv)' }}>Loading…</div>;
  }
  if (!role) {
      return <Auth />;
  }

  if (loading) {
     return <div className="flex-center full-screen" style={{ color: 'var(--accent-sv)' }}>Loading…</div>;
  }

  const handleAddCard = (partialCard: Partial<Flashcard>) => {
      const newCard: Flashcard = {
          id: crypto.randomUUID(),
          front: partialCard.front || '',
          back: partialCard.back || '',
          state: 'NEW',
          nextReviewDate: Date.now(),
          interval: 0,
          easeFactor: 2.5,
          createdAt: Date.now(),
          pronunciation: partialCard.pronunciation || '',
          tone: partialCard.tone || '',
          word_forms: partialCard.word_forms,
          other_meanings: partialCard.other_meanings,
          synonyms: partialCard.synonyms,
          examples: partialCard.examples || []
      };
      saveCard(newCard);
  };

  // Swedish section — entirely separate render tree from English. Friends
  // (non-admins) only ever reach this section, cannot edit, and have no
  // language switcher.
  if (activeLanguage === 'sv' || !isAdmin) {
    return (
      <div className="app-container">
        {view === 'study' && swedishSession ? (
          <SwedishStudySession
            cards={swedishSession.queue}
            startIndex={swedishSession.index}
            startFlipped={swedishSession.isFlipped}
            onUpdateCard={updateSwedishCardStats}
            onDeleteCard={deleteSwedishCard}
            canEdit={isAdmin}
            onPause={handleSessionPause}
            onSessionComplete={handleSwedishSessionComplete}
            onOpenReference={() => setShowSwedishReference(true)}
          />
        ) : (
          <SwedishDashboard
            cards={swedishCards}
            onStartStudy={() => handleStartSwedishStudy(false)}
            hasActiveSession={!!swedishSession}
            activeLanguage={activeLanguage}
            onSwitchLanguage={switchLanguage}
            showSwitcher={isAdmin}
            onOpenReference={() => setShowSwedishReference(true)}
            onOpenGrammar={() => setShowSwedishGrammar(true)}
            onOpenAccount={() => setShowAccount(true)}
          />
        )}
        {/* Grammar tables & Grammatik — overlays ABOVE the session, which stays
            mounted underneath so no study progress is ever lost. */}
        <AnimatePresence>
          {showSwedishReference && (
            <SwedishReference cards={swedishCards} onClose={() => setShowSwedishReference(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSwedishGrammar && (
            <SwedishGrammar onClose={() => setShowSwedishGrammar(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showAccount && <AccountPanel role={role} onClose={() => setShowAccount(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  // English section (unchanged behavior).
  return (
    <div className="app-container">
      {view === 'dashboard' && (
        <Dashboard
          cards={cards}
          grammarCards={grammarCards}
          onStartStudy={() => handleStartStudy(false)}
          onAddCard={() => setView('add')}
          hasActiveSession={!!restoredSession}
          activeLanguage={activeLanguage}
          onSwitchLanguage={switchLanguage}
          onOpenAccount={() => setShowAccount(true)}
        />
      )}
      <AnimatePresence>
        {showAccount && <AccountPanel role={role} onClose={() => setShowAccount(false)} />}
      </AnimatePresence>
      {view === 'study' && restoredSession && (
        <StudySession
          cards={restoredSession.queue}
          startIndex={restoredSession.index}
          startFlipped={restoredSession.isFlipped}
          onUpdateCard={updateCardStats}
          onDeleteCard={deleteCard}
          onPause={handleSessionPause}
          onSessionComplete={handleSessionComplete}
        />
      )}
      {view === 'add' && (
        <AddCard
          onAdd={handleAddCard}
          onCancel={() => setView('dashboard')}
        />
      )}
    </div>
  );

}

export default App;
