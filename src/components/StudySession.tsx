import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlashcardComponent from './Flashcard';
import { calculateSM2, CardState } from '../utils/sm2';
import type { Flashcard } from '../utils/sm2';

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

  // Load Voice Preference (Strict US)
  useEffect(() => {
    const loadVoices = () => {
         if (!window.speechSynthesis) return;
         // Strict Filter: US Only + High Quality
         const allVoices = window.speechSynthesis.getVoices();
         const usVoices = allVoices.filter(v => v.lang === 'en-US');
         
         // Pick Top 2-3 Best
         const best = usVoices.filter(v => 
            v.name.includes('Google') || 
            v.name.includes('Samantha') || 
            v.name.includes('Premium')
         );
         
         const candidate = best.length > 0 ? best[0] : usVoices[0];
         if (candidate) setVoice(candidate);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlayAudio = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    // Queue is passed directly now (restored or new)
    setQueue(cards);
    // Ensure index is valid
    if (startIndex < cards.length) {
        setCurrentCardIndex(startIndex);
    }
  }, [cards, startIndex]); 

  const handleRate = (rating: number) => {
    const currentCard = queue[currentCardIndex];
    if (!currentCard) return;

    const updates = calculateSM2(currentCard, rating);
    const updatedCard = { ...currentCard, ...updates };
    
    onUpdateCard(updatedCard);

    // Sync Progress to Storage
    try {
        const SESSION_KEY = 'flashcards_active_session';
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
            const session = JSON.parse(saved);
            // We are moving TO the next card index (current + 1)
            // But if we re-queue (Again), the total length increases.
            // Simplest logic: just save currentCardIndex + 1
            
            // NOTE: If we re-queue, we append to `cards` in memory (queue).
            // But `App.tsx` restoration logic uses the *saved ID list*.
            // If we append here, we must also append the ID to storage!
            
            // Let's handle the Re-queue logic carefully below.
            
            session.currentIndex = currentCardIndex + 1;
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    } catch (e) {
        console.error("Failed to sync persistence", e);
    }

    // Confetti logic...
    if (rating === 5 && updates.state === CardState.REVIEW && currentCard.state !== CardState.REVIEW) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#ffffff']
      });
    }

    setIsFlipped(false);
    
    // Anki Re-queue Logic
    const now = Date.now();
    if (updatedCard.nextReviewDate && (updatedCard.nextReviewDate - now < 10 * 60 * 1000)) {
        // Re-queue in memory
        setQueue(prev => [...prev, updatedCard]);
        
        // Update Storage Queue so it persists!
        try {
            const SESSION_KEY = 'flashcards_active_session';
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                const session = JSON.parse(saved);
                if (session.cardIds && !session.cardIds.includes(updatedCard.id)) {
                     // Wait, ID is already in list? 
                     // No, "re-queue" usually means "do it again at the end".
                     // If we just append the ID, the restoration mapped it.
                     // But duplicate IDs in ID list? 
                     // Actually, simplified: "Resume" just resumes the *original* list order.
                     // If user got "Again", and we reload app, should we remember they need to do it again?
                     // Yes. So append ID to session.cardIds
                     session.cardIds.push(updatedCard.id);
                     localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                } else if (session.cardIds) {
                     // Even if ID exists (it does, at current index), we want it *again* at the end.
                     // Allowing duplicates in ID list is fine for "queue".
                     session.cardIds.push(updatedCard.id);
                     localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                }
            }
        } catch (e) { console.error("Re-queue sync failed", e); }
    }

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
                    onSaveNote={handleSaveNote}
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
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: '12px',
          paddingBottom: '20px'
      }}>
        {/* Play Audio Button (Always Visible if Back is shown OR Front if desired, but user asked for Play Button at bottom) */}
        {/* We show it always for convenience, or strictly on back. Let's start with Always for convenience. */}
        <button 
            onClick={(e) => { e.stopPropagation(); handlePlayAudio(currentCard.back); }}
            style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom: '10px'
            }}
        >
            🔊
        </button>

        <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
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
