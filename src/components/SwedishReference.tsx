import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTTS } from '../lib/tts';
import type { SwedishCard } from '../utils/sm2';

interface Props {
  cards: SwedishCard[];
  onClose: () => void;
}

type Tab = 'verbs' | 'nouns' | 'adjectives';

/* ------------------------------------------------------------------ */
/* Group pedagogy — the rule text shown above each section            */
/* ------------------------------------------------------------------ */

const VERB_GROUPS: Record<string, { title: string; rule: string }> = {
  '1': {
    title: 'Group 1 · -ar',
    rule: 'The stem ends in -a, which stays in every form: present -ar, past -ade, supine -at. The biggest and most regular group — most new verbs (fika, jobba, chatta) land here.',
  },
  '2': {
    title: 'Group 2 · -er',
    rule: 'The stem ends in a consonant: present -er. Past is -de (ringa → ringde) or -te after a voiceless consonant like k, p, s, t (köpa → köpte). Supine -t.',
  },
  '3': {
    title: 'Group 3 · -r',
    rule: 'Short verbs ending in a stressed vowel: present just adds -r, past -dde, supine -tt (bo → bor, bodde, bott; tro → trodde, trott).',
  },
  '4': {
    title: 'Group 4 · strong / irregular',
    rule: 'The vowel changes in the past instead of an ending (dricka → drack, springa → sprang). Supine usually ends in -it (druckit, sprungit). These must be memorised — the table below is your friend.',
  },
  other: {
    title: 'Ungrouped',
    rule: 'Verbs without a recorded conjugation group — usually deponents (ends in -s: hoppas, ses, trivs) or special verbs (vara, ha, måste).',
  },
};

const NOUN_GROUPS: Record<string, { title: string; rule: string }> = {
  en: {
    title: 'en-words (utrum)',
    rule: 'About 75% of nouns. Definite form adds -en/-n (bok → boken). Plurals follow the vowel: words in -a drop it for -or (gurka → gurkor), many take -ar (bil → bilar), stressed last syllables take -er (citron → citroner).',
  },
  ett: {
    title: 'ett-words (neutrum)',
    rule: 'Definite form adds -et/-t (hus → huset, äpple → äpplet). Plural: vowel-final words add -n (äpple → äpplen), consonant-final words don’t change at all (ett hus → många hus).',
  },
};

const ADJ_RULE = 'One adjective, three shapes: the en-form (en stor bil), the ett-form adds -t (ett stort hus), the plural/definite adds -a (stora bilar). Comparative -are, superlative -ast where they exist.';

/* ------------------------------------------------------------------ */

const cell: React.CSSProperties = {
  padding: '10px 10px',
  fontSize: '0.86rem',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};
const headCell: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: '0.6rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--text-muted)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

function Speakable({ text, strong }: { text?: string; strong?: boolean }) {
  if (!text) return <td style={{ ...cell, color: 'var(--text-muted)', cursor: 'default' }}>—</td>;
  return (
    <td
      style={{ ...cell, fontWeight: strong ? 700 : 500 }}
      onClick={() => playTTS(text.replace(/^(att|har) /, '').replace(/!$/, ''), 'sv')}
    >
      {text}
    </td>
  );
}

function SectionHeader({ title, rule, count }: { title: string; rule: string; count: number }) {
  return (
    <div style={{ padding: '22px 4px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--accent-sv)' }}>
          {title}
        </h3>
        <span className="tabular" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>{count}</span>
      </div>
      <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--text-secondary)', maxWidth: '640px' }}>
        {rule}
      </p>
    </div>
  );
}

function Table({ headers, children, minWidth }: { headers: string[]; children: React.ReactNode; minWidth: number }) {
  return (
    <div className="glass" style={{ borderRadius: 'var(--radius)', overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: `${minWidth}px` }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {headers.map(h => <th key={h} style={headCell}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const rowStyle: React.CSSProperties = { borderBottom: '1px solid var(--border)' };

/* ------------------------------------------------------------------ */

export default function SwedishReference({ cards, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('verbs');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const verbs = useMemo(() =>
    cards
      .filter(c => c.wordForms?.pos === 'verb' && c.wordForms.infinitive)
      .map(c => c.wordForms!)
      .filter((f, i, arr) => arr.findIndex(x => x.infinitive === f.infinitive) === i)
      .sort((a, b) => (a.infinitive || '').localeCompare(b.infinitive || '', 'sv')),
    [cards]);

  const nouns = useMemo(() =>
    cards
      .filter(c => c.wordForms?.pos === 'noun' && c.wordForms.indefinite)
      .map(c => c.wordForms!)
      .filter((f, i, arr) => arr.findIndex(x => x.indefinite === f.indefinite) === i)
      .sort((a, b) => (a.indefinite || '').replace(/^(en|ett) /, '').localeCompare((b.indefinite || '').replace(/^(en|ett) /, ''), 'sv')),
    [cards]);

  const adjectives = useMemo(() =>
    cards
      .filter(c => c.wordForms?.pos === 'adjective' && c.wordForms.base)
      .map(c => c.wordForms!)
      .filter((f, i, arr) => arr.findIndex(x => x.base === f.base) === i)
      .sort((a, b) => (a.base || '').localeCompare(b.base || '', 'sv')),
    [cards]);

  const matches = (...vals: (string | undefined)[]) =>
    !q || vals.some(v => v && v.toLowerCase().includes(q));

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'verbs', label: 'Verbs', count: verbs.length },
    { id: 'nouns', label: 'Nouns', count: nouns.length },
    { id: 'adjectives', label: 'Adjectives', count: adjectives.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg-color)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span style={{
              background: 'var(--grad-sv)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Grammar tables</span>
          </h2>
          <button
            onClick={onClose}
            className="pressable glass"
            aria-label="Close tables"
            style={{ width: '36px', height: '36px', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Tabs + search */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="glass" style={{ display: 'inline-flex', borderRadius: '999px', padding: '4px', gap: '2px' }}>
            {TABS.map(t => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="pressable"
                  style={{
                    position: 'relative',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: 'transparent',
                    color: active ? 'var(--cta-ink-sv)' : 'var(--text-muted)',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="ref-tab-thumb"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: 'var(--grad-sv)' }}
                    />
                  )}
                  <span className="tabular" style={{ position: 'relative', zIndex: 1 }}>
                    {t.label} · {t.count}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search any form…"
            className="glass"
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '9px 14px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {tab === 'verbs' && ['1', '2', '3', '4', 'other'].map(g => {
                const group = verbs.filter(v =>
                  (g === 'other' ? !v.group || !VERB_GROUPS[String(v.group)] : String(v.group) === g) &&
                  matches(v.infinitive, v.present, v.past, v.supine, v.imperative));
                if (group.length === 0) return null;
                return (
                  <div key={g}>
                    <SectionHeader title={VERB_GROUPS[g].title} rule={VERB_GROUPS[g].rule} count={group.length} />
                    <Table headers={['Infinitive', 'Present', 'Past', 'Supine', 'Imperative']} minWidth={560}>
                      {group.map(v => (
                        <tr key={v.infinitive} style={rowStyle}>
                          <Speakable text={`att ${v.infinitive}`} strong />
                          <Speakable text={v.present} />
                          <Speakable text={v.past} />
                          <Speakable text={v.supine ? `har ${v.supine}` : undefined} />
                          <Speakable text={v.imperative && v.imperative !== '—' ? `${v.imperative}!` : undefined} />
                        </tr>
                      ))}
                    </Table>
                  </div>
                );
              })}

              {tab === 'nouns' && ['en', 'ett'].map(g => {
                const group = nouns.filter(n =>
                  (n.gender || 'en') === g &&
                  matches(n.indefinite, n.definite, n.pluralIndefinite, n.pluralDefinite));
                if (group.length === 0) return null;
                return (
                  <div key={g}>
                    <SectionHeader title={NOUN_GROUPS[g].title} rule={NOUN_GROUPS[g].rule} count={group.length} />
                    <Table headers={['Indefinite', 'Definite', 'Plural', 'Plural def.']} minWidth={520}>
                      {group.map(n => (
                        <tr key={n.indefinite} style={rowStyle}>
                          <Speakable text={n.indefinite} strong />
                          <Speakable text={n.definite} />
                          <Speakable text={n.pluralIndefinite && n.pluralIndefinite !== '—' ? n.pluralIndefinite : undefined} />
                          <Speakable text={n.pluralDefinite && n.pluralDefinite !== '—' ? n.pluralDefinite : undefined} />
                        </tr>
                      ))}
                    </Table>
                  </div>
                );
              })}

              {tab === 'adjectives' && (() => {
                const group = adjectives.filter(a =>
                  matches(a.base, a.neuter, a.plural, a.comparative, a.superlative));
                if (group.length === 0) return null;
                return (
                  <div>
                    <SectionHeader title="Adjective forms" rule={ADJ_RULE} count={group.length} />
                    <Table headers={['En-form', 'Ett-form', 'Plural / def.', 'Comparative', 'Superlative']} minWidth={560}>
                      {group.map(a => (
                        <tr key={a.base} style={rowStyle}>
                          <Speakable text={a.base} strong />
                          <Speakable text={a.neuter} />
                          <Speakable text={a.plural} />
                          <Speakable text={a.comparative} />
                          <Speakable text={a.superlative} />
                        </tr>
                      ))}
                    </Table>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
