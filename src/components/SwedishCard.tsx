import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { playTTS } from '../lib/tts';
import type { SwedishCard, SwedishWordForms, Lang } from '../utils/sm2';

// Swedish accent — distinct from English indigo so the two decks feel separate.
const SV_ACCENT = '#60a5fa';
const SV_SOFT = 'rgba(96, 165, 250, 0.10)';
const SV_BORDER = 'rgba(96, 165, 250, 0.28)';

const LANG_LABEL: Record<Lang, string> = { sv: 'Svenska', en: 'English' };

// Small round speaker button — plays the given text in its own language.
function Speaker({ text, lang, size = 32, emphasis }: { text: string; lang: Lang; size?: number; emphasis?: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); playTTS(text, lang, emphasis); }}
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

const GROUP_LABEL: Record<number, string> = {
  1: 'Group 1 (-ar)',
  2: 'Group 2 (-er)',
  3: 'Group 3 (-r)',
  4: 'Group 4 (strong)',
};

// Inflection table for Swedish verb / noun / adjective cards. Builds the rows
// for the card's part of speech; each Swedish form is individually playable.
function WordForms({ forms, lang }: { forms: SwedishWordForms; lang: Lang }) {
  const rows: { label: string; display: string; speak: string }[] = [];
  let heading = 'Forms';

  if (forms.pos === 'noun') {
    heading = `Noun forms${forms.gender ? ` · ${forms.gender}-word` : ''}`;
    if (forms.indefinite) rows.push({ label: 'Indefinite', display: forms.indefinite, speak: forms.indefinite });
    if (forms.definite) rows.push({ label: 'Definite', display: forms.definite, speak: forms.definite });
    if (forms.pluralIndefinite) rows.push({ label: 'Plural', display: forms.pluralIndefinite, speak: forms.pluralIndefinite });
    if (forms.pluralDefinite) rows.push({ label: 'Plural def.', display: forms.pluralDefinite, speak: forms.pluralDefinite });
  } else if (forms.pos === 'adjective') {
    heading = 'Adjective forms';
    if (forms.base) rows.push({ label: 'En-form', display: forms.base, speak: forms.base });
    if (forms.neuter) rows.push({ label: 'Ett-form', display: forms.neuter, speak: forms.neuter });
    if (forms.plural) rows.push({ label: 'Plural / def.', display: forms.plural, speak: forms.plural });
    if (forms.comparative) rows.push({ label: 'Comparative', display: forms.comparative, speak: forms.comparative });
    if (forms.superlative) rows.push({ label: 'Superlative', display: forms.superlative, speak: forms.superlative });
  } else {
    // verb (default)
    heading = `Verb forms${forms.group && GROUP_LABEL[forms.group] ? ` · ${GROUP_LABEL[forms.group]}` : ''}`;
    if (forms.infinitive) rows.push({ label: 'Infinitive', display: `att ${forms.infinitive}`, speak: forms.infinitive });
    if (forms.present) rows.push({ label: 'Present', display: forms.present, speak: forms.present });
    if (forms.past) rows.push({ label: 'Past', display: forms.past, speak: forms.past });
    if (forms.supine) rows.push({ label: 'Supine', display: `har ${forms.supine}`, speak: forms.supine });
    if (forms.imperative) rows.push({ label: 'Imperative', display: `${forms.imperative}!`, speak: forms.imperative });
  }

  const preps = forms.pos === 'verb' && forms.prepositions ? forms.prepositions : [];
  if (rows.length === 0 && preps.length === 0) return null;

  const sectionStyle: CSSProperties = {
    borderTop: `1px solid ${SV_BORDER}`,
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };
  const headingStyle: CSSProperties = {
    fontSize: '0.6rem',
    fontWeight: 700,
    color: SV_ACCENT,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <>
      {rows.length > 0 && (
        <div style={sectionStyle}>
          <span style={headingStyle}>{heading}</span>
          {rows.map((r) => (
            <div
              key={r.label}
              onClick={(e) => { e.stopPropagation(); playTTS(r.speak, lang); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '3px 0' }}
            >
              <span style={{
                flexShrink: 0,
                width: '92px',
                fontSize: '0.68rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}>
                {r.label}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {r.display}
              </span>
              <Speaker text={r.speak} lang={lang} size={26} />
            </div>
          ))}
        </div>
      )}

      {preps.length > 0 && (
        <div style={sectionStyle}>
          <span style={headingStyle}>
            Prepositions{preps.length > 1 ? ` (${preps.length})` : ''}
          </span>
          {preps.map((p, i) => (
            <div
              key={i}
              onClick={p.example ? (e) => { e.stopPropagation(); playTTS(p.example!, lang); } : undefined}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: p.example ? 'pointer' : 'default', padding: '3px 0' }}
            >
              <span style={{
                flexShrink: 0,
                minWidth: '40px',
                fontSize: '1rem',
                fontWeight: 700,
                color: SV_ACCENT,
              }}>
                {p.prep}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {p.example && (
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {p.example}
                  </p>
                )}
                {p.note && (
                  <p style={{ margin: p.example ? '2px 0 0 0' : 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {p.note}
                  </p>
                )}
              </div>
              {p.example && <Speaker text={p.example} lang={lang} size={26} />}
            </div>
          ))}
        </div>
      )}
    </>
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
            <p
              onClick={(e) => { e.stopPropagation(); playTTS(card.back, card.backLang); }}
              style={{
                margin: 0,
                fontSize: card.back.length > 60 ? '1.3rem' : '1.5rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.4',
                cursor: 'pointer',
              }}
            >
              {card.back}
            </p>
          </div>

          {/* Inflection table — only on Swedish verb / noun / adjective cards */}
          {card.wordForms && (
            <WordForms forms={card.wordForms} lang={card.backLang} />
          )}

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
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); playTTS(ex.text, card.backLang, ex.emphasis); }}
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}
                >
                  <Speaker text={ex.text} lang={card.backLang} size={28} emphasis={ex.emphasis} />
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
