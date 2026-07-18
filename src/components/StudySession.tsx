import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlashcardComponent from './Flashcard';
import { calculateSM2, isGrammarCard, LEARNING_REQUEUE_WINDOW_MS, previewIntervalLabel } from '../utils/sm2';
import type { Flashcard, StudyCard } from '../utils/sm2';
import { supabase } from '../lib/supabase';
import { SESSION_KEY } from '../lib/session';

interface Props {
  cards: StudyCard[];
  startIndex?: number;
  startFlipped?: boolean;
  onUpdateCard: (card: StudyCard) => void;
  onDeleteCard: (cardId: string) => void;
  onSessionComplete: () => void;
  onPause: () => void;
}

export default function StudySession({ cards, startIndex = 0, startFlipped = false, onUpdateCard, onDeleteCard, onSessionComplete, onPause }: Props) {
  // Initialize queue from props ONCE — never replace on parent re-renders
  const [queue, setQueue] = useState<StudyCard[]>(cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(startIndex);
  const [isFlipped, setIsFlipped] = useState(startFlipped);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  // Sync isFlipped to localStorage on every flip
  const syncFlipToStorage = useCallback((flipped: boolean) => {
      try {
          const saved = localStorage.getItem(SESSION_KEY);
          if (saved) {
              const session = JSON.parse(saved);
              session.isFlipped = flipped;
              localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          }
      } catch (e) { /* silent */ }
  }, []);

  const handleFlip = useCallback(() => {
      setIsFlipped(prev => {
          const next = !prev;
          syncFlipToStorage(next);
          return next;
      });
  }, [syncFlipToStorage]);

  // Safety: flush session state to localStorage when app goes to background
  useEffect(() => {
      const handleVisibility = () => {
          if (document.visibilityState === 'hidden') {
              // Flush current state to localStorage before app sleeps
              try {
                  const saved = localStorage.getItem(SESSION_KEY);
                  if (saved) {
                      const session = JSON.parse(saved);
                      session.currentIndex = currentCardIndex;
                      session.isFlipped = isFlipped;
                      session.cardIds = queue.map(c => c.id);
                      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                  }
              } catch (e) { /* silent */ }
          }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [currentCardIndex, isFlipped, queue]);

  // Fix: Move session completion into useEffect instead of render body
  useEffect(() => {
      if (!completedRef.current && queue.length > 0 && currentCardIndex >= queue.length) {
          completedRef.current = true;
          onSessionComplete();
      }
  }, [currentCardIndex, queue.length, onSessionComplete]);

  // Honor learning-step delays: if the card we're about to show is a re-queued
  // learning card that is NOT due yet, and a due card still waits later in the
  // queue, rotate the early card to the back and show the due one instead.
  // If nothing else is due, we show it early (Anki does the same).
  useEffect(() => {
      const card = queue[currentCardIndex];
      if (!card) return;
      const now = Date.now();
      if (card.nextReviewDate > now && queue.slice(currentCardIndex + 1).some(c => c.nextReviewDate <= now)) {
          setIsFlipped(false); // never reveal the swapped-in card's answer
          setQueue(prev => {
              const copy = [...prev];
              const [early] = copy.splice(currentCardIndex, 1);
              copy.push(early);
              try {
                  const saved = localStorage.getItem(SESSION_KEY);
                  if (saved) {
                      const session = JSON.parse(saved);
                      session.cardIds = copy.map(c => c.id);
                      session.isFlipped = false;
                      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                  }
              } catch { /* silent */ }
              return copy;
          });
      }
  }, [currentCardIndex, queue]);

  const handlePlayAudio = useCallback((text?: string) => {
      if (!text) return;
      // Stop any currently playing audio
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      // Use Supabase Edge Function proxy — always American English, no CORS issues
      const encoded = encodeURIComponent(text);
      const url = `https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/tts?q=${encoded}`;
      const audio = new Audio(url);
      audio.playbackRate = 0.85;
      audioRef.current = audio;
      audio.play().catch(() => {
          // Fallback to speechSynthesis if Google TTS is blocked
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
    const updatedCard: StudyCard = { ...currentCard, ...updates } as StudyCard;

    onUpdateCard(updatedCard);

    if (rating === 5) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#7c5cf6', '#a78bfa', '#c4b5fd']
      });
    }

    setIsFlipped(false);

    // Re-queue learning-step cards so they return within THIS session.
    const now = Date.now();
    let isRequeued = false;

    if (updatedCard.nextReviewDate && (updatedCard.nextReviewDate - now <= LEARNING_REQUEUE_WINDOW_MS)) {
        setQueue(prev => [...prev, updatedCard]);
        isRequeued = true;
    }

    // Sync session to localStorage
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

    // Advance synchronously — a deferred advance opens a window where the
    // rotation effect / visibility flush observe a stale index.
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleSaveNote = async (cardId: string, note: string) => {
      const { error } = await supabase
        .from('cards')
        .update({ user_notes: note })
        .eq('id', cardId);

      if (error) {
          console.error("Error saving note:", error);
          alert("Failed to save note!");
          return;
      }

      setQueue(prev => prev.map(c =>
          c.id === cardId ? { ...c, user_notes: note } : c
      ));
  };

  const handleDelete = (cardId: string) => {
      if (confirm("Are you sure you want to PERMANENTLY delete this card?")) {
          onDeleteCard(cardId);

          // A re-queued card can appear at several positions. Removing copies
          // BEFORE the pointer shifts everything left — adjust the index to
          // match, or later cards get skipped / the session ends early.
          const removedBefore = queue.slice(0, currentCardIndex).filter(c => c.id === cardId).length;
          const newQueue = queue.filter(c => c.id !== cardId);
          const newIndex = Math.max(0, currentCardIndex - removedBefore);

          setQueue(newQueue);
          setCurrentCardIndex(newIndex);
          setIsFlipped(false);

          // Sync updated queue to localStorage
          try {
              const saved = localStorage.getItem(SESSION_KEY);
              if (saved) {
                  const session = JSON.parse(saved);
                  session.cardIds = newQueue.map(c => c.id);
                  session.currentIndex = newIndex;
                  session.isFlipped = false;
                  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
              }
          } catch (e) { console.error("Session sync failed", e); }
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
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>All caught up!</span>
              <button
                  onClick={onSessionComplete}
                  style={{
                      marginTop: '16px',
                      padding: '12px 32px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--accent)',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                  }}
              >
                  Back to Deck
              </button>
          </div>
      );
  }

  // Session completion handled by useEffect — just render nothing if past end
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

      {/* Progress bar */}
      <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 15
      }}>
          <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--grad-en)',
              transition: 'width 0.3s ease',
              borderRadius: '0 2px 2px 0',
              boxShadow: '0 0 12px var(--glow-en)'
          }} />
      </div>

      {/* Header */}
      <div style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
      }}>
        <button
            onClick={onPause}
            className="pressable glass"
            style={{
                color: 'var(--text-secondary)',
                padding: '8px 15px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'transparent'
            }}
        >
            &#8592; Back
        </button>
        <div className="glass tabular" style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: '999px'
        }}>
            {cardsLeft} left
        </div>
      </div>

      {/* Card area */}
      <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '56px',
          justifyContent: 'center',
          width: '100%',
          overflowY: 'auto',
          paddingBottom: '140px'
      }}>
        <AnimatePresence mode='wait'>
            <motion.div
                key={`${currentCard.id}-${currentCardIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
                {isGrammarCard(currentCard) ? (
                    <GrammarCardView
                        card={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                        onPlayAudio={() => handlePlayAudio(currentCard.back)}
                    />
                ) : (
                    <FlashcardComponent
                        card={currentCard as Flashcard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                        onSaveNote={handleSaveNote}
                        onDelete={() => handleDelete(currentCard.id)}
                        onPlayAudio={() => handlePlayAudio((currentCard as Flashcard).back)}
                    />
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
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
                    className="pressable"
                    style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 'var(--radius)',
                        background: 'var(--grad-en)',
                        color: 'var(--cta-ink-en)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 10px 30px -6px var(--glow-en), 0 1px 0 rgba(255,255,255,0.25) inset',
                        border: 'none',
                        letterSpacing: '-0.01em'
                    }}>
                    Show Answer
                </button>
            ) : (
                <>
                    <RateButton label="Again" hint={previewIntervalLabel(currentCard, 0)} tone="again" onClick={() => handleRate(0)} />
                    <RateButton label="Hard" hint={previewIntervalLabel(currentCard, 3)} tone="hard" onClick={() => handleRate(3)} />
                    <RateButton label="Good" hint={previewIntervalLabel(currentCard, 4)} tone="good" onClick={() => handleRate(4)} />
                    <RateButton label="Easy" hint={previewIntervalLabel(currentCard, 5)} tone="easy" onClick={() => handleRate(5)} />
                </>
            )}
        </div>
      </div>
    </div>
  );
}

function RateButton({ label, hint, tone, onClick }: { label: string, hint: string, tone: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="pressable"
            style={{
                flex: 1,
                height: '60px',
                borderRadius: 'var(--radius-sm)',
                background: `var(--rate-${tone}-bg)`,
                border: `1px solid var(--rate-${tone}-bd)`,
                color: `var(--rate-${tone})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '-0.01em'
            }}
        >
            <span>{label}</span>
            <span className="tabular" style={{ fontSize: '0.62rem', fontWeight: 600, opacity: 0.75 }}>{hint}</span>
        </button>
    )
}

// Inline grammar card view — rendered in the unified session when card.type === 'grammar'
import type { GrammarCard } from '../utils/sm2';
function GrammarCardView({
    card, isFlipped, onFlip, onPlayAudio,
}: {
    card: GrammarCard;
    isFlipped: boolean;
    onFlip: () => void;
    onPlayAudio: () => void;
}) {
    return (
        <div
            onClick={!isFlipped ? onFlip : undefined}
            style={{
                width: '100%',
                maxWidth: '460px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '0 20px',
                cursor: !isFlipped ? 'pointer' : 'default',
            }}
        >
            {/* Grammar badge */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{
                    background: 'rgba(167, 139, 250, 0.15)',
                    color: '#c4b5fd',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}>
                    Grammar
                </span>
            </div>

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
                    fontSize: card.front.length > 100 ? '1rem' : card.front.length > 60 ? '1.1rem' : '1.2rem',
                    fontFamily: 'Vazirmatn, sans-serif',
                    fontWeight: '600',
                    direction: 'rtl',
                    textAlign: 'right',
                    lineHeight: '2',
                    color: 'var(--text-primary)',
                    margin: 0,
                }}>
                    {card.front}
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
                            onClick={(e) => { e.stopPropagation(); onPlayAudio(); }}
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
                        fontSize: card.back.length > 100 ? '1rem' : '1.1rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        lineHeight: '1.6',
                    }}>
                        {card.back}
                    </p>

                    {/* Structure badge — what to learn from this sentence */}
                    {card.structure && (
                        <div style={{
                            marginTop: '14px',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(167, 139, 250, 0.18)',
                        }}>
                            <span style={{
                                fontSize: '0.6rem',
                                fontWeight: '700',
                                color: '#c4b5fd',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                display: 'block',
                                marginBottom: '4px',
                            }}>
                                Structure
                            </span>
                            <span style={{
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#ddd6fe',
                            }}>
                                {card.structure}
                            </span>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
