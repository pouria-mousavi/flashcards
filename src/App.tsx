
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

    const reviews = allDue.filter(c => c.state !== 'NEW');
    const newCards = allDue.filter(c => c.state === 'NEW');

    // Reviews stay sorted by due date (oldest first)
    const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);

    // NEW cards: shuffle to break up topic clusters from batch imports
    // (e.g., 6 "smell" words added together would otherwise cluster).
    // We still bias toward recently-added by taking the top 250 newest first.
    const recentNew = [...newCards]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 250);
    const shuffledNew = shuffle(recentNew);

    // NEW cards come before reviews (LIFO across types)
    return [...shuffledNew, ...sortedReviews];
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
