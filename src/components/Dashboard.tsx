import type { Flashcard, GrammarCard, Lang } from '../utils/sm2';
import SwedishDashboard from './SwedishDashboard';

interface Props {
  userId: string;
  cards: Flashcard[];
  grammarCards?: GrammarCard[];
  onStartStudy: () => void;
  onAddCard: () => void;
  hasActiveSession?: boolean;
  activeLanguage?: Lang;
  onSwitchLanguage?: (lang: Lang) => void;
  onOpenAccount?: () => void;
  newBudget?: number;
}

export default function Dashboard({ cards, grammarCards = [], activeLanguage = 'en', onSwitchLanguage, ...props }: Props) {
  return <SwedishDashboard {...props} cards={[...cards, ...grammarCards]} languageName="English" activeLanguage={activeLanguage} onSwitchLanguage={onSwitchLanguage ?? (() => {})} showSwitcher={!!onSwitchLanguage} />;
}
