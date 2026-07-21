import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTTS } from '../lib/tts';
import { SV_GRAMMAR } from '../data/svGrammar';
import type { GrammarLesson, CheatBlock } from '../data/svGrammar';

interface Props {
  onClose: () => void;
}

/* Tap any Swedish snippet to hear it. */
function Sv({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span
      onClick={() => playTTS(text.replace(/[!?.…]+$/, ''), 'sv')}
      style={{ cursor: 'pointer', ...style }}
    >
      {text}
    </span>
  );
}

function Block({ block }: { block: CheatBlock }) {
  if (block.kind === 'note') {
    return (
      <div style={{
        borderLeft: '3px solid var(--accent-sv)',
        background: 'var(--accent-sv-soft)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        padding: '12px 14px',
        fontSize: '0.85rem',
        lineHeight: 1.55,
        color: 'var(--text-secondary)',
      }}>
        {block.text}
      </div>
    );
  }

  if (block.kind === 'table') {
    return (
      <div>
        {block.title && <BlockTitle text={block.title} />}
        <div className="glass" style={{ borderRadius: 'var(--radius-sm)', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: `${Math.max(300, block.columns.length * 118)}px` }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {block.columns.map(c => (
                  <th key={c} style={{ padding: '8px 10px', fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < block.rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 10px', fontSize: '0.84rem', color: j === 0 ? 'var(--accent-sv)' : 'var(--text-primary)', fontWeight: j === 0 ? 700 : 500, whiteSpace: 'nowrap' }}>
                      {/[a-zåäö]/.test(cell) && j > 0 && !/[A-Z]{2}/.test(cell) ? <Sv text={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.kind === 'pattern') {
    return (
      <div>
        {block.title && <BlockTitle text={block.title} />}
        <div className="glass" style={{ borderRadius: 'var(--radius-sm)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {block.slots.map((slot, i) => (
              <span key={i} style={{
                padding: '7px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: i === 1 ? 'var(--grad-sv)' : 'var(--surface)',
                color: i === 1 ? 'var(--cta-ink-sv)' : 'var(--text-secondary)',
                border: i === 1 ? 'none' : '1px solid var(--border)',
              }}>
                {slot}
              </span>
            ))}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Sv text={block.example.sv} />
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{block.example.en}</p>
          </div>
        </div>
      </div>
    );
  }

  // pairs
  return (
    <div>
      {block.title && <BlockTitle text={block.title} />}
      <div className="glass" style={{ borderRadius: 'var(--radius-sm)', padding: '6px 14px' }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < block.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.45 }}>
              <Sv text={item.sv} />
            </p>
            {item.en && <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{item.en}</p>}
            {item.note && <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockTitle({ text }: { text: string }) {
  return (
    <p style={{ margin: '0 0 8px 2px', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>
      {text}
    </p>
  );
}

function LessonView({ lesson, onBack }: { lesson: GrammarLesson; onBack: () => void }) {
  const [showFull, setShowFull] = useState(false);
  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={onBack}
        className="pressable glass"
        style={{ color: 'var(--text-secondary)', padding: '7px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, background: 'transparent', marginBottom: '16px' }}
      >
        &#8592; All lessons
      </button>

      <p style={{ margin: '0 0 2px 0', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{lesson.tag}</p>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{lesson.title}</h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{lesson.hook}</p>

      {/* The cheat sheet */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lesson.cheat.map((b, i) => <Block key={i} block={b} />)}
      </div>

      {/* Expandable full lesson */}
      <button
        onClick={() => setShowFull(s => !s)}
        className="pressable"
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '13px',
          borderRadius: 'var(--radius-sm)',
          background: showFull ? 'var(--surface)' : 'var(--grad-sv)',
          color: showFull ? 'var(--text-secondary)' : 'var(--cta-ink-sv)',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: showFull ? '1px solid var(--border)' : 'none',
        }}
      >
        {showFull ? 'Hide the full lesson' : 'Read the full lesson'}
      </button>
      <AnimatePresence>
        {showFull && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.full.map((p, i) => (
                <p key={i} style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ height: '40px' }} />
    </motion.div>
  );
}

export default function SwedishGrammar({ onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const lesson = SV_GRAMMAR.find(l => l.id === openId) || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Grammatik
          </span>
        </h2>
        <button
          onClick={onClose}
          className="pressable glass"
          aria-label="Close grammar"
          style={{ width: '36px', height: '36px', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {lesson ? (
              <LessonView key="lesson" lesson={lesson} onBack={() => setOpenId(null)} />
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <p style={{ margin: '4px 0 8px 2px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Every rule from the book's FOKUS sections — as cheat sheets you can actually memorize.
                </p>
                {SV_GRAMMAR.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setOpenId(l.id)}
                    className="pressable glass"
                    style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'transparent', display: 'flex', flexDirection: 'column', gap: '3px' }}
                  >
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>{l.tag}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{l.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{l.hook}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
