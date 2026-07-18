import { motion } from 'framer-motion';
import type { Lang } from '../utils/sm2';

interface Props {
  active: Lang;
  onChange: (lang: Lang) => void;
}

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: 'en', label: 'English' },
  { lang: 'sv', label: 'Svenska' },
];

// Small segmented EN | SV control. The single entry point between the two
// language sections — selecting one swaps the whole deck/session.
export default function LanguageSwitcher({ active, onChange }: Props) {
  return (
    <div className="glass" style={{
      display: 'inline-flex',
      borderRadius: '999px',
      padding: '4px',
      gap: '2px',
      position: 'relative',
    }}>
      {OPTIONS.map(opt => {
        const isActive = opt.lang === active;
        return (
          <button
            key={opt.lang}
            onClick={() => !isActive && onChange(opt.lang)}
            className="pressable"
            style={{
              position: 'relative',
              padding: '7px 18px',
              borderRadius: '999px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              cursor: isActive ? 'default' : 'pointer',
              background: 'transparent',
              color: isActive ? '#fff' : 'var(--text-muted)',
              transition: 'color 0.2s ease',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="lang-thumb"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '999px',
                  background: opt.lang === 'sv' ? 'var(--grad-sv)' : 'var(--grad-en)',
                  boxShadow: `0 4px 14px ${opt.lang === 'sv' ? 'var(--glow-sv)' : 'var(--glow-en)'}`,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
