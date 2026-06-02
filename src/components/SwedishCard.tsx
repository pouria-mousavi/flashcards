import { motion } from 'framer-motion';
import { playTTS } from '../lib/tts';
import type { SwedishCard, Lang } from '../utils/sm2';

// Swedish accent — distinct from English indigo so the two decks feel separate.
const SV_ACCENT = '#60a5fa';
const SV_SOFT = 'rgba(96, 165, 250, 0.10)';
const SV_BORDER = 'rgba(96, 165, 250, 0.28)';

const LANG_LABEL: Record<Lang, string> = { sv: 'Svenska', en: 'English' };

// Small round speaker button — plays the given text in its own language.
function Speaker({ text, lang, size = 32 }: { text: string; lang: Lang; size?: number }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); playTTS(text, lang); }}
      aria-label={`Play ${LANG_LABEL[lang]} audio`}
      style={{
        flexShrink: 0,
        background: SV_SOFT,
        color: SV_ACCENT,
        border: `1px solid ${SV_BORDER}`,
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.45}px`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      🔊
    </button>
  );
}

interface Props {
  card: SwedishCard;
  isFlipped: boolean;
  onFlip: () => void;
  onDelete?: () => void;
}

export default function SwedishCardView({ card, isFlipped, onFlip, onDelete }: Props) {
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
      {/* Front — text + its own speaker */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
        }}>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: '700',
            color: SV_ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {LANG_LABEL[card.frontLang]}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                aria-label="Delete card"
                style={{
                  background: 'var(--danger-soft)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            )}
            <Speaker text={card.front} lang={card.frontLang} />
          </div>
        </div>

        <p style={{
          fontSize: card.front.length > 60 ? '1.4rem' : '1.7rem',
          fontWeight: '700',
          lineHeight: '1.4',
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {card.front}
        </p>
      </div>

      {/* Back — revealed on flip: translation + examples, each with audio */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: SV_SOFT,
            borderRadius: 'var(--radius)',
            padding: '22px 20px',
            border: `1px solid ${SV_BORDER}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Back word/phrase */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                color: SV_ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {LANG_LABEL[card.backLang]}
              </span>
              <Speaker text={card.back} lang={card.backLang} />
            </div>
            <p style={{
              margin: 0,
              fontSize: card.back.length > 60 ? '1.3rem' : '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              lineHeight: '1.4',
            }}>
              {card.back}
            </p>
          </div>

          {/* Examples — always on the back, in the back language, each playable */}
          {card.examples && card.examples.length > 0 && (
            <div style={{
              borderTop: `1px solid ${SV_BORDER}`,
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: '700',
                color: SV_ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Examples
              </span>

              {card.examples.map((ex, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Speaker text={ex.text} lang={card.backLang} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.98rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5',
                    }}>
                      {ex.text}
                    </p>
                    {ex.translation && (
                      <p style={{
                        margin: '3px 0 0 0',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.45',
                      }}>
                        {ex.translation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
