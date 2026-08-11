import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CardState } from '../utils/sm2';
import type { SwedishCard } from '../utils/sm2';
import { playTTS } from '../lib/tts';

/**
 * Chapter review — a read-only sheet of everything a chapter taught.
 *
 * Deliberately NOT a study mode. Nothing here rates a card, touches the
 * schedule, or spends the daily budget: skimming is recognition, and
 * recognition is the weaker cousin of the retrieval practice the SRS gives you.
 * If this ever started counting as "studying" it would quietly replace the part
 * that actually builds memory.
 *
 * What it is good for is the thing the SRS cannot do: seeing a unit whole.
 * Before class, after class, or on a walk with "Play all" running.
 */

interface Props {
  cards: SwedishCard[];
  onClose: () => void;
}

type Sort = 'weakest' | 'order';

/**
 * How much a card needs attention.
 *
 * `ease_factor` is the only weakness signal that is actually populated — Good is
 * a zero ease-delta in this SM-2, so anything below 2.5 has taken a Hard or an
 * Again at some point, and mastery_level/lapses only began recording on
 * 2026-08-06. Unseen cards sort to the very top: not knowing a word at all
 * beats knowing it badly.
 */
function attention(c: SwedishCard): number {
  if (c.state === CardState.NEW) return -1;
  return c.easeFactor + Math.min(c.interval, 365) / 500;
}

export default function ChapterReview({ cards, onClose }: Props) {
  const chapters = useMemo(() => {
    const seen = new Map<string, number>();
    for (const c of cards) {
      const k = c.chapter ?? 'Övrigt';
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    return [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0], 'sv'));
  }, [cards]);

  const [chapter, setChapter] = useState<string>(() => chapters[chapters.length - 1]?.[0] ?? 'Övrigt');
  const [sort, setSort] = useState<Sort>('weakest');
  const [playing, setPlaying] = useState(false);
  const stop = useRef(false);

  const list = useMemo(() => {
    const inChapter = cards.filter(c => (c.chapter ?? 'Övrigt') === chapter);
    return sort === 'weakest'
      ? [...inChapter].sort((a, b) => attention(a) - attention(b))
      : [...inChapter].sort((a, b) => a.createdAt - b.createdAt);
  }, [cards, chapter, sort]);

  const notStarted = list.filter(c => c.state === CardState.NEW).length;

  // Play every Swedish line in turn. Sequential, interruptible, and it never
  // records anything — this is a listening pass, not a review.
  async function playAll() {
    if (playing) { stop.current = true; setPlaying(false); return; }
    setPlaying(true); stop.current = false;
    for (const c of list) {
      if (stop.current) break;
      try { await playTTS(c.back, 'sv'); } catch { /* skip a line rather than abort the run */ }
      await new Promise(r => setTimeout(r, 350));
    }
    setPlaying(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '14px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Repetera</span>
        </h2>
        <button onClick={() => { stop.current = true; onClose(); }} className="pressable glass" aria-label="Close chapter review"
          style={{ width: '36px', height: '36px', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {/* Chapter picker */}
      <div style={{ display: 'flex', gap: '7px', padding: '0 16px 10px', overflowX: 'auto', flexShrink: 0 }}>
        {chapters.map(([name, n]) => (
          <button key={name} onClick={() => { stop.current = true; setPlaying(false); setChapter(name); }}
            className="pressable glass"
            style={{
              flexShrink: 0, padding: '8px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
              border: name === chapter ? 'none' : '1px solid var(--border)',
              background: name === chapter ? 'var(--grad-sv)' : 'transparent',
              color: name === chapter ? 'var(--cta-ink-sv)' : 'var(--text-secondary)',
            }}>
            {name} <span style={{ opacity: 0.7, fontWeight: 600 }}>{n}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px', alignItems: 'center', flexShrink: 0 }}>
        <button onClick={() => setSort(s => s === 'weakest' ? 'order' : 'weakest')}
          className="pressable glass"
          style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'transparent' }}>
          {sort === 'weakest' ? '↓ Weakest first' : '↓ Deck order'}
        </button>
        <button onClick={playAll} className="pressable"
          style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700, border: 'none',
                   background: playing ? 'var(--danger)' : 'var(--grad-sv)', color: playing ? '#fff' : 'var(--cta-ink-sv)' }}>
          {playing ? '■ Stop' : '▶ Play all'}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {list.length} words{notStarted > 0 ? ` · ${notStarted} not met yet` : ''}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.map(c => (
            <div key={c.id} className="glass"
              onClick={() => playTTS(c.back, 'sv')}
              style={{ borderRadius: 'var(--radius-sm)', padding: '11px 14px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.4 }}>{c.back}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{c.front}</p>
              </div>
              {c.state === CardState.NEW && (
                <span style={{ flexShrink: 0, fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-sv)', opacity: 0.75 }}>new</span>
              )}
            </div>
          ))}
          {list.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>
              Nothing tagged with this chapter yet.
            </p>
          )}
          <p style={{ margin: '14px 0 0 0', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Reading here doesn't count as studying and doesn't change your schedule —
            it's a refresher, not a review.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
