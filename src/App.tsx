
import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import { mapRowToCard } from './utils/sm2';
import type { Flashcard } from './utils/sm2';
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';

type View = 'dashboard' | 'study' | 'add';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  // We no longer need separate 'stats' object because Flashcard interface now includes stats directly!
  // This simplifies things greatly.
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');

  // --- Actions ---
  const saveCard = async (newCard: Flashcard) => {
      // Optimistic update
      setCards(prev => [...prev, newCard]);
      
      const { error } = await supabase.from('cards').insert({
          id: newCard.id,
          front: newCard.front,
          back: newCard.back,
          pronunciation: newCard.pronunciation,
          tone: newCard.tone,
          synonyms: newCard.synonyms, // New field
          examples: newCard.examples,
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
  
  const resetProgress = async () => {
    if (!confirm("Are you sure you want to reset ALL progress? This cannot be undone.")) return;
    
    // Reset local state
    setCards(prev => prev.map(c => ({
        ...c,
        state: 'NEW',
        nextReviewDate: Date.now(), // Due now
        interval: 0,
        easeFactor: 2.5
    } as Flashcard)));
    
    // Reset DB
    // Since we can't run bulk update easily without RPC or specific per-row loop if RLS is strict, 
    // but usually user can update rows.
    // 'next_review' to now, 'state' to NEW.
    const { error } = await supabase.from('cards').update({
        state: 'NEW',
        next_review: new Date().toISOString(),
        interval: 0,
        ease_factor: 2.5
    }).neq('id', '00000000-0000-0000-0000-000000000000'); // Update all (hacky neq check)
    
    if (error) alert("Error resetting DB: " + error.message);
    else alert("Progress Reset!");
  };

  const [isShuffled, setIsShuffled] = useState(true);

  const getDueCards = () => {
    const now = Date.now();
    const due = cards.filter(c => c.nextReviewDate <= now);
    
    if (isShuffled) {
        return [...due].sort(() => Math.random() - 0.5);
    }

    // Smart Sort: Learning > Relearning > Review > New
    return [...due].sort((a, b) => {
        // 1. Priority by State
        const priority = { 
            'LEARNING': 0, 
            'RELEARNING': 0, 
            'REVIEW': 1, 
            'NEW': 2 
        };
        // @ts-ignore
        const pA = priority[a.state] ?? 99;
        // @ts-ignore
        const pB = priority[b.state] ?? 99;
        
        if (pA !== pB) return pA - pB;

        // 2. Within same state, sort by time (Overdue first)
        return a.nextReviewDate - b.nextReviewDate;
    });
  };

  // Session Persistence
  const SESSION_KEY = 'flashcards_active_session';
  const [restoredSession, setRestoredSession] = useState<{ queue: Flashcard[], index: number } | null>(null);

  // Load Data & Check Session
  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.from('cards').select('*');
        if (error) throw error;
        
        if (data) {
            const mappedCards = data.map(mapRowToCard);
            setCards(mappedCards);

            // Check for active session *after* loading cards
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                try {
                    const session = JSON.parse(saved);
                    // Validate timestamp (expire after 24h?) - Optional, let's keep it simple for now.
                    if (session.cardIds && Array.isArray(session.cardIds)) {
                        const queue = session.cardIds.map((id: string) => mappedCards.find(c => c.id === id)).filter((c: Flashcard | undefined): c is Flashcard => !!c);
                        if (queue.length > 0) {
                            setRestoredSession({ queue, index: session.currentIndex || 0 });
                            setView('study');
                        }
                    }
                } catch (err) {
                    console.error("Failed to restore session", err);
                    localStorage.removeItem(SESSION_KEY);
                }
            }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleStartStudy = () => {
    const due = getDueCards().slice(0, 50); // Limit batch size
    if (due.length === 0) {
        alert("No cards due!");
        return;
    }
    
    // Save new session
    const sessionData = {
        cardIds: due.map(c => c.id),
        currentIndex: 0,
        timestamp: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    setRestoredSession({ queue: due, index: 0 });
    setView('study');
  };

  const handleSessionEnd = () => {
      localStorage.removeItem(SESSION_KEY);
      setRestoredSession(null);
      setView('dashboard');
  };

  // ... (Update Card Stats logic remains same)

  if (!isConfigured) {
      // ... (Error View)
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
  
  // Helpers
  // ...

  const handleAddCard = (front: string, back: string) => {
      // ... (Keep existing)
      const newCard: Flashcard = {
          id: crypto.randomUUID(),
          front,
          back,
          state: 'NEW',
          nextReviewDate: Date.now(),
          interval: 0,
          easeFactor: 2.5
      };
      saveCard(newCard);
      setView('dashboard');
  };

  return (
    <div className="app-container">
      {view === 'dashboard' && (
        <Dashboard 
          cards={cards} 
          onStartStudy={handleStartStudy} 
          onAddCard={() => setView('add')}
          onReset={resetProgress}
          isShuffled={isShuffled}
          onToggleShuffle={() => setIsShuffled(!isShuffled)}
        />
      )}
      {view === 'study' && restoredSession && (
        <StudySession 
          cards={restoredSession.queue}
          startIndex={restoredSession.index}
          onUpdateCard={updateCardStats} 
          onExit={handleSessionEnd} 
          onSessionComplete={handleSessionEnd}
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
