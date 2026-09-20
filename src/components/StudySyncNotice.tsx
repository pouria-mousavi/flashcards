export default function StudySyncNotice({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  if (!message) return null;
  return <div role="status" className="glass" style={{ position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
    width: 'min(90vw, 440px)', padding: 12, borderRadius: 12, display: 'flex', gap: 12, background: 'var(--card-bg)', fontSize: '0.8rem' }}>
    <span>{message}</span><button onClick={onDismiss} aria-label="Dismiss sync message">×</button>
  </div>;
}
