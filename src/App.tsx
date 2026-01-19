
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

  const deleteCard = async (cardId: string) => {
      // Optimistic update
      setCards(prev => prev.filter(c => c.id !== cardId));
      setRestoredSession(prev => prev ? { ...prev, queue: prev.queue.filter(c => c.id !== cardId) } : null);

      const { error } = await supabase.from('cards').delete().eq('id', cardId);
      if (error) {
          console.error("Error deleting:", error);
          alert("Failed to delete card from DB!");
          // Revert if needed, but for now simple alert is enough
      }
  };
  

  const getDueCards = () => {
    const now = Date.now();
    const due = cards.filter(c => c.nextReviewDate <= now);
    
    // Partition: Reviews vs New
    const reviews = due.filter(c => c.state !== 'NEW');
    const newCards = due.filter(c => c.state === 'NEW');

    // 1. Reviews: Sort by Urgency (Oldest Due Date First) - Standard Anki-like behavior
    const sortedReviews = [...reviews].sort((a, b) => a.nextReviewDate - b.nextReviewDate);

    // 2. New Cards: Sort by Most Recent First (LIFO)
    // "ALWAYS the most recent cards to be shown at first"
    const sortedNew = [...newCards].sort((a, b) => b.createdAt - a.createdAt);

    // Return: Reviews -> New
    return [...sortedReviews, ...sortedNew];
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

  const handleStartStudy = (freshStart = false) => {
    // 1. Check for existing session first
    if (!freshStart) {
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved && restoredSession) {
            setView('study');
            return;
        }
    }

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

  const handleSessionPause = () => {
      // Just exit view, keep session
      setView('dashboard');
  };

  const handleSessionComplete = () => {
      // Clear session
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
          synonyms: partialCard.synonyms,
          examples: partialCard.examples || []
      };
      saveCard(newCard);
      // setView('dashboard'); // Removed to prevent closing AddCard
  };

  return (
    <div className="app-container">
      {view === 'dashboard' && (
        <Dashboard 
          cards={cards} 
          onStartStudy={() => handleStartStudy(false)} 
          onAddCard={() => setView('add')}
          hasActiveSession={!!restoredSession}
        />
      )}
      {view === 'study' && restoredSession && (
        <StudySession 
          cards={restoredSession.queue}
          startIndex={restoredSession.index}
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
