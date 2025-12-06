
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
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

  // Load Data
  useEffect(() => {
    async function init() {
      try {
        const { data, error } = await supabase.from('cards').select('*');
        if (error) throw error;
        
        if (data) {
            const mappedCards = data.map(mapRowToCard);
            setCards(mappedCards);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const updateCardStats = async (id: string, updates: Partial<Flashcard>) => {
      // 1. Optimistic Update
      setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

      // 2. Persist to DB
      // Need to map camelCase updates back to snake_case for DB
      const dbUpdates: any = {};
      if (updates.interval !== undefined) dbUpdates.interval = updates.interval;
      if (updates.easeFactor !== undefined) dbUpdates.ease_factor = updates.easeFactor;
      if (updates.nextReviewDate !== undefined) dbUpdates.next_review = new Date(updates.nextReviewDate).toISOString();
      if (updates.state !== undefined) dbUpdates.state = updates.state;

      const { error } = await supabase.from('cards').update(dbUpdates).eq('id', id);
      if (error) console.error("Failed to save progress", error);
  };

  const handleAddCard = async (front: string, back: string) => {
      // Insert into DB
      const newCard = {
          front,
          back,
          state: 'NEW',
          next_review: new Date().toISOString(),
          interval: 0,
          ease_factor: 2.5
      };

      const { data, error } = await supabase.from('cards').insert(newCard).select().single();
      
      if (error) {
          alert("Error adding card: " + error.message);
          return;
      }
      
      if (data) {
          setCards(prev => [...prev, mapRowToCard(data)]);
          setView('dashboard');
      }
  };

  if (loading) {
    return (
        <div className="flex-center full-screen" style={{ color: 'var(--accent)' }}>
            Loading your deck from Cloud...
        </div>
    );
  }

  return (
    <>
      <div style={{ display: view === 'dashboard' ? 'block' : 'none', width: '100%', height: '100%' }}>
         <Dashboard 
            cards={cards} 
            onStartStudy={() => setView('study')} 
            onAddCard={() => setView('add')} 
         />
      </div>

      {view === 'study' && (
        <StudySession 
            cards={cards} 
            onUpdateStats={updateCardStats} 
            onSessionComplete={() => setView('dashboard')} 
            onExit={() => setView('dashboard')}
        />
      )}

      {view === 'add' && (
        <AddCard 
            onAdd={handleAddCard} 
            onCancel={() => setView('dashboard')} 
        />
      )}
    </>
  );
}

export default App;
