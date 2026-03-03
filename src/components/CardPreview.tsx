import type { Flashcard } from '../utils/sm2';

interface CardPreviewProps {
  cards: Partial<Flashcard>[];
  onSaveAll: () => void;
  onDiscard: () => void;
}

export default function CardPreview({ cards, onSaveAll, onDiscard }: CardPreviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Header */}
            <div style={{
              marginBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              paddingBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{card.back}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{card.pronunciation}</span>
            </div>

            {/* Persian + Tone */}
            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
              <PreviewField label="Persian" value={card.front} />
              {card.tone && (
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  width: 'fit-content'
                }}>
                  {card.tone}
                </span>
              )}
            </div>

            {/* Word Forms */}
            {card.word_forms && Object.entries(card.word_forms).filter(([, v]) => v).length > 0 && (
              <div style={{
                marginBottom: '16px',
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <label style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  marginBottom: '6px',
                  display: 'block',
                  textTransform: 'uppercase'
                }}>Word Forms</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(card.word_forms).filter(([, v]) => v).map(([key, val]) => (
                    <span key={key} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                      <span style={{ color: 'var(--accent)', opacity: 0.8 }}>{key}:</span> {val as string}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other Meanings */}
            {card.other_meanings && card.other_meanings.length > 0 && (
              <div style={{
                marginBottom: '16px',
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <label style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  marginBottom: '6px',
                  display: 'block',
                  textTransform: 'uppercase'
                }}>Other Meanings</label>
                {card.other_meanings.map((m, i) => (
                  <div key={i} style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: 'var(--accent)' }}>{m.english}</span> — {m.persian}
                  </div>
                ))}
              </div>
            )}

            {/* Examples */}
            {card.examples && card.examples.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <label style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  marginBottom: '6px',
                  display: 'block',
                  textTransform: 'uppercase'
                }}>Examples</label>
                <ul style={{
                  margin: 0,
                  paddingLeft: '16px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  {card.examples.slice(0, 4).map((ex, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        position: 'sticky',
        bottom: '20px',
        background: 'var(--bg-color)',
        padding: '10px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <button
          onClick={onDiscard}
          style={{
            flex: 1,
            padding: '18px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Discard
        </button>

        <button
          onClick={onSaveAll}
          style={{
            flex: 2,
            padding: '18px',
            borderRadius: '20px',
            background: 'var(--success)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
          }}
        >
          Save {cards.length} Cards
        </button>
      </div>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  return (
    <div>
      <label style={{
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        display: 'block',
        marginBottom: '2px'
      }}>{label}</label>
      <div style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>{value}</div>
    </div>
  );
}
