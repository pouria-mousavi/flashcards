import type { CSSProperties } from 'react';
import { Volume2 } from 'lucide-react';
import { playTTS } from '../lib/tts';
import type { SwedishCard, SwedishExample, SwedishWordForms, Lang } from '../utils/sm2';

// Swedish accent — distinct from English indigo so the two decks feel separate.
const SV_ACCENT = 'var(--accent-sv)';
const SV_BORDER = 'var(--accent-sv-border)';

const LANG_LABEL: Record<Lang, string> = { sv: 'Svenska', en: 'English' };

// Small round speaker button — plays the given text in its own language.
function Speaker({ text, lang, emphasis }: { text: string; lang: Lang; size?: number; emphasis?: string }) {
  return <button className="calm-speak" onClick={e => { e.stopPropagation(); playTTS(text, lang, emphasis); }} aria-label={`Play ${LANG_LABEL[lang]} audio`}><Volume2 size={17} strokeWidth={1.6} /></button>;
}

// The one-line "which family does this word belong to" answer, shown as a badge
// so it can be recalled and self-checked like any other part of the card.
const VERB_RULE: Record<number, string> = {
  1: 'stem ends in -a · past -ade',
  2: 'stem ends in a consonant · past -de / -te',
  3: 'one syllable, stressed vowel · past -dde',
  4: 'strong — the vowel changes, memorise it',
};
const DECLENSION_RULE: Record<string, string> = {
  '1': 'plural -or  (en-words ending in -a)',
  '2': 'plural -ar',
  '3': 'plural -er / -r',
  '4': 'plural -n  (ett-words ending in a vowel)',
  '5': 'plural unchanged',
  'irregular': 'vowel change in the plural',
  'special': 'uncountable — no plural',
};

function GroupBadge({ forms }: { forms: SwedishWordForms }) {
  let label: string | null = null;
  let rule: string | null = null;

  if (forms.pos === 'verb' && forms.group) {
    label = `Verb · grupp ${forms.group}${forms.irregular ? ' (irregular)' : ''}`;
    rule = VERB_RULE[forms.group] ?? null;
  } else if (forms.pos === 'noun' && forms.declension) {
    const d = forms.declension;
    label = `Noun · ${/^[0-9]$/.test(d) ? `deklination ${d}` : d}${forms.gender ? ` · ${forms.gender}-word` : ''}`;
    rule = DECLENSION_RULE[d] ?? null;
  } else if (forms.pos === 'adjective' && forms.pattern) {
    label = `Adjective · ${forms.pattern}`;
    rule = 'en-form / ett-form + t / plural + a';
  }
  if (!label) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      alignSelf: 'flex-start',
      padding: '7px 12px',
      borderRadius: '999px',
      background: 'var(--accent-sv-soft)',
      border: `1px solid ${SV_BORDER}`,
    }}>
      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: SV_ACCENT, letterSpacing: '-0.01em' }}>{label}</span>
      {rule && <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 500 }}>{rule}</span>}
    </div>
  );
}

// Inflection table for Swedish verb / noun / adjective cards. Builds the rows
// for the card's part of speech; each Swedish form is individually playable.
function WordForms({ forms, lang }: { forms: SwedishWordForms; lang: Lang }) {
  const rows: { label: string; display: string; speak: string }[] = [];
  let heading = 'Forms';

  if (forms.pos === 'noun') {
    heading = 'Forms';
    if (forms.indefinite) rows.push({ label: 'Indefinite', display: forms.indefinite, speak: forms.indefinite });
    if (forms.definite) rows.push({ label: 'Definite', display: forms.definite, speak: forms.definite });
    if (forms.pluralIndefinite) rows.push({ label: 'Plural', display: forms.pluralIndefinite, speak: forms.pluralIndefinite });
    if (forms.pluralDefinite) rows.push({ label: 'Plural def.', display: forms.pluralDefinite, speak: forms.pluralDefinite });
  } else if (forms.pos === 'adjective') {
    heading = 'Forms';
    if (forms.base) rows.push({ label: 'En-form', display: forms.base, speak: forms.base });
    if (forms.neuter) rows.push({ label: 'Ett-form', display: forms.neuter, speak: forms.neuter });
    if (forms.plural) rows.push({ label: 'Plural / def.', display: forms.plural, speak: forms.plural });
    if (forms.comparative) rows.push({ label: 'Comparative', display: forms.comparative, speak: forms.comparative });
    if (forms.superlative) rows.push({ label: 'Superlative', display: forms.superlative, speak: forms.superlative });
  } else {
    // verb (default)
    heading = 'Forms';
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
          <GroupBadge forms={forms} />
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

function ExampleRow({ example, lang }: { example: SwedishExample; lang: Lang }) {
  return <div className="calm-example-row"><Speaker text={example.text} lang={lang} emphasis={example.emphasis} /><div><p lang={lang}>{example.text}</p>{example.translation && <p className="calm-translation">{example.translation}</p>}{example.source && <small className="calm-source">Source: {example.source}</small>}</div></div>;
}

export default function SwedishCardView({ card, isFlipped, onFlip, onDelete }: Props) {
  const notes = (card.examples ?? []).filter(example => example.kind === 'note');
  const examples = (card.examples ?? []).filter(example => example.kind !== 'note');
  const isGap = /_{2,}|\[…\]/.test(card.front);
  const hintStart = isGap ? card.front.lastIndexOf('\n(') : -1;
  return (
    <article className="calm-card">
      <section className="calm-card-cue">
        <div className="calm-card-label"><span>{isGap ? 'Fill in the gap' : card.backLang === 'sv' ? 'Say it in Swedish' : 'What does it mean?'}</span>{!isGap && <Speaker text={card.front} lang={card.frontLang} />}</div>
        <button className="calm-prompt" onClick={onFlip} disabled={isFlipped} aria-label={isFlipped ? undefined : `Reveal answer: ${card.front}`} lang={card.frontLang}>
          {hintStart < 0 ? card.front : <>{card.front.slice(0, hintStart)}<span className="calm-prompt-hint" lang="en">{card.front.slice(hintStart + 1)}</span></>}
        </button>
        {!isFlipped && <p className="calm-card-nudge">Try it aloud. It’s okay to take your time.</p>}
      </section>
      {isFlipped && <section className="calm-card-answer" aria-label="Answer">
        <div className="calm-card-label"><span>{LANG_LABEL[card.backLang]}</span><Speaker text={card.back} lang={card.backLang} /></div>
        <p className="calm-answer-text" lang={card.backLang}>{card.back}</p>
        {examples[0] && <div className="calm-example"><p className="calm-example-label">In everyday life</p><ExampleRow example={examples[0]} lang={card.backLang} /></div>}
        {examples.length > 1 && <details><summary>More examples</summary>{examples.slice(1).map((example, i) => <ExampleRow key={i} example={example} lang={card.backLang} />)}</details>}
        {(notes.length > 0 || card.wordForms) && <details><summary>A little help</summary>
          {notes.map((note, index) => <div key={index}><p>{note.text}</p>{note.source && <small className="calm-source">Source: {note.source}</small>}</div>)}
          {card.wordForms && <WordForms forms={card.wordForms} lang={card.backLang} />}
          <p>The example and word forms are here to help. Only rate what the prompt asks.</p>
        </details>}
      </section>}
      {isFlipped && onDelete && <details className="calm-card-options"><summary>Card options</summary><button onClick={onDelete}>Delete this card</button></details>}
    </article>
  );
}
