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
    <div style={{
      display: 'inline-flex',
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: '999px',
      padding: '3px',
      gap: '2px',
    }}>
      {OPTIONS.map(opt => {
        const isActive = opt.lang === active;
        return (
          <button
            key={opt.lang}
            onClick={() => !isActive && onChange(opt.lang)}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              cursor: isActive ? 'default' : 'pointer',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
