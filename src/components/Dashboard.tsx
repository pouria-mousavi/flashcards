import { CardState } from '../utils/sm2';
import type { Flashcard } from '../utils/sm2';

interface Props {
  cards: Flashcard[];
  onStartStudy: () => void;
  onAddCard: () => void;
  hasActiveSession?: boolean;
}

export default function Dashboard({ cards, onStartStudy, onAddCard, hasActiveSession }: Props) {
  const totalCards = cards.length;
  let newCards = 0;
  let learning = 0;
  let toReview = 0;
  let mature = 0;

  const now = Date.now();

  cards.forEach(card => {
    if (card.state === CardState.NEW) {
      newCards++;
    } else if (card.state === CardState.LEARNING || card.state === CardState.RELEARNING) {
      learning++;
      if (card.nextReviewDate <= now) toReview++;
    } else if (card.state === CardState.REVIEW) {
      if (card.interval > 21) mature++;
      if (card.nextReviewDate <= now) toReview++;
    }
  });

  const hasDue = toReview > 0 || newCards > 0;

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '32px',
        width: '100%',
        height: '100dvh',
        overflowY: 'auto',
        background: 'var(--bg-color)'
    }}>

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

      <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          width: '100%',
          maxWidth: '360px'
      }}>
          <StatBox label="Due" value={toReview} color="var(--accent)" bg="var(--accent-soft)" />
          <StatBox label="New" value={newCards} color="var(--text-secondary)" bg="rgba(255,255,255,0.04)" />
          <StatBox label="Learning" value={learning} color="var(--warning)" bg="var(--warning-soft)" />
          <StatBox label="Mature" value={mature} color="var(--success)" bg="var(--success-soft)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px', marginTop: '8px' }}>
          <button
            onClick={onStartStudy}
            disabled={!hasDue && !hasActiveSession}
            style={{
                padding: '18px',
                fontSize: '1rem',
                fontWeight: '700',
                background: hasActiveSession
                    ? 'var(--accent)'
                    : (hasDue ? 'var(--accent)' : 'var(--card-bg)'),
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
                  : (toReview > 0
                      ? `Study ${Math.min(toReview + newCards, 50)} Cards`
                      : (newCards > 0 ? "Learn New Cards" : "All Caught Up"))}
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

function StatBox({ label, value, color, bg }: { label: string, value: number, color: string, bg: string }) {
    return (
        <div style={{
            background: bg,
            padding: '20px 16px',
            borderRadius: 'var(--radius)',
            textAlign: 'center',
            border: '1px solid var(--border)',
            transition: 'transform 0.15s ease'
        }}>
            <div style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: color,
                letterSpacing: '-0.03em',
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '6px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {label}
            </div>
        </div>
    )
}
