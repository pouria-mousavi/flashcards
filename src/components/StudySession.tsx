import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlashcardComponent from './Flashcard';
import { calculateSM2, CardState } from '../utils/sm2';
import type { Flashcard } from '../utils/sm2';

interface Props {
  cards: Flashcard[];
  onUpdateCard: (card: Flashcard) => void;
  onSessionComplete: () => void;
  onExit: () => void;
}

export default function StudySession({ cards, onUpdateCard, onSessionComplete, onExit }: Props) {
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // We strictly use the order provided by the parent (App.tsx)
    // This allows the parent to handle "Priority Sort" or "Shuffle" correctly.
    setQueue(cards.slice(0, 50));
  }, []); 

  const handleRate = (rating: number) => {
    const currentCard = queue[currentCardIndex];
    // Calculate new stats
    const updates = calculateSM2(currentCard, rating);
    
    // Optimistically update the card in our queue if it's coming back
    const updatedCard = { ...currentCard, ...updates };
    
    onUpdateCard(updatedCard);

    // Confetti on "Easy" graduation
    if (rating === 5 && updates.state === CardState.REVIEW && currentCard.state !== CardState.REVIEW) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#ffffff']
      });
    }

    setIsFlipped(false);
    
    // Anki Logic: Re-queue check
    const now = Date.now();
    // Use the *new* nextReviewDate
    if (updatedCard.nextReviewDate && (updatedCard.nextReviewDate - now < 10 * 60 * 1000)) {
        // Re-queue at end of session
        setQueue(prev => [...prev, updatedCard]);
    } else {
        // If it's done for today, we don't requeue.
    }

    if (currentCardIndex < queue.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200);
    } else {
      onSessionComplete();
    }
  };

  if (queue.length === 0) return <div className="flex-center full-screen">All caught up! 🎉</div>;
  
  if (currentCardIndex >= queue.length) {
      onSessionComplete();
      return null;
  }

  const currentCard = queue[currentCardIndex];
  const cardsLeft = queue.length - currentCardIndex;

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', padding: '20px', position: 'relative' }}>
      
      {/* Header Controls */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button 
            onClick={onExit}
            style={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: 'var(--text-secondary)', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '12px',
                fontSize: '0.9rem',
                cursor: 'pointer'
            }}
        >
            ← Quit
        </button>
        <div style={{ color: 'var(--text-secondary)' }}>
            {cardsLeft} cards
        </div>
      </div>

      {/* Card Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode='wait'>
            <motion.div
                key={`${currentCard.id}-${currentCardIndex}`} 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
            >
                <FlashcardComponent 
                    card={currentCard} 
                    isFlipped={isFlipped} 
                    onFlip={() => setIsFlipped(!isFlipped)} 
                />
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ 
          height: '140px', 
          width: '100%', 
          maxWidth: '500px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '8px'
      }}>
        {!isFlipped ? (
            <button 
                onClick={() => setIsFlipped(true)}
                style={{ 
                    width: '100%', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    background: 'var(--accent)', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}>
                Show Answer
            </button>
        ) : (
            <>
                <RateButton label="Again" color="var(--danger)" onClick={() => handleRate(0)} />
                <RateButton label="Hard" color="var(--warning)" onClick={() => handleRate(3)} />
                <RateButton label="Good" color="var(--accent)" onClick={() => handleRate(4)} />
                <RateButton label="Easy" color="var(--success)" onClick={() => handleRate(5)} />
            </>
        )}
      </div>
    </div>
  );
}

function RateButton({ label, color, onClick }: { label: string, color: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            style={{
                flex: 1,
                height: '70px',
                borderRadius: '16px',
                background: color,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</span>
        </button>
    )
}
