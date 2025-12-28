import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlashcardComponent from './Flashcard';
import { calculateSM2 } from '../utils/sm2';
import type { Flashcard } from '../utils/sm2';
import { supabase } from '../lib/supabase';

interface Props {
  cards: Flashcard[];
  startIndex?: number;
  onUpdateCard: (card: Flashcard) => void;
  onSessionComplete: () => void;
  onExit: () => void;
}

export default function StudySession({ cards, startIndex = 0, onUpdateCard, onSessionComplete, onExit }: Props) {
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(startIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    setQueue(cards);
  }, [cards]);

   useEffect(() => {
      const loadVoices = () => {
          const vs = window.speechSynthesis.getVoices();
          // Prefer "Google US English", then any "en-US", then fallback
          let preferred = vs.find(v => v.name === 'Google US English');
          if (!preferred) preferred = vs.find(v => v.lang === 'en-US');

          if (preferred) setVoice(preferred);
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handlePlayAudio = (text?: string) => {
      if (!text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
  };

  const handleRate = (rating: number) => {
    const currentCard = queue[currentCardIndex];
    if (!currentCard) return;

    // Calculate new stats
    const updates = calculateSM2(currentCard, rating);
    const updatedCard = { ...currentCard, ...updates };

    // Update Parent/DB
    onUpdateCard(updatedCard);
    
    // Confetti for "Easy"
    if (rating === 5) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399']
      });
    }

    setIsFlipped(false);
    
    // Anki Re-queue Logic
    const now = Date.now();
    let isRequeued = false;
    
    if (updatedCard.nextReviewDate && (updatedCard.nextReviewDate - now < 10 * 60 * 1000)) {
        // Re-queue in memory
        setQueue(prev => [...prev, updatedCard]);
        isRequeued = true;
    }

    // Sync Session State to LocalStorage (Progress Saving)
    try {
        const SESSION_KEY = 'flashcards_active_session';
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
            const session = JSON.parse(saved);
            session.currentIndex = currentCardIndex + 1; // Update index
            if (isRequeued && session.cardIds) {
                 session.cardIds.push(updatedCard.id);
            }
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    } catch (e) { console.error("Session sync failed", e); }

    if (currentCardIndex < queue.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200);
    } else {
      onSessionComplete();
    }
  };

  const handleSaveNote = async (cardId: string, note: string) => {
      // 1. Update in Supabase (Partial update)
      const { error } = await supabase
        .from('cards')
        .update({ user_notes: note }) // ONLY updating notes
        .eq('id', cardId);

      if (error) {
          console.error("Error saving note:", error);
          alert("Failed to save note!");
          return;
      }
      
      // Update local queue state so UI reflects change immediately
      setQueue(prev => prev.map(c => 
          c.id === cardId ? { ...c, user_notes: note } : c
      ));
  };

  if (queue.length === 0) return <div className="flex-center full-screen">All caught up! 🎉</div>;
  
  if (currentCardIndex >= queue.length) {
      onSessionComplete();
      return null;
  }

  const currentCard = queue[currentCardIndex];
  const cardsLeft = queue.length - currentCardIndex;

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', position: 'relative', height: '100vh', overflow: 'hidden' }}>
      
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

      {/* Card Area - Scrollable */}
      <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'flex-start', // Align start to allow scrolling if tall
          paddingTop: '80px', // Space for header
          justifyContent: 'center', 
          width: '100%',
          overflowY: 'auto',
          paddingBottom: '160px' // Space for fixed footer
      }}>
        <AnimatePresence mode='wait'>
            <motion.div
                key={`${currentCard.id}-${currentCardIndex}`} 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <FlashcardComponent 
                    card={currentCard} 
                    isFlipped={isFlipped} 
                    onFlip={() => setIsFlipped(!isFlipped)} 
                    onSaveNote={handleSaveNote}
                    onPlayAudio={() => handlePlayAudio(currentCard.back)}
                />
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls - Sticky Footer */}
      <div style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8) 80%, transparent)',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', gap: '8px' }}>
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
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                        border: 'none',
                        cursor: 'pointer'
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
                border: 'none',
                cursor: 'pointer'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</span>
        </button>
    )
}
