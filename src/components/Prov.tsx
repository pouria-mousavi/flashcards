import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  pickQuiz, score, saveResult, fetchResults, QUIZ_SIZES, DIFF_LABEL, DIFF_COLOR, grade,
} from '../lib/quiz';
import type { QuizCourse, QuizQuestion, QuizResult, Breakdown } from '../lib/quiz';

/**
 * Prov — a real exam, not a flashcard round.
 *
 * Four options per question, drawn from a pre-authored bank across a difficulty
 * blueprint and every skill. Answer, submit, get a score with a per-skill
 * breakdown, then either save the result or take a fresh paper.
 *
 * Deliberately separate from the SRS: nothing here rates a card or touches
 * next_review. A test measures where you are; it isn't a study session.
 */

interface Props {
  userId: string | null;
  onClose: () => void;
}

type Stage = 'setup' | 'running' | 'done';

const COURSES: { key: QuizCourse; label: string; hint: string }[] = [
  { key: 'A1 Part 1', label: 'A1 · Del 1', hint: 'term 1' },
  { key: 'A1 Part 2', label: 'A1 · Del 2', hint: 'term 2, still growing' },
  { key: 'Both',      label: 'Allt',       hint: 'everything so far' },
];

export default function Prov({ userId, onClose }: Props) {
  const [stage, setStage] = useState<Stage>('setup');
  const [course, setCourse] = useState<QuizCourse>('A1 Part 2');
  const [size, setSize] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [at, setAt] = useState(0);
  const [past, setPast] = useState<QuizResult[]>([]);
  const [saved, setSaved] = useState(false);
  const startedAt = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchResults(5).then(setPast); }, []);

  async function start() {
    setLoading(true);
    const qs = await pickQuiz(course, size);
    setLoading(false);
    if (qs.length === 0) return;
    setQuestions(qs);
    setChosen(new Array(qs.length).fill(-1));
    setAt(0);
    setSaved(false);
    startedAt.current = Date.now();
    setStage('running');
  }

  const result = useMemo(
    () => (stage === 'done' ? score(questions, chosen) : null),
    [stage, questions, chosen]);

  function choose(i: number) {
    setChosen(prev => { const n = [...prev]; n[at] = i; return n; });
  }

  function next() {
    if (at + 1 < questions.length) {
      setAt(at + 1);
      listRef.current?.scrollTo({ top: 0 });
    } else {
      setStage('done');
    }
  }

  async function persist() {
    if (!userId || !result) return;
    const ok = await saveResult({
      userId, course, size: questions.length, score: result.right, total: questions.length,
      durationMs: Date.now() - startedAt.current, breakdown: result.breakdown, questions, chosen,
    });
    if (ok) { setSaved(true); fetchResults(5).then(setPast); }
  }

  const answered = chosen.filter(c => c >= 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prov</span>
          {stage === 'running' && (
            <span style={{ marginLeft: 10, fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {at + 1} / {questions.length}
            </span>
          )}
        </h2>
        <button onClick={onClose} className="pressable glass" aria-label="Close prov"
          style={{ width: 36, height: 36, borderRadius: 999, color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      {stage === 'running' && (
        <div style={{ height: 3, background: 'var(--border)', flexShrink: 0 }}>
          <div style={{ height: '100%', width: `${((at) / questions.length) * 100}%`, background: 'var(--grad-sv)', transition: 'width .25s' }} />
        </div>
      )}

      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ---------- SETUP ---------- */}
          {stage === 'setup' && (
            <>
              <Section title="Level">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {COURSES.map(c => (
                    <button key={c.key} onClick={() => setCourse(c.key)} className="pressable glass"
                      style={{
                        padding: '13px 15px', borderRadius: 'var(--radius-sm)', textAlign: 'left',
                        border: course === c.key ? 'none' : '1px solid var(--border)',
                        background: course === c.key ? 'var(--grad-sv)' : 'transparent',
                        color: course === c.key ? 'var(--cta-ink-sv)' : 'var(--text-secondary)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10,
                      }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.label}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>{c.hint}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="How many questions">
                <div style={{ display: 'flex', gap: 8 }}>
                  {QUIZ_SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)} className="pressable glass"
                      style={{
                        flex: 1, padding: '15px 0', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '1.05rem',
                        border: size === s ? 'none' : '1px solid var(--border)',
                        background: size === s ? 'var(--grad-sv)' : 'transparent',
                        color: size === s ? 'var(--cta-ink-sv)' : 'var(--text-secondary)',
                      }}>{s}</button>
                  ))}
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Every paper mixes easy, medium, hard and very hard questions, and spreads them
                  across all the skills — noun forms, verb tenses, word order, prepositions,
                  pronouns and translation.
                </p>
              </Section>

              <button onClick={start} disabled={loading} className="pressable"
                style={{
                  padding: 18, fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius)', border: 'none',
                  background: 'var(--grad-sv)', color: 'var(--cta-ink-sv)', opacity: loading ? 0.6 : 1,
                  boxShadow: '0 10px 30px -6px var(--glow-sv)',
                }}>
                {loading ? 'Building your paper…' : `Start ${size}-question prov`}
              </button>

              {past.length > 0 && (
                <Section title="Your last results">
                  {past.map(r => {
                    const pct = Math.round((r.score / r.total) * 100);
                    const g = grade(pct);
                    return (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {r.course} · {r.total} q · {new Date(r.created_at).toLocaleDateString()}
                        </span>
                        <span className="tabular" style={{ fontSize: '0.85rem', fontWeight: 800, color: g.color }}>
                          {r.score}/{r.total} · {pct}%
                        </span>
                      </div>
                    );
                  })}
                </Section>
              )}
            </>
          )}

          {/* ---------- RUNNING ---------- */}
          {stage === 'running' && questions[at] && (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Pill text={DIFF_LABEL[questions[at].difficulty]} color={DIFF_COLOR[questions[at].difficulty]} />
                <Pill text={questions[at].skill} color="var(--text-muted)" />
              </div>

              <p style={{ margin: 0, fontSize: '1.12rem', fontWeight: 650, lineHeight: 1.45, color: 'var(--text-primary)' }}>
                {questions[at].prompt}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {questions[at].options.map((o, i) => {
                  const picked = chosen[at] === i;
                  return (
                    <button key={i} onClick={() => choose(i)} className="pressable glass"
                      style={{
                        padding: '14px 16px', borderRadius: 'var(--radius-sm)', textAlign: 'left',
                        fontSize: '1rem', fontWeight: picked ? 700 : 550, lineHeight: 1.4,
                        border: picked ? 'none' : '1px solid var(--border)',
                        background: picked ? 'var(--grad-sv)' : 'transparent',
                        color: picked ? 'var(--cta-ink-sv)' : 'var(--text-primary)',
                        display: 'flex', gap: 12, alignItems: 'baseline',
                      }}>
                      <span style={{ flexShrink: 0, opacity: 0.6, fontWeight: 800, fontSize: '0.8rem' }}>
                        {'ABCD'[i]}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>{o}</span>
                    </button>
                  );
                })}
              </div>

              <button onClick={next} disabled={chosen[at] < 0} className="pressable"
                style={{
                  padding: 16, fontSize: '0.98rem', fontWeight: 700, borderRadius: 'var(--radius)',
                  border: chosen[at] < 0 ? '1px solid var(--border)' : 'none',
                  background: chosen[at] < 0 ? 'transparent' : 'var(--grad-sv)',
                  color: chosen[at] < 0 ? 'var(--text-muted)' : 'var(--cta-ink-sv)',
                  opacity: chosen[at] < 0 ? 0.55 : 1,
                }}>
                {at + 1 === questions.length ? 'Finish and see score' : 'Next'}
              </button>
              <p style={{ margin: 0, textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {answered} of {questions.length} answered
              </p>
            </>
          )}

          {/* ---------- DONE ---------- */}
          {stage === 'done' && result && (
            <Results
              questions={questions} chosen={chosen} right={result.right} breakdown={result.breakdown}
              saved={saved} canSave={!!userId}
              onSave={persist} onRestart={() => setStage('setup')}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ borderRadius: 'var(--radius)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>{title}</p>
      {children}
    </div>
  );
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
      color, border: `1px solid ${color}`, borderRadius: 999, padding: '3px 9px', opacity: 0.9,
    }}>{text}</span>
  );
}

function Results({ questions, chosen, right, breakdown, saved, canSave, onSave, onRestart }: {
  questions: QuizQuestion[]; chosen: number[]; right: number; breakdown: Breakdown;
  saved: boolean; canSave: boolean; onSave: () => void; onRestart: () => void;
}) {
  const pct = Math.round((right / questions.length) * 100);
  const g = grade(pct);
  const wrong = questions.map((q, i) => ({ q, i })).filter(({ q, i }) => chosen[i] !== q.answer);

  return (
    <>
      <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
        <h1 className="tabular" style={{ margin: 0, fontSize: 'clamp(3rem,14vw,4.2rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', color: g.color }}>
          {pct}%
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '1rem', fontWeight: 700, color: g.color }}>{g.label}</p>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {right} of {questions.length} correct
        </p>
      </div>

      <Section title="By skill">
        {Object.entries(breakdown.by_skill).sort((a, b) => (a[1].right / a[1].total) - (b[1].right / b[1].total)).map(([k, v]) => (
          <Bar key={k} label={k} right={v.right} total={v.total} />
        ))}
      </Section>

      <Section title="By difficulty">
        {(['easy', 'medium', 'hard', 'expert'] as const)
          .filter(d => breakdown.by_difficulty[d])
          .map(d => (
            <Bar key={d} label={DIFF_LABEL[d]} right={breakdown.by_difficulty[d].right}
                 total={breakdown.by_difficulty[d].total} color={DIFF_COLOR[d]} />
          ))}
      </Section>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onRestart} className="pressable glass"
          style={{ flex: 1, padding: 15, borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-secondary)', background: 'transparent' }}>
          ↻ New prov
        </button>
        <button onClick={onSave} disabled={saved || !canSave} className="pressable"
          style={{
            flex: 1, padding: 15, borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '0.92rem', border: 'none',
            background: saved ? 'transparent' : 'var(--grad-sv)',
            color: saved ? 'var(--text-muted)' : 'var(--cta-ink-sv)',
            opacity: (saved || !canSave) ? 0.6 : 1,
          }}>
          {saved ? '✓ Saved' : 'Save result'}
        </button>
      </div>

      {wrong.length > 0 && (
        <Section title={`Review — ${wrong.length} to look at`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {wrong.map(({ q, i }) => (
              <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.4 }}>{q.prompt}</p>
                {chosen[i] >= 0 && (
                  <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--danger)' }}>
                    You chose: {q.options[chosen[i]]}
                  </p>
                )}
                <p style={{ margin: 0, fontSize: '0.83rem', color: '#10b981', fontWeight: 650 }}>
                  Correct: {q.options[q.answer]}
                </p>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{q.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function Bar({ label, right, total, color }: { label: string; right: number; total: number; color?: string }) {
  const pct = total ? Math.round((right / total) * 100) : 0;
  const c = color ?? (pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '0.83rem', fontWeight: 650, color: 'var(--text-primary)' }}>{label}</span>
        <span className="tabular" style={{ fontSize: '0.75rem', fontWeight: 700, color: c }}>{right}/{total}</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c }} />
      </div>
    </div>
  );
}
