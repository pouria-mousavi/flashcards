interface Props {
  budgetComplete: boolean;
  onBack: () => void;
}

export default function StudyBreak({ budgetComplete, onBack }: Props) {
  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem' }}>{budgetComplete ? "Today's 20 minutes are complete" : 'Time for a break'}</h1>
      <p style={{ maxWidth: 420, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {budgetComplete
          ? 'You can stop here. Your remaining cards will wait for your next study day.'
          : 'The next cards in this round are scheduled for later. Come back when you have time.'}
      </p>
      <button className="pressable glass" onClick={onBack} style={{ padding: '12px 24px', borderRadius: 'var(--radius)' }}>
        Back to deck
      </button>
    </div>
  );
}

export function StudyTimeRemaining({ remainingMs }: { remainingMs: number }) {
  const seconds = Math.ceil(remainingMs / 1000);
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <span title="Your shared 20-minute allowance for Swedish and English. Syncs between devices when connected. Pauses do not count."
      aria-label={`${time} remaining in today's shared study allowance`}>
      {time} today
    </span>
  );
}
