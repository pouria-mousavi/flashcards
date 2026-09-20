import { useEffect, useRef, useState } from 'react';
import { browserStudyTimeStorage, StudyTimeBudget } from './studyTime';

export function useStudyTime(userId: string, readyAt: number | null) {
  // Study components are keyed by user ID so an account switch gets a new clock.
  const [budget] = useState(() => new StudyTimeBudget(userId, browserStudyTimeStorage));
  const [remainingMs, setRemainingMs] = useState(() => budget.remaining(Date.now()));
  const [clockTime, setClockTime] = useState(Date.now);
  const exhausted = remainingMs <= 0;
  const active = readyAt !== null && readyAt <= clockTime;
  const waiting = readyAt !== null && !active;
  const lastRating = useRef(0);

  useEffect(() => {
    const tick = () => {
      const at = Date.now();
      setRemainingMs(budget.checkpoint(at));
      if (waiting) setClockTime(at);
    };
    const syncActivity = () => {
      if (active && !exhausted && document.visibilityState === 'visible' && document.hasFocus()) {
        budget.start(Date.now());
      } else {
        budget.pause(Date.now());
      }
      tick();
    };
    const leave = () => budget.pause(Date.now());
    // Start asynchronously so state updates remain outside the effect setup.
    const initial = window.setTimeout(syncActivity, 0);
    const interval = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', syncActivity);
    window.addEventListener('focus', syncActivity);
    window.addEventListener('blur', syncActivity);
    window.addEventListener('storage', tick);
    window.addEventListener('pagehide', leave);
    window.addEventListener('pageshow', syncActivity);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', syncActivity);
      window.removeEventListener('focus', syncActivity);
      window.removeEventListener('blur', syncActivity);
      window.removeEventListener('storage', tick);
      window.removeEventListener('pagehide', leave);
      window.removeEventListener('pageshow', syncActivity);
      leave();
    };
  }, [budget, active, exhausted, waiting]);

  const canStudy = () => {
    const remaining = budget.checkpoint(Date.now());
    setRemainingMs(remaining);
    return remaining > 0;
  };
  const reviewDuration = () => { budget.checkpoint(Date.now()); return budget.elapsed() - lastRating.current; };
  const resetReviewTimer = () => { lastRating.current = budget.elapsed(); };
  return { remainingMs, exhausted, canStudy, ready: active, reviewDuration, resetReviewTimer };
}
