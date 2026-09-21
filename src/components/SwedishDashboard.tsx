import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Leaf, Library, SlidersHorizontal, Sprout, X } from 'lucide-react';
import type { Lang } from '../utils/sm2';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useStudyTime } from '../lib/useStudyTime';

interface Props {
  userId: string;
  cards: { state: string; nextReviewDate: number }[];
  languageName?: 'Swedish' | 'English';
  onAddCard?: () => void;
  onStartStudy: () => void;
  hasActiveSession?: boolean;
  onResetSession?: () => void;
  activeLanguage: Lang;
  onSwitchLanguage: (lang: Lang) => void;
  onOpenReference?: () => void;
  onOpenGrammar?: () => void;
  onOpenProgress?: () => void;
  onOpenChapters?: () => void;
  onOpenProv?: () => void;
  onOpenAccount?: () => void;
  showSwitcher?: boolean;
  newBudget?: number;
  studiedToday?: number;
}

export default function SwedishDashboard({
  userId, cards, onStartStudy, hasActiveSession, onResetSession, activeLanguage, onSwitchLanguage,
  onOpenReference, onOpenGrammar, onOpenProgress, onOpenChapters, onOpenProv, onOpenAccount,
  showSwitcher = true, newBudget = 0, studiedToday = 0, languageName = 'Swedish', onAddCard,
}: Props) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const libraryButton = useRef<HTMLButtonElement>(null);
  const closeLibrary = () => { setLibraryOpen(false); window.setTimeout(() => libraryButton.current?.focus(), 0); };
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = window.setInterval(refresh, 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  const studyTime = useStudyTime(userId, null);
  const hasDue = cards.some(c => c.state !== 'NEW' && c.nextReviewDate <= now)
    || (newBudget > 0 && cards.some(c => c.state === 'NEW'));
  const canStudy = (hasDue || hasActiveSession) && !studyTime.exhausted;
  const settled = studyTime.exhausted || (!hasDue && !hasActiveSession);
  const links = [
    { title: 'Grammar help', detail: 'Understand a pattern', action: onOpenGrammar },
    { title: 'Word forms', detail: 'Look up a word', action: onOpenReference },
    { title: 'Your cards', detail: 'Browse by chapter', action: onOpenChapters },
    { title: 'Your progress', detail: 'See what you have practised', action: onOpenProgress },
    { title: 'Practice quiz', detail: 'Try it when you feel ready', action: onOpenProv },
    { title: 'Add cards', detail: 'Keep new words for later', action: onAddCard },
  ].filter(link => link.action);

  return (
    <main className="calm-home">
      <header className="calm-topbar" inert={libraryOpen}>
        <span className="calm-brand"><Sprout size={23} strokeWidth={1.6} /> {languageName === 'Swedish' ? 'svenska' : 'english'}<span className="brand-dot">.</span></span>
        <div className="calm-tools"><ThemeToggle />{onOpenAccount && <button className="calm-icon-button" onClick={onOpenAccount} aria-label="Account settings"><SlidersHorizontal size={19} /></button>}</div>
      </header>
      <div className="calm-home-content" inert={libraryOpen}>
        <div className="calm-art" aria-hidden="true"><div className="art-orbit" /><div className="art-paper art-paper-back" /><div className="art-paper"><span>{languageName === 'Swedish' ? 'hej.' : 'hello.'}</span><i>{languageName === 'Swedish' ? 'hello' : 'a beginning'}</i><Leaf size={25} strokeWidth={1.3} /></div><span className="art-spark">✳</span></div>
        <p className="calm-eyebrow">YOUR {languageName.toUpperCase()}, AT YOUR PACE</p>
        <h1 className="calm-title">{settled ? 'Let it settle.' : `A little ${languageName}.`}</h1>
        <p className="calm-intro">{settled ? 'You can leave it here for today. Your words will be here when you return.' : studiedToday > 0 ? `You’ve already made a little space for ${languageName} today. Another round is optional.` : 'One word, one small step. Start wherever you are.'}</p>
        <section className="calm-start-panel" aria-label="Your practice">
          <div className="calm-start-heading"><span className="calm-leaf"><Leaf size={20} /></span><div><h2>{settled ? 'A good place to pause' : hasActiveSession ? 'Pick up your practice' : 'A small round'}</h2><p>{settled ? 'Rest is part of learning, too.' : 'A few cards. You can stop at any point.'}</p></div></div>
          <button className="calm-primary" disabled={!canStudy} onClick={onStartStudy}>{settled ? 'Rest for now' : hasActiveSession ? 'Continue your round' : 'Study a few cards'}{!settled && <ArrowRight size={19} />}</button>
          {hasActiveSession && onResetSession && <button className="calm-text-button" onClick={onResetSession}>Start a fresh round</button>}
        </section>
        <button ref={libraryButton} className="calm-library-link" onClick={() => setLibraryOpen(true)} aria-expanded={libraryOpen} aria-controls={libraryOpen ? 'learning-space' : undefined}><Library size={18} /><span>Your learning space</span><ArrowRight size={16} /></button>
      </div>
      <footer className="calm-home-footer" inert={libraryOpen}><span lang="sv">Lite i taget.</span> A little at a time.</footer>
      {libraryOpen && <section className="calm-library" id="learning-space" aria-label="Your learning space" onKeyDown={event => { if (event.key === 'Escape') closeLibrary(); }}>
        <header className="calm-topbar"><span className="calm-brand"><BookOpen size={22} /> Your learning space</span><button className="calm-icon-button" onClick={closeLibrary} aria-label="Close learning space" autoFocus><X size={21} /></button></header>
        <div className="calm-library-content">
          <h2 className="calm-title">Make it your own.</h2><p className="calm-intro">A little support, whenever you need it.</p>
          <div className="calm-library-list">{links.map(link => <button key={link.title} onClick={link.action}><span><strong>{link.title}</strong><small>{link.detail}</small></span><ArrowRight size={19} /></button>)}</div>
          <details className="calm-help"><summary>A gentler way to learn</summary><ol><li>{languageName === 'Swedish' ? 'Read a small part of Rivstart.' : 'Read a short passage in English.'} Understand it before memorising it.</li><li>Try saying each card’s answer before revealing it. A guess is okay.</li><li>Listen to the example, then say one sentence about your own life.</li>{languageName === 'Swedish' && <li>Use Form i fokus A when a grammar pattern needs a little explanation.</li>}</ol><p>Five cards can be enough. The app keeps the roughly 20-minute daily guide in the background and lets you finish your current card.</p></details>
          {showSwitcher && <div className="calm-language"><LanguageSwitcher active={activeLanguage} onChange={onSwitchLanguage} /></div>}
        </div>
      </section>}
    </main>
  );
}
