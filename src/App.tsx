
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { mapRowToCard, mapGrammarRowToCard, mapSwedishRowToCard, isGrammarCard, LEARNING_REQUEUE_WINDOW_MS } from './utils/sm2';
import { SESSION_KEY, SWEDISH_SESSION_KEY, ACTIVE_LANGUAGE_KEY } from './lib/session';
import type { Flashcard, GrammarCard, StudyCard, SwedishCard, Lang, CardState } from './utils/sm2';

// --- Durable SRS writes -----------------------------------------------------
// Every rating's DB update is buffered here first and removed on success. If
// the app is killed mid-write (common as a phone PWA), the update replays on
// the next launch instead of silently resurrecting the card's old due date.
const PENDING_UPDATES_KEY = 'pending_srs_updates_v1';

interface PendingUpdate {
  table: string;
  id: string;
  fields: { state: string; next_review: string; interval: number; ease_factor: number };
  ts: number;
}

function readPendingUpdates(): Record<string, PendingUpdate> {
  try { return JSON.parse(localStorage.getItem(PENDING_UPDATES_KEY) || '{}'); } catch { return {}; }
}
function writePendingUpdates(map: Record<string, PendingUpdate>) {
  try { localStorage.setItem(PENDING_UPDATES_KEY, JSON.stringify(map)); } catch { /* storage full — degrade */ }
}
function queuePendingUpdate(table: string, id: string, fields: PendingUpdate['fields']): number {
  const map = readPendingUpdates();
  const ts = Date.now();
  map[`${table}:${id}`] = { table, id, fields, ts };
  writePendingUpdates(map);
  return ts;
}
// Only clears the entry if it is still the SAME version that was written —
// a slow older write must never delete a newer rating from the buffer.
function clearPendingUpdate(table: string, id: string, ts: number) {
  const map = readPendingUpdates();
  const key = `${table}:${id}`;
  if (map[key] && map[key].ts === ts) {
    delete map[key];
    writePendingUpdates(map);
  }
}
let flushInProgress = false;
async function flushPendingUpdates() {
  if (flushInProgress) return;
  flushInProgress = true;
  try {
    for (const key of Object.keys(readPendingUpdates())) {
      // Re-read right before writing — the entry may have been replaced by a
      // newer rating (or already cleared) while earlier writes were in flight.
      const p = readPendingUpdates()[key];
      if (!p) continue;
      const { error } = await supabase.from(p.table).update(p.fields).eq('id', p.id);
      if (!error) clearPendingUpdate(p.table, p.id, p.ts);
    }
  } finally {
    flushInProgress = false;
  }
}

// Supabase caps un-paginated selects at 1000 rows — always page through, with
// a stable ORDER BY so page boundaries can't skip or duplicate rows.
async function fetchAllRows(table: string): Promise<any[]> {
  const all: any[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select('*')
      .order('id', { ascending: true })
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
  return {
    ...card,
    state: p.fields.state as CardState,
    nextReviewDate: new Date(p.fields.next_review).getTime(),
    interval: p.fields.interval,
    easeFactor: p.fields.ease_factor,
  };
}
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';
import SwedishDashboard from './components/SwedishDashboard';
import SwedishStudySession from './components/SwedishStudySession';
import SwedishReference from './components/SwedishReference';
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

  // --- Helper: rebuild session from localStorage + card data (vocab + grammar) ---
  const rebuildSessionFromStorage = useCallback((vocab: Flashcard[], grammar: GrammarCard[]) => {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;

      try {
          const session = JSON.parse(saved);
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
    const ts = queuePendingUpdate(table, updatedCard.id, fields);
    const { error } = await supabase.from(table).update(fields).eq('id', updatedCard.id);
    if (error) console.error(`Error updating ${table} (kept pending for replay):`, error);
    else clearPendingUpdate(table, updatedCard.id, ts);
  };

  // Swedish update — writes ONLY to swedish_cards, never the English tables.
  const updateSwedishCardStats = async (updatedCard: SwedishCard) => {
    setSwedishCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));

    const fields = {
        state: updatedCard.state,
        next_review: new Date(updatedCard.nextReviewDate).toISOString(),
        interval: updatedCard.interval,
        ease_factor: updatedCard.easeFactor
    };
    // Buffer first so a killed app / failed request replays on next launch.
    const ts = queuePendingUpdate('swedish_cards', updatedCard.id, fields);
    const { error } = await supabase.from('swedish_cards').update(fields).eq('id', updatedCard.id);
    if (error) console.error('Error updating swedish_cards (kept pending for replay):', error);
    else clearPendingUpdate('swedish_cards', updatedCard.id, ts);
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

  // --- Load Data & Restore Session ---
  useEffect(() => {
    async function init() {
      try {
        // Replay any rating writes that never reached the DB (killed app,
        // dropped network) BEFORE fetching, so the fetch reflects them.
        await flushPendingUpdates();
        // Whatever is STILL pending (offline) gets overlaid client-side.
        const pending = readPendingUpdates();

        // All fetches paginate — Supabase silently caps selects at 1000 rows.
        const allRows = await fetchAllRows('cards');
        const mappedCards = allRows.map(mapRowToCard).map(c => overlayPending(c, 'cards', pending));
        setCards(mappedCards);

        // --- Also fetch grammar cards (separate table) ---
        let mappedGrammar: GrammarCard[] = [];
        let grammarOk = true;
        try {
            const grammarRows = await fetchAllRows('grammar_cards');
            mappedGrammar = grammarRows.map(mapGrammarRowToCard).map(c => overlayPending(c, 'grammar_cards', pending));
            setGrammarCards(mappedGrammar);
        } catch (grammarError) {
            grammarOk = false;
            console.error("Failed to load grammar cards", grammarError);
        }

        // --- Also fetch Swedish cards (fully separate deck) ---
        let mappedSwedish: SwedishCard[] = [];
        let swedishOk = true;
        try {
            const swedishRows = await fetchAllRows('swedish_cards');
            mappedSwedish = swedishRows.map(mapSwedishRowToCard).map(c => overlayPending(c, 'swedish_cards', pending));
            setSwedishCards(mappedSwedish);
        } catch (swedishError) {
            swedishOk = false;
            console.error("Failed to load swedish cards", swedishError);
        }

        // Restore each language's active session from its OWN storage key.
        // Only rebuild against decks that actually loaded — rebuilding against
        // a missing deck would wrongly treat its cards as deleted and could
        // destroy the saved session over a transient network failure.
        let engSession = null;
        if (grammarOk) {
            engSession = rebuildSessionFromStorage(mappedCards, mappedGrammar);
            if (engSession) setRestoredSession(engSession);
        }
        let svSession = null;
        if (swedishOk) {
            svSession = rebuildSwedishSessionFromStorage(mappedSwedish);
            if (svSession) setSwedishSession(svSession);
        }

        // Only jump straight into a session if it belongs to the active language.
        const lang = localStorage.getItem(ACTIVE_LANGUAGE_KEY) === 'sv' ? 'sv' : 'en';
        if ((lang === 'en' && engSession) || (lang === 'sv' && svSession)) {
            setView('study');
        }
      } catch (e) {
        initFailedRef.current = true;
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildSessionFromStorage, rebuildSwedishSessionFromStorage]);

  // Retry buffered rating writes whenever connectivity/foreground returns.
  // If the initial load failed (offline launch), a reload gets the decks back.
  useEffect(() => {
    const flush = () => {
      if (initFailedRef.current && navigator.onLine) { window.location.reload(); return; }
      flushPendingUpdates();
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

  if (loading) {
     return <div className="flex-center full-screen" style={{ color: 'var(--accent)' }}>Loading...</div>;
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

  // Swedish section — entirely separate render tree from English.
  if (activeLanguage === 'sv') {
    return (
      <div className="app-container">
        {view === 'study' && swedishSession ? (
          <SwedishStudySession
            cards={swedishSession.queue}
            startIndex={swedishSession.index}
            startFlipped={swedishSession.isFlipped}
            onUpdateCard={updateSwedishCardStats}
            onDeleteCard={deleteSwedishCard}
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
            onOpenReference={() => setShowSwedishReference(true)}
          />
        )}
        {/* Grammar tables — an overlay ABOVE the session, which stays mounted
            underneath so no study progress is ever lost. */}
        <AnimatePresence>
          {showSwedishReference && (
            <SwedishReference cards={swedishCards} onClose={() => setShowSwedishReference(false)} />
          )}
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
        />
      )}
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
