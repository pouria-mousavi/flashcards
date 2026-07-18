import { useEffect, useState } from 'react';

type Mode = 'auto' | 'light' | 'dark';
const KEY = 'theme_mode_v1';

// Auto rule: warm light through the day, dark from 15:00 and overnight.
function autoTheme(): 'light' | 'dark' {
  const h = new Date().getHours();
  return h >= 15 || h < 6 ? 'dark' : 'light';
}

function readMode(): Mode {
  const v = localStorage.getItem(KEY);
  return v === 'light' || v === 'dark' ? v : 'auto';
}

export function applyTheme(mode?: Mode) {
  const m = mode ?? readMode();
  const theme = m === 'auto' ? autoTheme() : m;
  document.documentElement.dataset.theme = theme;
}

// Apply immediately on import so the first paint has the right theme.
applyTheme();

const ICON: Record<Mode, string> = { auto: '◐', light: '☀︎', dark: '☾' };
const LABEL: Record<Mode, string> = {
  auto: 'Auto — light until 15:00, then dark',
  light: 'Always light',
  dark: 'Always dark',
};

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(readMode);

  // Keep auto mode honest as the clock crosses 15:00 / 06:00.
  useEffect(() => {
    applyTheme(mode);
    const tick = setInterval(() => applyTheme(mode), 60_000);
    const onVisible = () => { if (document.visibilityState === 'visible') applyTheme(mode); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(tick); document.removeEventListener('visibilitychange', onVisible); };
  }, [mode]);

  const cycle = () => {
    const next: Mode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
    localStorage.setItem(KEY, next);
    setMode(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={cycle}
      className="pressable glass"
      aria-label={LABEL[mode]}
      title={LABEL[mode]}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        background: 'transparent',
        position: 'relative',
      }}
    >
      {ICON[mode]}
      {mode !== 'auto' && (
        <span style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--accent)',
          border: '2px solid var(--bg-color)',
        }} />
      )}
    </button>
  );
}
