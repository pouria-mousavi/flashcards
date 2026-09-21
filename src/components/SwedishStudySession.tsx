import { useState, useEffect, useCallback, useRef } from 'react';
import SwedishCardView from './SwedishCard';

import { makeReview } from '../lib/scheduler';
import type { ReviewEvent } from '../lib/studyTypes';
import type { SwedishCard } from '../utils/sm2';
import { SWEDISH_SESSION_KEY } from '../lib/session';
import { playTTS } from '../lib/tts';
import { useStudyTime } from '../lib/useStudyTime';
import StudyBreak from './StudyBreak';

interface Props {
  userId: string;
  cards: SwedishCard[];
  startIndex?: number;
  startFlipped?: boolean;
  onUpdateCard: (card: SwedishCard, event: ReviewEvent) => void;
  onDeleteCard: (cardId: string) => void;
  canEdit?: boolean;
  onSessionComplete: () => void;
  onPause: () => void;
  onOpenReference?: () => void;
}

export default function SwedishStudySession({
  userId, cards, startIndex = 0, startFlipped = false, onUpdateCard, onDeleteCard, canEdit = true, onSessionComplete, onPause, onOpenReference,
}: Props) {
  // Initialize queue from props ONCE — never replace on parent re-renders.
  const [queue, setQueue] = useState<SwedishCard[]>(cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(startIndex);
  const [isFlipped, setIsFlipped] = useState(startFlipped);
  const studyTime = useStudyTime(userId, Math.min(...queue.slice(currentCardIndex).map(c => c.nextReviewDate)));
  const hasReadyCards = studyTime.ready;
  const [mayFinishCard, setMayFinishCard] = useState(() => !studyTime.exhausted);
  const completedRef = useRef(false);
  const [ratingError, setRatingError] = useState('');

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
    // Both entry points (the Show Answer button and tapping the card) are gated
    // on !isFlipped, so this only ever reveals. Guard anyway, so a stray call
    // cannot replay the audio over itself.
    if (isFlipped) return;
    setIsFlipped(true);
    syncFlipToStorage(true);

    // Speak the answer as it appears — exactly what tapping the Swedish text or
    // its speaker does. This lives in the click handler rather than an effect on
    // purpose: mobile browsers only permit audio inside a user gesture, and an
    // effect would fire twice under StrictMode and play the clip over itself.
    // Resuming a session that was already flipped never lands here, so reopening
    // the app is silent.
    const card = queue[currentCardIndex];
    if (card) playTTS(card.back, card.backLang);
  }, [isFlipped, syncFlipToStorage, queue, currentCardIndex]);

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
  // If nothing else is due, the break screen preserves the scheduled delay.
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

  const handleRate = (rating: ReviewEvent['rating']) => {
    const currentCard = queue[currentCardIndex];
    if (!currentCard || currentCard.nextReviewDate > Date.now() || (studyTime.exhausted && !mayFinishCard)) return;
    const withinGuide = studyTime.canStudy();

    const { updated: updatedCard, event } = makeReview(currentCard, 'swedish', rating, studyTime.reviewDuration());
    try { onUpdateCard(updatedCard, event); }
    catch { setRatingError('This review could not be saved on your device. Free some browser storage and try again.'); return; }
    studyTime.resetReviewTimer();
    if (!withinGuide) setMayFinishCard(false);
    setRatingError('');

    setIsFlipped(false);

    try {
      const saved = localStorage.getItem(SWEDISH_SESSION_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        session.currentIndex = currentCardIndex + 1;
        session.isFlipped = false;
        localStorage.setItem(SWEDISH_SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) { console.error('Swedish session sync failed', e); }

    // Advance synchronously — a deferred advance opens a window where the
    // rotation effect / visibility flush observe a stale index.
    setCurrentCardIndex(prev => prev + 1);
  };

  if (studyTime.exhausted && !mayFinishCard) return <StudyBreak budgetComplete onBack={onPause} />;
  if (currentCardIndex < queue.length && !hasReadyCards) {
    return <StudyBreak budgetComplete={false} onBack={onSessionComplete} />;
  }

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
  return (
    <div className="calm-session">
      <header className="calm-session-header">
        <button onClick={onPause} className="calm-back">← Leave for now</button>
        <span className="calm-session-label">One card at a time</span>
        {onOpenReference && <button onClick={onOpenReference} className="calm-back" aria-label="Open grammar tables">Help</button>}
      </header>
      {ratingError && <p role="alert" style={{ padding: '0 20px', color: 'var(--danger)' }}>{ratingError}</p>}
      <div className="calm-session-body">
        <SwedishCardView key={`${currentCard.id}-${currentCardIndex}`} card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} onDelete={canEdit ? () => handleDelete(currentCard.id) : undefined} />
      </div>
      <footer className="calm-session-footer">
        <div className="calm-footer-content">
          {!isFlipped ? <button onClick={handleFlip} className="calm-primary">Show answer</button> : <>
            <p className="calm-rating-label">How did that feel?</p>
            <div className="calm-ratings">
              <RateButton label="Again" hint="I forgot" tone="again" onClick={() => handleRate(0)} />
              <RateButton label="Hard" hint="With effort" tone="hard" onClick={() => handleRate(3)} />
              <RateButton label="Good" hint="I knew it" tone="good" onClick={() => handleRate(4)} />
              <RateButton label="Easy" hint="Very easy" tone="easy" onClick={() => handleRate(5)} />
            </div>
          </>}
        </div>
      </footer>
    </div>
  );
}

function RateButton({ label, hint, tone, onClick }: { label: string; hint: string; tone: string; onClick: () => void }) {
  return <button onClick={onClick} className="calm-rate" data-rating={tone}><span>{label}</span><small>{hint}</small></button>;
}
