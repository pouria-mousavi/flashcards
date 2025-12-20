import { CardState } from '../utils/sm2';
import type { Flashcard } from '../utils/sm2';

interface Props {
  cards: Flashcard[];
  onStartStudy: () => void;
  onAddCard: () => void;
  onOpenBookMode: () => void;
  onReset: () => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
}

export default function Dashboard({ cards, onStartStudy, onAddCard, onOpenBookMode, onReset, isShuffled, onToggleShuffle }: Props) {
  // Compute Stats
  // const totalCards = cards.length;
  let newCards = 0;
  let learning = 0;
  let toReview = 0;
  let mature = 0;

  const now = Date.now();

  cards.forEach(card => {
    // Stats are now direct properties of card
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

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px', 
        gap: '24px',
        width: '100%',
        minHeight: '100dvh', // Ensure it takes full height but grows
        overflowY: 'auto', // Allow scrolling
        background: 'var(--bg-color)'
    }}>
      
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

          {/* Settings Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
                onClick={onToggleShuffle}
                style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '1rem',
                    background: isShuffled ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                    color: isShuffled ? '#fff' : 'var(--text-primary)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s'
                }}
            >
                🔀 {isShuffled ? 'Shuffle On' : 'Shuffle Off'}
            </button>
             <button 
                onClick={onAddCard}
                style={{
                    flex: 1,
                    padding: '16px',
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                + Add Card
            </button>
          </div>

          <button 
             onClick={onOpenBookMode}
             style={{
                 padding: '16px',
                 fontSize: '1rem',
                 background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                 color: '#fff',
                 fontWeight: 'bold',
                 borderRadius: '24px',
                 border: 'none',
                 boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px'
             }}
          >
              Book Mode 📖
          </button>

          <button 
             onClick={onReset}
             style={{
                 padding: '16px',
                 fontSize: '0.9rem',
                 background: 'transparent',
                 color: 'var(--danger)',
                 borderRadius: '24px',
                 border: '1px solid var(--danger)',
                 opacity: 0.7,
                 marginTop: '10px'
             }}
          >
              🔄 Reset Progress
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
