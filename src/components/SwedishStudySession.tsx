import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import SwedishCardView from './SwedishCard';
import { calculateSM2, LEARNING_REQUEUE_WINDOW_MS, previewIntervalLabel } from '../utils/sm2';
import type { SwedishCard } from '../utils/sm2';
import { SWEDISH_SESSION_KEY } from '../lib/session';

interface Props {
  cards: SwedishCard[];
  startIndex?: number;
  startFlipped?: boolean;
  onUpdateCard: (card: SwedishCard) => void;
  onDeleteCard: (cardId: string) => void;
  canEdit?: boolean;
  onSessionComplete: () => void;
  onPause: () => void;
  onOpenReference?: () => void;
}

export default function SwedishStudySession({
  cards, startIndex = 0, startFlipped = false, onUpdateCard, onDeleteCard, canEdit = true, onSessionComplete, onPause, onOpenReference,
}: Props) {
  // Initialize queue from props ONCE — never replace on parent re-renders.
  const [queue, setQueue] = useState<SwedishCard[]>(cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(startIndex);
  const [isFlipped, setIsFlipped] = useState(startFlipped);
  const completedRef = useRef(false);

  const syncFlipToStorage = useCallback((flipped: boolean) => {
    try {
      const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        session.isFlipped = flipped;
        localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
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

  // Flush state to localStorage when the app goes to background.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        try {
          const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
          if (saved) {
            const session = JSON.parse(saved);
            session.currentIndex = currentCardIndex;
            session.isFlipped = isFlipped;
            session.cardIds = queue.map(c => c.id);
            localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
          }
        } catch { /* silent */ }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [currentCardIndex, isFlipped, queue]);

  // Completion handled in an effect (not render body).
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
          const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
          if (saved) {
            const session = JSON.parse(saved);
            session.cardIds = copy.map(c => c.id);
            session.isFlipped = false;
            localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
          }
        } catch { /* silent */ }
        return copy;
      });
    }
  }, [currentCardIndex, queue]);

  const handleDelete = (cardId: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this card?')) {
      onDeleteCard(cardId);

      // A re-queued card can appear at several positions. Removing copies
      // BEFORE the pointer shifts everything left — adjust the index to match,
      // or later cards get silently skipped / the session ends early.
      const removedBefore = queue.slice(0, currentCardIndex).filter(c => c.id === cardId).length;
      const newQueue = queue.filter(c => c.id !== cardId);
      const newIndex = Math.max(0, currentCardIndex - removedBefore);

      setQueue(newQueue);
      setCurrentCardIndex(newIndex);
      setIsFlipped(false);

      // Keep the session storage in lockstep so a reload restores correctly.
      try {
        const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          session.cardIds = newQueue.map(c => c.id);
          session.currentIndex = newIndex;
          session.isFlipped = false;
          localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
        }
      } catch (e) { console.error('Swedish session sync failed', e); }
    }
  };

  const handleRate = (rating: number) => {
    const currentCard = queue[currentCardIndex];
    if (!currentCard) return;

    const updates = calculateSM2(currentCard, rating);
    const updatedCard: SwedishCard = { ...currentCard, ...updates } as SwedishCard;

    onUpdateCard(updatedCard);

    if (rating === 5) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#f4691e', '#fbbf24'],
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

    try {
      const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        session.currentIndex = currentCardIndex + 1;
        session.isFlipped = false;
        if (isRequeued && session.cardIds) {
          session.cardIds.push(updatedCard.id);
        }
        localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) { console.error('Swedish session sync failed', e); }

    // Advance synchronously — a deferred advance opens a window where the
    // rotation effect / visibility flush observe a stale index.
    setCurrentCardIndex(prev => prev + 1);
  };

  if (queue.length === 0) {
    return (
      <div className="flex-center full-screen" style={{ flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
        <span style={{ fontSize: '3rem' }}>&#10003;</span>
        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>All caught up!</span>
        <button
          onClick={onSessionComplete}
          style={{ marginTop: '16px', padding: '12px 32px', borderRadius: 'var(--radius)', background: '#3b82f6', color: '#fff', fontWeight: '600', fontSize: '0.95rem', border: 'none' }}
        >
          Back to Deck
        </button>
      </div>
    );
  }

  if (currentCardIndex >= queue.length) return null;

  const currentCard = queue[currentCardIndex];
  const cardsLeft = queue.length - currentCardIndex;
  const progress = (currentCardIndex / queue.length) * 100;

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', position: 'relative', height: '100dvh', overflow: 'hidden' }}>
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.05)', zIndex: 15 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--grad-sv)', transition: 'width 0.3s ease', borderRadius: '0 2px 2px 0', boxShadow: '0 0 12px var(--glow-sv)' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '14px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button
          onClick={onPause}
          className="pressable glass"
          style={{ color: 'var(--text-secondary)', padding: '8px 15px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, background: 'transparent' }}
        >
          &#8592; Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenReference && (
            <button
              onClick={onOpenReference}
              className="pressable glass"
              aria-label="Open grammar tables"
              style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, padding: '8px 14px', borderRadius: '999px', background: 'transparent' }}
            >
              ⊞ Tables
            </button>
          )}
          <div className="glass tabular" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, padding: '8px 14px', borderRadius: '999px' }}>
            {cardsLeft} left
          </div>
        </div>
      </div>

      {/* Card area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', paddingTop: '56px', justifyContent: 'center', width: '100%', overflowY: 'auto', paddingBottom: '140px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${currentCardIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <SwedishCardView card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} onDelete={canEdit ? () => handleDelete(currentCard.id) : undefined} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', background: 'linear-gradient(to top, var(--bg-color) 60%, transparent)', zIndex: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', gap: '8px' }}>
          {!isFlipped ? (
            <button
              onClick={handleFlip}
              className="pressable"
              style={{ width: '100%', padding: '18px', borderRadius: 'var(--radius)', background: 'var(--grad-sv)', color: 'var(--cta-ink-sv)', fontWeight: 700, fontSize: '1rem', boxShadow: '0 10px 30px -6px var(--glow-sv), 0 1px 0 rgba(255,255,255,0.25) inset', border: 'none', letterSpacing: '-0.01em' }}
            >
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

function RateButton({ label, hint, tone, onClick }: { label: string; hint: string; tone: string; onClick: () => void }) {
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
        letterSpacing: '-0.01em',
      }}
    >
      <span>{label}</span>
      <span className="tabular" style={{ fontSize: '0.62rem', fontWeight: 600, opacity: 0.75 }}>{hint}</span>
    </button>
  );
}
