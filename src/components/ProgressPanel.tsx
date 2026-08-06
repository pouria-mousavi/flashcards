import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { SwedishCard } from '../utils/sm2';
import { fetchSessions, currentStreak, topicStats, masteryBreakdown } from '../lib/progress';
import type { DaySession } from '../lib/progress';

interface Props {
  cards: SwedishCard[];
  onClose: () => void;
  onOpenGrammar?: () => void;
}

const MASTERY_LABEL = ['Just met', 'Shaky', 'Getting there', 'Solid', 'Strong', 'Owned'];
const MASTERY_COLOR = ['#a8a29e', '#f59e0b', '#f97316', '#8b5cf6', '#10b981', '#059669'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ borderRadius: 'var(--radius)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>{title}</p>
      {children}
    </div>
  );
}

export default function ProgressPanel({ cards, onClose, onOpenGrammar }: Props) {
  const [sessions, setSessions] = useState<DaySession[] | null>(null);

  useEffect(() => { fetchSessions().then(setSessions); }, []);

  const streak = sessions ? currentStreak(sessions) : 0;
  const today = sessions?.find(s => s.studied_on === new Date().toISOString().slice(0, 10));
  const last7 = (sessions ?? []).slice(0, 7);
  const done7 = last7.reduce((s, d) => s + d.cards_done, 0);
  const corr7 = last7.reduce((s, d) => s + d.correct, 0);
  const acc7 = done7 ? Math.round((corr7 / done7) * 100) : null;

  const mastery = masteryBreakdown(cards);
  const masteredShare = Math.round((mastery.slice(3).reduce((a, b) => a + b, 0) / Math.max(1, mastery.reduce((a, b) => a + b, 0))) * 100);
  const weak = topicStats(cards).filter(t => t.weakness > 0.12).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Progress</span>
        </h2>
        <button onClick={onClose} className="pressable glass" aria-label="Close progress"
          style={{ width: '36px', height: '36px', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <Section title="Streak">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="tabular" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {streak}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {streak === 1 ? 'day in a row' : 'days in a row'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {today ? `Today: ${today.cards_done} cards, ${today.cards_done ? Math.round((today.correct / today.cards_done) * 100) : 0}% right.` : 'Nothing studied yet today.'}
              {acc7 !== null && ` Last 7 days: ${done7} cards at ${acc7}%.`}
            </p>
          </Section>

          <Section title="How much you actually own">
            <div style={{ display: 'flex', gap: '4px', height: '64px', alignItems: 'flex-end' }}>
              {mastery.map((n, i) => {
                const max = Math.max(...mastery, 1);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span className="tabular" style={{ fontSize: '0.7rem', fontWeight: 700, color: n ? MASTERY_COLOR[i] : 'var(--text-muted)' }}>{n}</span>
                    <div style={{ width: '100%', height: `${Math.max((n / max) * 40, n ? 6 : 2)}px`, borderRadius: '4px 4px 2px 2px', background: `linear-gradient(to top, ${MASTERY_COLOR[i]}18, ${MASTERY_COLOR[i]}55)`, borderTop: `2px solid ${n ? MASTERY_COLOR[i] : 'transparent'}` }} />
                    <span style={{ fontSize: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.15 }}>{MASTERY_LABEL[i]}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>{masteredShare}%</strong> of the cards you've started are Solid or better.
            </p>
          </Section>

          <Section title="Where you're losing time">
            {weak.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Nothing stands out — no topic is failing noticeably more than the rest.
              </p>
            ) : (
              <>
                {weak.map(t => (
                  <div key={t.topic} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 650, color: 'var(--text-primary)' }}>{t.topic}</span>
                      <span className="tabular" style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 700 }}>
                        {Math.round(t.weakness * 100)}% shaky
                      </span>
                    </div>
                    <div style={{ height: '5px', borderRadius: '999px', background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, t.weakness * 100)}%`, height: '100%', background: 'var(--grad-sv)' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {t.struggling} of {t.cards} cards · avg mastery {t.avgMastery}/5
                    </span>
                  </div>
                ))}
                {onOpenGrammar && (
                  <button onClick={onOpenGrammar} className="pressable"
                    style={{ marginTop: '4px', padding: '11px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', background: 'var(--grad-sv)', color: 'var(--cta-ink-sv)', border: 'none' }}>
                    § Read the grammar for these
                  </button>
                )}
              </>
            )}
          </Section>

        </div>
      </div>
    </motion.div>
  );
}
