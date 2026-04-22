
import { useEffect, useState, useCallback } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { mapRowToCard } from './utils/sm2';
import type { Flashcard } from './utils/sm2';
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';
import ScenarioChallenge from './components/ScenarioChallenge';

type View = 'dashboard' | 'study' | 'add' | 'scenario';

const SESSION_KEY = 'flashcards_active_session';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [restoredSession, setRestoredSession] = useState<{ queue: Flashcard[], index: number, isFlipped: boolean } | null>(null);

  // --- Helper: rebuild session from localStorage + card data ---
  const rebuildSessionFromStorage = useCallback((cardsData: Flashcard[]) => {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;

      try {
          const session = JSON.parse(saved);
          if (session.cardIds && Array.isArray(session.cardIds)) {
              const queue = session.cardIds
                  .map((id: string) => cardsData.find(c => c.id === id))
                  .filter((c: Flashcard | undefined): c is Flashcard => !!c);
              if (queue.length > 0) {
                  const index = Math.min(session.currentIndex || 0, queue.length - 1);
                  return { queue, index, isFlipped: session.isFlipped || false };
              }
          }
      } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem(SESSION_KEY);
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

  const updateCardStats = async (updatedCard: Flashcard) => {
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    const { error } = await supabase.from('cards').update({
        state: updatedCard.state,
        next_review: new Date(updatedCard.nextReviewDate).toISOString(),
        interval: updatedCard.interval,
        ease_factor: updatedCard.easeFactor
    }).eq('id', updatedCard.id);

    if (error) console.error('Error updating:', error);
  };

  const deleteCard = async (cardId: string) => {
      setCards(prev => prev.filter(c => c.id !== cardId));

      const { error } = await supabase.from('cards').delete().eq('id', cardId);
      if (error) {
          console.error("Error deleting:", error);
          alert("Failed to delete card from DB!");
      }
  };

  // Treat "formal-only" cards as heavy; exclude "informal", mixed tags, etc.
  const isFormalCard = (c: Flashcard): boolean => {
      const t = (c.tone || '').toLowerCase();
      return t.includes('formal') && !t.includes('informal');
  };

  const getDueCards = () => {
    const now = Date.now();
    const due = cards.filter(c => c.nextReviewDate <= now);

    const reviews = due.filter(c => c.state !== 'NEW');
    const newCards = due.filter(c => c.state === 'NEW');

    const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    const sortedNew = [...newCards].sort((a, b) => b.createdAt - a.createdAt);

    // LIFO: newest cards first, then reviews (last in, first served)
    return [...sortedNew, ...sortedReviews];
  };

  // Build a session with a balanced formal / non-formal mix so you don't
  // grind through 50 formal words in a row. Target ~40% formal, 60% other,
  // interleaved so they alternate. Falls back gracefully if one bucket is small.
  const buildSession = (size = 50): Flashcard[] => {
      const ordered = getDueCards();

      const formal: Flashcard[] = [];
      const lighter: Flashcard[] = [];
      for (const c of ordered) {
          if (isFormalCard(c)) formal.push(c); else lighter.push(c);
      }

      const targetFormal = Math.round(size * 0.4); // e.g., 20 out of 50
      let takeFormal = Math.min(targetFormal, formal.length);
      let takeLighter = Math.min(size - takeFormal, lighter.length);

      // If one bucket fell short, backfill from the other so we still hit `size`.
      const shortfall = size - takeFormal - takeLighter;
      if (shortfall > 0) {
          if (formal.length > takeFormal) {
              takeFormal = Math.min(formal.length, takeFormal + shortfall);
          } else if (lighter.length > takeLighter) {
              takeLighter = Math.min(lighter.length, takeLighter + shortfall);
          }
      }

      const pickedFormal = formal.slice(0, takeFormal);
      const pickedLighter = lighter.slice(0, takeLighter);

      // Interleave — start with a lighter card so the session opens easy.
      const session: Flashcard[] = [];
      const maxLen = Math.max(pickedFormal.length, pickedLighter.length);
      for (let i = 0; i < maxLen; i++) {
          if (i < pickedLighter.length) session.push(pickedLighter[i]);
          if (i < pickedFormal.length) session.push(pickedFormal[i]);
      }
      return session;
  };

  // --- Load Data & Restore Session ---
  useEffect(() => {
    async function init() {
      try {
        // Supabase defaults to 1000 rows — paginate to fetch all cards
        const allRows: any[] = [];
        const PAGE_SIZE = 1000;
        let from = 0;
        while (true) {
            const { data: page, error } = await supabase
                .from('cards')
                .select('*')
                .range(from, from + PAGE_SIZE - 1);
            if (error) throw error;
            if (!page || page.length === 0) break;
            allRows.push(...page);
            if (page.length < PAGE_SIZE) break;
            from += PAGE_SIZE;
        }

        if (allRows.length > 0) {
            const mappedCards = allRows.map(mapRowToCard);
            setCards(mappedCards);

            // Check for active session *after* loading cards
            const session = rebuildSessionFromStorage(mappedCards);
            if (session) {
                setRestoredSession(session);
                setView('study');
            }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [rebuildSessionFromStorage]);

  // --- Visibilitychange: re-sync session when app returns to foreground ---
  useEffect(() => {
      const handleVisibility = () => {
          if (document.visibilityState === 'visible' && cards.length > 0) {
              const session = rebuildSessionFromStorage(cards);
              if (session) {
                  setRestoredSession(session);
                  // If we were on dashboard but session exists, stay on dashboard
                  // but mark session as active so "Resume" button shows
              } else {
                  // Session was cleared (completed) while in background
                  setRestoredSession(null);
                  if (view === 'study') {
                      setView('dashboard');
                  }
              }
          }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cards, view, rebuildSessionFromStorage]);

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
            const session = rebuildSessionFromStorage(cards);
            if (session) {
                setRestoredSession(session);
            }
            setView('study');
            return;
        }
    }

    const due = buildSession(50);
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

  return (
    <div className="app-container">
      {view === 'dashboard' && (
        <Dashboard
          cards={cards}
          onStartStudy={() => handleStartStudy(false)}
          onAddCard={() => setView('add')}
          onStartChallenge={() => setView('scenario')}
          hasActiveSession={!!restoredSession}
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
      {view === 'scenario' && (
        <ScenarioChallenge
          cards={cards}
          onClose={() => setView('dashboard')}
        />
      )}
    </div>
  );

}

export default App;
