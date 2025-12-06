import { CardState } from '../utils/sm2';
import type { CardStats } from '../utils/sm2';
import type { Flashcard } from '../utils/parser';

interface Props {
  cards: Flashcard[];
  stats: Record<string, CardStats>;
  onStartStudy: () => void;
  onAddCard: () => void;
}

export default function Dashboard({ cards, stats, onStartStudy, onAddCard }: Props) {
  // Compute Stats
  // const totalCards = cards.length;
  let newCards = 0;
  let learning = 0;
  let toReview = 0;
  let mature = 0;

  const now = Date.now();

  cards.forEach(card => {
    const s = stats[card.id];
    if (!s || s.state === CardState.NEW) {
      newCards++;
    } else if (s.state === CardState.LEARNING || s.state === CardState.RELEARNING) {
      learning++;
      if (s.nextReviewDate <= now) toReview++;
    } else if (s.state === CardState.REVIEW) {
      if (s.interval > 21) mature++;
      if (s.nextReviewDate <= now) toReview++;
    }
  });

  // If no stats exist for a card, it's effectively "New" but might not be in the stats object yet.
  // The counting above handles it (checks !s).

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', padding: '20px', gap: '24px' }}>
      
      {/* Header */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>My Deck</h1>

      {/* Main Stats Card */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px', 
          width: '100%', 
          maxWidth: '400px' 
      }}>
          <StatBox label="Due" value={toReview} color="var(--accent)" />
          <StatBox label="New" value={newCards} color="var(--text-secondary)" />
          <StatBox label="Learning" value={learning} color="var(--warning)" />
          <StatBox label="Mature" value={mature} color="var(--success)" />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', marginTop: '20px' }}>
          <button 
            onClick={onStartStudy}
            disabled={toReview === 0 && newCards === 0}
            style={{
                padding: '20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: toReview > 0 ? 'var(--accent)' : 'var(--card-bg)',
                color: toReview > 0 ? '#fff' : 'var(--text-secondary)',
                borderRadius: '24px',
                boxShadow: toReview > 0 ? '0 10px 30px rgba(59, 130, 246, 0.4)' : 'none',
                opacity: (toReview === 0 && newCards === 0) ? 0.5 : 1,
                transition: 'all 0.2s',
                border: toReview === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}
          >
              {toReview > 0 ? `Study ${toReview} Cards` : (newCards > 0 ? "Learn New Cards" : "All Done!")}
          </button>

          <button 
             onClick={onAddCard}
             style={{
                 padding: '16px',
                 fontSize: '1rem',
                 background: 'rgba(255,255,255,0.05)',
                 color: 'var(--text-primary)',
                 borderRadius: '24px',
                 border: '1px solid rgba(255,255,255,0.1)'
             }}
          >
              + Add New Card
          </button>
      </div>

    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div style={{ 
            background: 'var(--card-bg)', 
            padding: '20px', 
            borderRadius: '20px', 
            textAlign: 'center',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{value}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
        </div>
    )
}
