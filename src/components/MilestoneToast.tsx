import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  /** Bump this string to announce something new. Seen-state is keyed on it. */
  id: string;
  title: string;
  body: string;
  /** How long it stays before fading out on its own. */
  durationMs?: number;
}

const seenKey = (id: string) => `sv_milestone_seen:${id}`;

/**
 * A one-time announcement. Shows once per browser, slides up, auto-dismisses
 * after a few seconds, and can be dismissed by hand. Marked as seen the moment
 * it appears, so it never returns even if the user navigates away immediately.
 */
export default function MilestoneToast({ id, title, body, durationMs = 6000 }: Props) {
  const [show, setShow] = useState(false);

  // Decide once whether this announcement is still unseen, and mark it seen
  // immediately so it never returns — even if the user leaves straight away.
  useEffect(() => {
    let seen = true;
    try { seen = !!localStorage.getItem(seenKey(id)); } catch { /* private mode — just skip */ }
    if (seen) return;
    try { localStorage.setItem(seenKey(id), '1'); } catch { /* ignore */ }
    setShow(true);
  }, [id]);

  // Auto-dismiss lives in its own effect keyed on `show`. Keeping it separate
  // matters: under StrictMode the effect above runs twice, and the second pass
  // returns early (the flag is now set) — so a timer started up there would be
  // cleared by the first pass's cleanup and never rescheduled.
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [show, durationMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          onClick={() => setShow(false)}
          className="glass"
          style={{
            position: 'fixed',
            // Centred with auto margins, NOT translateX(-50%): framer-motion
            // animates `transform`, so a transform set here would be overwritten
            // and the toast would sit half a width off to the right.
            left: '16px',
            right: '16px',
            marginInline: 'auto',
            bottom: 'calc(22px + env(safe-area-inset-bottom, 0px))',
            zIndex: 200,
            maxWidth: '400px',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: 'var(--card-shadow), 0 12px 34px -10px var(--glow-sv)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1.25rem', lineHeight: 1.15, flexShrink: 0 }}>🎉</span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              background: 'var(--grad-sv)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {title}
            </p>
            <p style={{
              margin: '3px 0 0 0',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}>
              {body}
            </p>
          </div>

          <button
            onClick={e => { e.stopPropagation(); setShow(false); }}
            aria-label="Dismiss"
            className="pressable"
            style={{
              flexShrink: 0,
              width: '26px',
              height: '26px',
              borderRadius: '999px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
