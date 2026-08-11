import { motion } from 'framer-motion';
import { CardState } from '../utils/sm2';
import type { SwedishCard, Lang } from '../utils/sm2';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface Props {
  cards: SwedishCard[];
  onStartStudy: () => void;
  hasActiveSession?: boolean;
  activeLanguage: Lang;
  onSwitchLanguage: (lang: Lang) => void;
  onOpenReference?: () => void;
  onOpenGrammar?: () => void;
  onOpenProgress?: () => void;
  onOpenAccount?: () => void;
  showSwitcher?: boolean;
  /** New cards that may still be introduced today (governor output). */
  newBudget?: number;
  /** Distinct cards already studied today. */
  studiedToday?: number;
  /** The day's target — what a full day looks like. */
  dailyTarget?: number;
}

/**
 * Reviews falling due on each of the next `days` days.
 *
 * This is the honest replacement for the old display cap. A cap said "this is all
 * you have to do" and was false; the strip says "this is what is actually coming"
 * and is true — every nextReviewDate is already known, so nothing is estimated.
 */
function forecast(cards: SwedishCard[], days = 7): number[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const out = new Array(days).fill(0);
  for (const c of cards) {
    if (c.state === CardState.NEW) continue;
    const d = Math.floor((c.nextReviewDate - start.getTime()) / 86_400_000);
    if (d >= 0 && d < days) out[d]++;
    else if (d < 0) out[0]++;   // already due — lands on today
  }
  return out;
}

interface Tier {
  label: string;
  count: number;
  color: string;
}

function classify(cards: SwedishCard[]): Tier[] {
  const counts = [0, 0, 0, 0, 0];
  cards.forEach(card => {
    switch (card.state) {
      case CardState.NEW: counts[0]++; break;
      case CardState.LEARNING:
      case CardState.RELEARNING: counts[1]++; break;
      case CardState.REVIEW:
        if (card.interval <= 7) counts[2]++;
        else if (card.interval <= 30) counts[3]++;
        else counts[4]++;
        break;
    }
  });
  return [
    { label: 'New', count: counts[0], color: '#a8a29e' },
    { label: 'Learning', count: counts[1], color: '#f59e0b' },
    { label: 'Young', count: counts[2], color: '#f97316' },
    { label: 'Maturing', count: counts[3], color: '#8b5cf6' },
    { label: 'Mature', count: counts[4], color: '#10b981' },
  ];
}

export default function SwedishDashboard({
  cards, onStartStudy, hasActiveSession, activeLanguage, onSwitchLanguage, onOpenReference, onOpenGrammar, onOpenProgress,
  onOpenAccount, showSwitcher = true, newBudget = 0, studiedToday = 0, dailyTarget = 50,
}: Props) {
  const totalCards = cards.length;
  const now = Date.now();
  // Today's workload — NOT the lifetime backlog. Unseen cards are not "due";
  // they arrive via the governor, so the number is something you can finish.
  const reviewsDue = cards.filter(c => c.state !== CardState.NEW && c.nextReviewDate <= now).length;
  const notStarted = cards.filter(c => c.state === CardState.NEW).length;
  const newToday = Math.min(newBudget, notStarted);
  // THE REAL NUMBER. No min(), no ceiling, nothing held back — the schedule
  // itself was rebuilt so that the truth is a finishable number (2026-08-11).
  const dueCount = reviewsDue + newToday;
  const started = totalCards - notStarted;
  const next7 = forecast(cards, 7);
  const hasDue = dueCount > 0;
  const canStudy = hasDue || hasActiveSession;
  const tiers = classify(cards);
  const maxCount = Math.max(...tiers.map(t => t.count), 1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '26px',
      width: '100%',
      height: '100dvh',
      overflowY: 'auto',
    }}>
      {/* Control strip — language (author only), theme, account */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showSwitcher && <LanguageSwitcher active={activeLanguage} onChange={onSwitchLanguage} />}
        <ThemeToggle />
        {onOpenProgress && (
          <button
            onClick={onOpenProgress}
            className="pressable glass"
            aria-label="Progress"
            style={{ width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'transparent' }}
          >
            ◔
          </button>
        )}
        {onOpenAccount && (
          <button
            onClick={onOpenAccount}
            className="pressable glass"
            aria-label="Account"
            style={{ width: '36px', height: '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)', background: 'transparent' }}
          >
            ⚙
          </button>
        )}
      </div>

      {/* Hero — the number that matters today */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center' }}
      >
        <h1 className="tabular" style={{
          fontSize: 'clamp(3.4rem, 16vw, 4.6rem)',
          fontWeight: 800,
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          background: 'var(--grad-sv)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {dueCount}
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.01em' }}>
          {dueCount === 0
            ? studiedToday > 0 ? `done today · ${studiedToday} studied` : 'all done today · Svenska'
            : reviewsDue === 0
              ? `today · ${newToday} new ${newToday === 1 ? 'word' : 'words'}`
              : `today · ${reviewsDue} ${reviewsDue === 1 ? 'review' : 'reviews'}${newToday > 0 ? ` + ${newToday} new` : ''}`}
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {totalCards} words · {started} started · {notStarted} to meet
        </p>
      </motion.div>

      {/* Next 7 days — the honest replacement for a display cap. Shows there is
          no wall behind today's number. */}
      <div className="glass" style={{ width: '100%', maxWidth: '380px', borderRadius: 'var(--radius)', padding: '14px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>
            Next 7 days
          </span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            target {dailyTarget}/day
          </span>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '46px' }}>
          {next7.map((n, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span className="tabular" style={{ fontSize: '0.6rem', fontWeight: 700, color: n > dailyTarget ? 'var(--danger)' : 'var(--text-muted)' }}>{n}</span>
              <div style={{
                width: '100%',
                height: `${Math.max(3, Math.min(1, n / dailyTarget) * 26)}px`,
                borderRadius: '3px 3px 1px 1px',
                background: n > dailyTarget ? 'var(--danger)' : 'var(--grad-sv)',
                opacity: i === 0 ? 1 : 0.45,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* State breakdown */}
      <div className="glass" style={{
        width: '100%',
        maxWidth: '380px',
        borderRadius: 'var(--radius)',
        padding: '22px 16px 16px',
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '108px' }}>
          {tiers.map((t, i) => {
            const fillH = Math.max((t.count / maxCount) * 88, t.count > 0 ? 18 : 4);
            return (
              <div key={t.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '7px' }}>
                <span className="tabular" style={{ fontSize: t.count >= 1000 ? '0.72rem' : '0.95rem', fontWeight: 800, letterSpacing: '-0.02em', color: t.count > 0 ? t.color : 'var(--text-muted)', opacity: t.count > 0 ? 1 : 0.35 }}>
                  {t.count}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: fillH }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: '100%',
                    background: `linear-gradient(to top, ${t.color}0a, ${t.color}30)`,
                    borderTop: t.count > 0 ? `2px solid ${t.color}` : '2px solid transparent',
                    borderRadius: '7px 7px 3px 3px',
                    boxShadow: t.count > 0 ? `0 -6px 18px -6px ${t.color}55` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {tiers.map(t => (
            <span key={t.label} style={{ flex: 1, textAlign: 'center', fontSize: '0.55rem', fontWeight: 700, color: t.count > 0 ? t.color : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: t.count > 0 ? 0.9 : 0.35 }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Session-in-progress pill */}
      {hasActiveSession && (
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-sv)', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-sv)' }}>
            Session in progress
          </span>
        </div>
      )}

      {/* Action button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '380px' }}>
        <button
          onClick={onStartStudy}
          disabled={!canStudy}
          className="pressable"
          style={{
            padding: '18px',
            fontSize: '1rem',
            fontWeight: 700,
            background: canStudy ? 'var(--grad-sv)' : 'var(--card-bg)',
            color: canStudy ? 'var(--cta-ink-sv)' : 'var(--text-muted)',
            borderRadius: 'var(--radius)',
            boxShadow: canStudy ? '0 10px 30px -6px var(--glow-sv), 0 1px 0 rgba(255,255,255,0.25) inset' : 'none',
            opacity: canStudy ? 1 : 0.5,
            border: canStudy ? 'none' : '1px solid var(--border)',
            letterSpacing: '-0.01em',
          }}
        >
          {hasActiveSession
            ? 'Resume Session'
            : (dueCount > 0 ? `Study ${dueCount} ${dueCount === 1 ? 'Card' : 'Cards'}` : (totalCards === 0 ? 'No cards yet' : 'All Caught Up'))}
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {onOpenReference && (
            <button
              onClick={onOpenReference}
              className="pressable glass"
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              ⊞ Tables
            </button>
          )}
          {onOpenGrammar && (
            <button
              onClick={onOpenGrammar}
              className="pressable glass"
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                letterSpacing: '-0.01em',
              }}
            >
              § Grammatik
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
