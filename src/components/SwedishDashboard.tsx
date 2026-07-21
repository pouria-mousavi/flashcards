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
  cards, onStartStudy, hasActiveSession, activeLanguage, onSwitchLanguage, onOpenReference, onOpenGrammar,
}: Props) {
  const totalCards = cards.length;
  const now = Date.now();
  const dueCount = cards.filter(c => c.nextReviewDate <= now).length;
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
      {/* Language switcher + theme — the app's control strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LanguageSwitcher active={activeLanguage} onChange={onSwitchLanguage} />
        <ThemeToggle />
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
          due now · Svenska
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {totalCards} {totalCards === 1 ? 'card' : 'cards'} in the deck
        </p>
      </motion.div>

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
            : (dueCount > 0 ? `Study ${Math.min(dueCount, 50)} Cards` : (totalCards === 0 ? 'No cards yet' : 'All Caught Up'))}
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
