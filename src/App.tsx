
import { useEffect, useState, useCallback } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { mapRowToCard, mapGrammarRowToCard, isGrammarCard } from './utils/sm2';
import type { Flashcard, GrammarCard, StudyCard } from './utils/sm2';
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';
import ScenarioChallenge from './components/ScenarioChallenge';

type View = 'dashboard' | 'study' | 'add' | 'scenario';

const SESSION_KEY = 'flashcards_active_session';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [grammarCards, setGrammarCards] = useState<GrammarCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [restoredSession, setRestoredSession] = useState<{ queue: StudyCard[], index: number, isFlipped: boolean } | null>(null);

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

  // Unified update dispatcher — routes to the right table based on card type
  const updateCardStats = async (updatedCard: StudyCard) => {
    const table = isGrammarCard(updatedCard) ? 'grammar_cards' : 'cards';

    if (isGrammarCard(updatedCard)) {
        setGrammarCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    } else {
        setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    }

    const { error } = await supabase.from(table).update({
        state: updatedCard.state,
        next_review: new Date(updatedCard.nextReviewDate).toISOString(),
        interval: updatedCard.interval,
        ease_factor: updatedCard.easeFactor
    }).eq('id', updatedCard.id);

    if (error) console.error(`Error updating ${table}:`, error);
  };

  const deleteCard = async (cardId: string) => {
      setCards(prev => prev.filter(c => c.id !== cardId));

      const { error } = await supabase.from('cards').delete().eq('id', cardId);
      if (error) {
          console.error("Error deleting:", error);
          alert("Failed to delete card from DB!");
      }
  };

  // Treat "formal-only" vocab as heavy; grammar cards and non-formal vocab are lighter.
  const isFormalCard = (c: StudyCard): boolean => {
      if (isGrammarCard(c)) return false;
      const t = (c.tone || '').toLowerCase();
      return t.includes('formal') && !t.includes('informal');
  };

  // Due cards across BOTH tables, merged and prioritized.
  const getDueCards = (): StudyCard[] => {
    const now = Date.now();
    const allDue: StudyCard[] = [
        ...cards.filter(c => c.nextReviewDate <= now),
        ...grammarCards.filter(c => c.nextReviewDate <= now),
    ];

    const reviews = allDue.filter(c => c.state !== 'NEW');
    const newCards = allDue.filter(c => c.state === 'NEW');

    const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    const sortedNew = [...newCards].sort((a, b) => b.createdAt - a.createdAt);

    // LIFO: newest cards first, then reviews (last in, first served)
    return [...sortedNew, ...sortedReviews];
  };

  // Build a session with a balanced formal-vocab / everything-else mix, so you
  // don't grind through 60 formal words in a row. Target ~40% formal-vocab,
  // 60% lighter (grammar + non-formal vocab). Falls back gracefully if one
  // bucket is small.
  const buildSession = (size = 60): StudyCard[] => {
      const ordered = getDueCards();

      const formal: StudyCard[] = [];
      const lighter: StudyCard[] = [];
      for (const c of ordered) {
          if (isFormalCard(c)) formal.push(c); else lighter.push(c);
      }

      const targetFormal = Math.round(size * 0.4); // e.g., 24 out of 60
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
      const session: StudyCard[] = [];
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

        const mappedCards = allRows.length > 0 ? allRows.map(mapRowToCard) : [];
        setCards(mappedCards);

        // --- Also fetch grammar cards (separate table) ---
        const { data: grammarRows, error: grammarError } = await supabase
            .from('grammar_cards')
            .select('*');
        let mappedGrammar: GrammarCard[] = [];
        if (grammarError) {
            console.error("Failed to load grammar cards", grammarError);
        } else if (grammarRows) {
            mappedGrammar = grammarRows.map(mapGrammarRowToCard);
            setGrammarCards(mappedGrammar);
        }

        // Restore any active session (queue may contain both types)
        const session = rebuildSessionFromStorage(mappedCards, mappedGrammar);
        if (session) {
            setRestoredSession(session);
            setView('study');
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildSessionFromStorage]);

  // --- Visibilitychange: re-sync session when app returns to foreground ---
  useEffect(() => {
      const handleVisibility = () => {
          if (document.visibilityState === 'visible' && cards.length > 0) {
              const session = rebuildSessionFromStorage(cards, grammarCards);
              if (session) {
                  setRestoredSession(session);
              } else {
                  setRestoredSession(null);
                  if (view === 'study') {
                      setView('dashboard');
                  }
              }
          }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cards, grammarCards, view, rebuildSessionFromStorage]);

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

    const due = buildSession(60);
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
          grammarCards={grammarCards}
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
