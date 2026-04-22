import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { calculateSM2 } from '../utils/sm2';
import type { GrammarCard } from '../utils/sm2';

const SESSION_KEY = 'flashcards_active_grammar_session';

interface Props {
  cards: GrammarCard[];
  startIndex?: number;
  startFlipped?: boolean;
  onUpdateCard: (card: GrammarCard) => void;
  onSessionComplete: () => void;
  onPause: () => void;
}

export default function GrammarStudy({
  cards, startIndex = 0, startFlipped = false,
  onUpdateCard, onSessionComplete, onPause,
}: Props) {
  const [queue, setQueue] = useState<GrammarCard[]>(cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(startIndex);
  const [isFlipped, setIsFlipped] = useState(startFlipped);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  const syncFlipToStorage = useCallback((flipped: boolean) => {
      try {
          const saved = localStorage.getItem(SESSION_KEY);
          if (saved) {
              const session = JSON.parse(saved);
              session.isFlipped = flipped;
              localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          }
      } catch { /* silent */ }
  }, []);

  const handleFlip = useCallback(() => {
      setIsFlipped(prev => {
          const next = !prev;
          syncFlipToStorage(next);
          return next;
      });
  }, [syncFlipToStorage]);

  // Flush session to localStorage when app backgrounds
  useEffect(() => {
      const handleVisibility = () => {
          if (document.visibilityState === 'hidden') {
              try {
                  const saved = localStorage.getItem(SESSION_KEY);
                  if (saved) {
                      const session = JSON.parse(saved);
                      session.currentIndex = currentCardIndex;
                      session.isFlipped = isFlipped;
                      session.cardIds = queue.map(c => c.id);
                      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                  }
              } catch { /* silent */ }
          }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [currentCardIndex, isFlipped, queue]);

  useEffect(() => {
      if (!completedRef.current && queue.length > 0 && currentCardIndex >= queue.length) {
          completedRef.current = true;
          onSessionComplete();
      }
  }, [currentCardIndex, queue.length, onSessionComplete]);

  const handlePlayAudio = useCallback((text?: string) => {
      if (!text) return;
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      const encoded = encodeURIComponent(text);
      const url = `https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/tts?q=${encoded}`;
      const audio = new Audio(url);
      audio.playbackRate = 0.85;
      audioRef.current = audio;
      audio.play().catch(() => {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
      });
  }, []);

  const handleRate = (rating: number) => {
    const currentCard = queue[currentCardIndex];
    if (!currentCard) return;

    const updates = calculateSM2(currentCard, rating);
    const updatedCard: GrammarCard = { ...currentCard, ...updates };

    onUpdateCard(updatedCard);

    if (rating === 5) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#a78bfa', '#c4b5fd', '#ddd6fe']
      });
    }

    setIsFlipped(false);

    // Re-queue if due within 10 minutes
    const now = Date.now();
    let isRequeued = false;

    if (updatedCard.nextReviewDate && (updatedCard.nextReviewDate - now < 10 * 60 * 1000)) {
        setQueue(prev => [...prev, updatedCard]);
        isRequeued = true;
    }

    try {
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
            const session = JSON.parse(saved);
            session.currentIndex = currentCardIndex + 1;
            session.isFlipped = false;
            if (isRequeued && session.cardIds) {
                 session.cardIds.push(updatedCard.id);
            }
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
    } catch (e) { console.error("Session sync failed", e); }

    const effectiveLength = isRequeued ? queue.length + 1 : queue.length;
    if (currentCardIndex < effectiveLength - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200);
    } else {
      setCurrentCardIndex(effectiveLength);
    }
  };

  if (queue.length === 0) {
      return (
          <div className="flex-center full-screen" style={{
              flexDirection: 'column',
              gap: '16px',
              color: 'var(--text-secondary)'
          }}>
              <span style={{ fontSize: '3rem' }}>&#10003;</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>All grammar cards caught up!</span>
              <button
                  onClick={onSessionComplete}
                  style={{
                      marginTop: '16px',
                      padding: '12px 32px',
                      borderRadius: 'var(--radius)',
                      background: '#a78bfa',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      border: 'none'
                  }}
              >
                  Back to Deck
              </button>
          </div>
      );
  }

  if (currentCardIndex >= queue.length) {
      return null;
  }

  const currentCard = queue[currentCardIndex];
  const cardsLeft = queue.length - currentCardIndex;
  const progress = ((currentCardIndex) / queue.length) * 100;

  return (
    <div className="flex-center full-screen" style={{
        flexDirection: 'column',
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--bg-color)'
    }}>

      {/* Progress bar — purple tint for grammar */}
      <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3px', background: 'var(--border)', zIndex: 15
      }}>
          <div style={{
              height: '100%',
              width: `${progress}%`,
              background: '#a78bfa',
              transition: 'width 0.3s ease',
              borderRadius: '0 2px 2px 0'
          }} />
      </div>

      {/* Header */}
      <div style={{
          position: 'absolute',
          top: '12px', left: '16px', right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
      }}>
        <button
            onClick={onPause}
            style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-muted)',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: '500'
            }}
        >
            &#8592; Back
        </button>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: '500'
        }}>
            <span style={{
                background: 'rgba(167, 139, 250, 0.15)',
                color: '#c4b5fd',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.04em'
            }}>
                GRAMMAR
            </span>
            {cardsLeft} left
        </div>
      </div>

      {/* Card area */}
      <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '64px',
          paddingBottom: '200px',
          justifyContent: 'center',
          width: '100%',
          overflowY: 'auto',
          padding: '64px 20px 200px',
      }}>
        <AnimatePresence mode='wait'>
            <motion.div
                key={`${currentCard.id}-${currentCardIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                    width: '100%',
                    maxWidth: '460px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {/* Front — Persian sentence */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px 24px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--card-shadow)',
                }}>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'block',
                        marginBottom: '14px'
                    }}>
                        چطور این جمله رو به انگلیسی بگی؟
                    </span>

                    <p style={{
                        fontSize: currentCard.front.length > 100 ? '1rem' : currentCard.front.length > 60 ? '1.1rem' : '1.2rem',
                        fontFamily: 'Vazirmatn, sans-serif',
                        fontWeight: '600',
                        direction: 'rtl',
                        textAlign: 'right',
                        lineHeight: '2',
                        color: 'var(--text-primary)',
                        margin: 0,
                    }}>
                        {currentCard.front}
                    </p>
                </div>

                {/* Back — English sentence (revealed on flip) */}
                {isFlipped && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(167, 139, 250, 0.08)',
                            borderRadius: 'var(--radius)',
                            padding: '22px 20px',
                            border: '1px solid rgba(167, 139, 250, 0.25)',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}>
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                color: '#c4b5fd',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}>
                                English
                            </span>
                            <button
                                onClick={() => handlePlayAudio(currentCard.back)}
                                style={{
                                    background: 'rgba(167, 139, 250, 0.18)',
                                    color: '#c4b5fd',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                aria-label="Play audio"
                            >
                                ♪
                            </button>
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: currentCard.back.length > 100 ? '1rem' : '1.1rem',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            lineHeight: '1.6',
                        }}>
                            {currentCard.back}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          padding: '16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-color) 60%, transparent)',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', gap: '8px' }}>
            {!isFlipped ? (
                <button
                    onClick={handleFlip}
                    style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 'var(--radius)',
                        background: '#a78bfa',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1rem',
                        boxShadow: '0 4px 16px rgba(167, 139, 250, 0.35)',
                        border: 'none',
                        letterSpacing: '-0.01em'
                    }}>
                    Show Answer
                </button>
            ) : (
                <>
                    <RateButton label="Again" color="var(--danger)" onClick={() => handleRate(0)} />
                    <RateButton label="Hard" color="var(--warning)" onClick={() => handleRate(3)} />
                    <RateButton label="Good" color="#a78bfa" onClick={() => handleRate(4)} />
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
                height: '56px',
                borderRadius: 'var(--radius-sm)',
                background: color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s, opacity 0.1s',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                letterSpacing: '-0.01em'
            }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.95)'; e.currentTarget.style.opacity = '0.9'; }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
        >
            {label}
        </button>
    );
}
