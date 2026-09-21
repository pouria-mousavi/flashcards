import { Sprout } from 'lucide-react';

interface Props {
  budgetComplete: boolean;
  onBack: () => void;
}

export default function StudyBreak({ budgetComplete, onBack }: Props) {
  return (
    <div className="calm-break">
      <Sprout size={40} strokeWidth={1.3} aria-hidden="true" />
      <h1 className="calm-title">{budgetComplete ? 'Let it settle.' : 'A little pause.'}</h1>
      <p>
        {budgetComplete
          ? 'You’ve made time to practise today. This is a good place to stop. Your words will be here tomorrow.'
          : 'These cards will come back when they’re ready. You can rest now, or return home for a different small round.'}
      </p>
      <button className="calm-primary" onClick={onBack}>
        Back home
      </button>
    </div>
  );
}
