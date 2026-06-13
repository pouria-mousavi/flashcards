import { motion } from 'framer-motion';
import { CardState } from '../utils/sm2';
import type { SwedishCard, Lang } from '../utils/sm2';
import LanguageSwitcher from './LanguageSwitcher';

interface Props {
  cards: SwedishCard[];
  onStartStudy: () => void;
  hasActiveSession?: boolean;
  activeLanguage: Lang;
  onSwitchLanguage: (lang: Lang) => void;
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
    { label: 'New', count: counts[0], color: '#a1a1aa' },
    { label: 'Learning', count: counts[1], color: '#f59e0b' },
    { label: 'Young', count: counts[2], color: '#60a5fa' },
    { label: 'Maturing', count: counts[3], color: '#3b82f6' },
    { label: 'Mature', count: counts[4], color: '#10b981' },
  ];
}

export default function SwedishDashboard({
  cards, onStartStudy, hasActiveSession, activeLanguage, onSwitchLanguage,
}: Props) {
  const totalCards = cards.length;
  const now = Date.now();
  const dueCount = cards.filter(c => c.nextReviewDate <= now).length;
  const hasDue = dueCount > 0;
  const tiers = classify(cards);
  const maxCount = Math.max(...tiers.map(t => t.count), 1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '28px',
      width: '100%',
      height: '100dvh',
      overflowY: 'auto',
      background: 'var(--bg-color)',
    }}>
      {/* Language switcher — entry point between the two sections */}
      <LanguageSwitcher active={activeLanguage} onChange={onSwitchLanguage} />

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Svenska
        </h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          {totalCards} {totalCards === 1 ? 'card' : 'cards'} total
        </p>
      </div>

      {/* Simple state breakdown */}
      <div style={{
        width: '100%',
        maxWidth: '360px',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        padding: '20px 14px 16px',
        border: '1px solid var(--border)',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.12)',
      }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '110px' }}>
          {tiers.map((t, i) => {
            const fillH = Math.max((t.count / maxCount) * 92, t.count > 0 ? 20 : 4);
            return (
              <div key={t.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '6px' }}>
                <span style={{ fontSize: t.count >= 1000 ? '0.75rem' : '1rem', fontWeight: '800', color: t.count > 0 ? t.color : 'var(--text-muted)', opacity: t.count > 0 ? 1 : 0.4 }}>
                  {t.count}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: fillH }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', background: t.count > 0 ? `${t.color}22` : 'rgba(0,0,0,0.2)', borderTop: t.count > 0 ? `2px solid ${t.color}` : 'none', borderRadius: '4px 4px 2px 2px' }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
          {tiers.map(t => (
            <span key={t.label} style={{ flex: 1, textAlign: 'center', fontSize: '0.55rem', fontWeight: '600', color: t.count > 0 ? t.color : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em', opacity: t.count > 0 ? 0.85 : 0.4 }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Due badge */}
      {(hasDue || hasActiveSession) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(96, 165, 250, 0.12)', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#60a5fa' }}>
            {hasActiveSession ? 'Session in progress' : `${dueCount} due for review`}
          </span>
        </div>
      )}

      {/* Action button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
        <button
          onClick={onStartStudy}
          disabled={!hasDue && !hasActiveSession}
          style={{
            padding: '18px',
            fontSize: '1rem',
            fontWeight: '700',
            background: (hasDue || hasActiveSession) ? '#3b82f6' : 'var(--card-bg)',
            color: (hasDue || hasActiveSession) ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius)',
            boxShadow: (hasDue || hasActiveSession) ? '0 8px 24px rgba(59, 130, 246, 0.3)' : 'none',
            opacity: (!hasDue && !hasActiveSession) ? 0.5 : 1,
            transition: 'all 0.2s ease',
            border: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          {hasActiveSession
            ? 'Resume Session'
            : (dueCount > 0 ? `Study ${Math.min(dueCount, 50)} Cards` : (totalCards === 0 ? 'No cards yet' : 'All Caught Up'))}
        </button>
      </div>
    </div>
  );
}
