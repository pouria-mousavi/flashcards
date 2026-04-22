import { motion } from 'framer-motion';
import { CardState } from '../utils/sm2';
import type { Flashcard, GrammarCard } from '../utils/sm2';

interface Props {
  cards: Flashcard[];
  grammarCards?: GrammarCard[];
  onStartStudy: () => void;
  onAddCard: () => void;
  onStartChallenge: () => void;
  hasActiveSession?: boolean;
}

interface LeitnerBox {
  label: string;
  count: number;
  color: string;
  softBg: string;
}

function classifyCards(cards: Flashcard[]): LeitnerBox[] {
  const counts = [0, 0, 0, 0, 0];

  cards.forEach(card => {
    switch (card.state) {
      case CardState.NEW:
        counts[0]++;
        break;
      case CardState.LEARNING:
      case CardState.RELEARNING:
        counts[1]++;
        break;
      case CardState.REVIEW:
        if (card.interval <= 7) counts[2]++;
        else if (card.interval <= 30) counts[3]++;
        else counts[4]++;
        break;
    }
  });

  return [
    { label: 'New', count: counts[0], color: '#a1a1aa', softBg: 'rgba(161, 161, 170, 0.10)' },
    { label: 'Learning', count: counts[1], color: '#f59e0b', softBg: 'rgba(245, 158, 11, 0.10)' },
    { label: 'Young', count: counts[2], color: '#6366f1', softBg: 'rgba(99, 102, 241, 0.10)' },
    { label: 'Maturing', count: counts[3], color: '#8b5cf6', softBg: 'rgba(139, 92, 246, 0.10)' },
    { label: 'Mature', count: counts[4], color: '#10b981', softBg: 'rgba(16, 185, 129, 0.10)' },
  ];
}

export default function Dashboard({
  cards, grammarCards = [], onStartStudy, onAddCard, onStartChallenge, hasActiveSession,
}: Props) {
  const totalCards = cards.length + grammarCards.length;
  const now = Date.now();
  const dueCount =
      cards.filter(c => c.nextReviewDate <= now).length +
      grammarCards.filter(c => c.nextReviewDate <= now).length;
  const hasDue = dueCount > 0;

  const boxes = classifyCards(cards);
  const maxCount = Math.max(...boxes.map(b => b.count), 1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '28px',
      width: '100%',
      height: '100dvh',
      overflowY: 'auto',
      background: 'var(--bg-color)'
    }}>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          margin: '0 0 4px 0',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          My Deck
        </h1>
        <p style={{
          margin: 0,
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: '500'
        }}>
          {totalCards} cards total
        </p>
      </div>

      {/* Leitner Box Visualization */}
      <LeitnerBoxes boxes={boxes} maxCount={maxCount} />

      {/* Due badge */}
      {(hasDue || hasActiveSession) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'var(--accent-soft)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
        }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--accent)',
              flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'var(--accent)',
          }}>
            {hasActiveSession ? 'Session in progress' : `${dueCount} due for review`}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
        <button
          onClick={onStartStudy}
          disabled={!hasDue && !hasActiveSession}
          style={{
            padding: '18px',
            fontSize: '1rem',
            fontWeight: '700',
            background: (hasDue || hasActiveSession) ? 'var(--accent)' : 'var(--card-bg)',
            color: (hasDue || hasActiveSession) ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius)',
            boxShadow: (hasDue || hasActiveSession) ? '0 8px 24px rgba(99, 102, 241, 0.3)' : 'none',
            opacity: (!hasDue && !hasActiveSession) ? 0.5 : 1,
            transition: 'all 0.2s ease',
            border: 'none',
            letterSpacing: '-0.01em'
          }}
        >
          {hasActiveSession
            ? "Resume Session"
            : (dueCount > 0
              ? `Study ${Math.min(dueCount, 60)} Cards`
              : "All Caught Up")}
        </button>

        <button
          onClick={onStartChallenge}
          style={{
            padding: '16px',
            fontSize: '0.95rem',
            fontWeight: '600',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#34d399',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          🎯 Daily Challenge
        </button>

        <button
          onClick={onAddCard}
          style={{
            padding: '16px',
            fontSize: '0.95rem',
            fontWeight: '600',
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            transition: 'all 0.2s ease',
            letterSpacing: '-0.01em'
          }}
        >
          + Add Cards
        </button>
      </div>
    </div>
  );
}

function LeitnerBoxes({ boxes, maxCount }: { boxes: LeitnerBox[], maxCount: number }) {
  const slotH = 110;

  return (
    <div style={{
      width: '100%',
      maxWidth: '360px',
      background: 'var(--card-bg)',
      borderRadius: 'var(--radius)',
      padding: '20px 14px 16px',
      border: '1px solid var(--border)',
      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.12)',
    }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {boxes.map((box, i) => {
          const pct = box.count / maxCount;
          const minH = box.count > 0 ? 22 : 0;
          const fillH = Math.max(pct * slotH, minH);

          return (
            <div key={box.label} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              {/* Compartment slot */}
              <div style={{
                width: '100%',
                height: `${slotH}px`,
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '8px 8px 6px 6px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                {/* Filled card area */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: fillH }}
                  transition={{
                    delay: 0.2 + i * 0.08,
                    duration: 0.6,
                    ease: [0.22, 1.0, 0.36, 1]
                  }}
                  style={{
                    width: '100%',
                    background: box.softBg,
                    borderTop: box.count > 0 ? `2px solid ${box.color}` : 'none',
                    position: 'relative',
                  }}
                >
                  {/* Card edge lines at top — simulates stacked cards */}
                  {box.count >= 3 && [0, 1].map(j => (
                    <div key={j} style={{
                      position: 'absolute',
                      top: `${4 + j * 3}px`,
                      left: '3px',
                      right: '3px',
                      height: '1px',
                      background: `${box.color}25`,
                    }} />
                  ))}
                </motion.div>

                {/* Count overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    style={{
                      fontSize: box.count >= 1000 ? '0.8rem' : '1.1rem',
                      fontWeight: '800',
                      color: box.count > 0 ? box.color : 'var(--text-muted)',
                      opacity: box.count > 0 ? 1 : 0.3,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {box.count}
                  </motion.span>
                </div>
              </div>

              {/* Label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                style={{
                  fontSize: '0.6rem',
                  fontWeight: '600',
                  color: box.count > 0 ? box.color : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  opacity: box.count > 0 ? 0.85 : 0.35,
                  whiteSpace: 'nowrap',
                }}
              >
                {box.label}
              </motion.span>
            </div>
          );
        })}
      </div>

      {/* Subtle progress track gradient */}
      <div style={{
        marginTop: '4px',
        height: '2px',
        borderRadius: '1px',
        background: 'linear-gradient(to right, #a1a1aa18, #f59e0b18, #6366f118, #8b5cf618, #10b98118)',
      }} />
    </div>
  );
}
