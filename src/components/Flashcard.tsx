import { motion } from 'framer-motion';
import type { Flashcard as IFlashcard } from '../utils/parser';

interface Props {
  card: IFlashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip }: Props) {
  return (
    <div className="card-container" style={{ perspective: 1000, cursor: 'pointer' }} onClick={onFlip}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: '300px',
          height: '450px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <h2 style={{ fontSize: '2rem', textAlign: 'center', margin: 0 }}>{card.front}</h2>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tap to reveal
          </p>
        </div>

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '24px',
            boxShadow: 'var(--card-shadow)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.05)',
            overflowY: 'auto'
          }}
        >
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', color: 'var(--accent)' }}>{card.back}</h3>
          
          {card.pronunciation && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <span>🗣</span>
                <span>{card.pronunciation}</span>
             </div>
          )}

          {card.tone && (
             <span style={{ 
               alignSelf: 'flex-start',
               background: 'rgba(255,255,255,0.1)', 
               padding: '4px 8px', 
               borderRadius: '4px',
               fontSize: '0.8rem',
               marginBottom: '16px'
             }}>
                {card.tone}
             </span>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

          {card.examples && card.examples.length > 0 && (
            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Examples:</strong>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {card.examples.map((ex, i) => (
                  <li key={i} style={{ marginBottom: '8px', fontSize: '0.95rem', lineHeight: '1.4' }}>{ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
