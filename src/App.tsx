import { useEffect, useState } from 'react';
import { parseFlashcards } from './utils/parser';
import type { Flashcard } from './utils/parser';
import type { CardStats } from './utils/sm2';
import StudySession from './components/StudySession';
import Dashboard from './components/Dashboard';
import AddCard from './components/AddCard';

type View = 'dashboard' | 'study' | 'add';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<Record<string, CardStats>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');

  // Load Data
  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch Cards
        // We check local storage first for user-added cards? 
        // For now, let's load file + combine with local "custom cards".
        const res = await fetch('/flashcards.txt');
        const text = await res.text();
        const fileCards = parseFlashcards(text);
        
        const localCardsJson = localStorage.getItem('custom-cards');
        const localCards = localCardsJson ? JSON.parse(localCardsJson) : [];
        
        setCards([...fileCards, ...localCards]);

        // 2. Load Progress
        const savedStats = localStorage.getItem('flashcard-stats-v2');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        } else {
            // Check for v1 stats and maybe migrate? Or just start fresh.
            // Start fresh is safer for v2 strict algo.
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const updateStats = (id: string, newStats: CardStats) => {
    const updated = { ...stats, [id]: newStats };
    setStats(updated);
    localStorage.setItem('flashcard-stats-v2', JSON.stringify(updated));
  };

  const handleAddCard = (front: string, back: string) => {
    const newCard: Flashcard = {
        id: crypto.randomUUID(),
        front,
        back
    };
    
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    
    // Persist custom cards
    // Filter out file cards? For simple logic, we just store *new* cards in 'custom-cards'.
    // We need to know which are custom. For this demo, let's just append to a stored list.
    const localCardsJson = localStorage.getItem('custom-cards');
    const localCards = localCardsJson ? JSON.parse(localCardsJson) : [];
    localStorage.setItem('custom-cards', JSON.stringify([...localCards, newCard]));

    setView('dashboard');
  };

  if (loading) {
    return (
        <div className="flex-center full-screen" style={{ color: 'var(--accent)' }}>
            Loading your deck...
        </div>
    );
  }

  return (
    <>
      <div style={{ display: view === 'dashboard' ? 'block' : 'none', width: '100%', height: '100%' }}>
         <Dashboard 
            cards={cards} 
            stats={stats} 
            onStartStudy={() => setView('study')} 
            onAddCard={() => setView('add')} 
         />
      </div>

      {view === 'study' && (
        <StudySession 
            cards={cards} 
            stats={stats} 
            onUpdateStats={updateStats} 
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
