/**
 * Prov — the exam feature.
 *
 * Questions are NOT generated at run time. The bank is authored and verified
 * once (see migrations create_prov_quiz_tables / sv_pick_quiz_rpc_v2), and a
 * test is assembled by drawing strategically from it: a difficulty blueprint,
 * plus round-robin across skills so a 100-question paper can't collapse into
 * 100 questions about noun plurals.
 *
 * That selection lives in Postgres (sv_pick_quiz) rather than here, so the
 * client never has to download the whole bank to build one paper.
 */
import { supabase } from './supabase';

export type QuizCourse = 'A1 Part 1' | 'A1 Part 2' | 'Both';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const QUIZ_SIZES = [20, 50, 100] as const;
export type QuizSize = (typeof QUIZ_SIZES)[number];

export interface QuizQuestion {
  id: string;
  course: string;
  difficulty: Difficulty;
  skill: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  course: string;
  size: number;
  score: number;
  total: number;
  duration_ms: number | null;
  breakdown: Breakdown | null;
  created_at: string;
}

export interface Breakdown {
  by_skill: Record<string, { right: number; total: number }>;
  by_difficulty: Record<string, { right: number; total: number }>;
}

/** Draw one paper. Returns [] rather than throwing so the UI can show a message. */
export async function pickQuiz(course: QuizCourse, size: number): Promise<QuizQuestion[]> {
  const { data, error } = await supabase.rpc('sv_pick_quiz', { p_course: course, p_size: size });
  if (error) { console.error('pickQuiz failed', error); return []; }
  return (data ?? []) as QuizQuestion[];
}

/** Score a finished paper. `chosen[i]` is the option index picked for question i, or -1. */
export function score(questions: QuizQuestion[], chosen: number[]): { right: number; breakdown: Breakdown } {
  const by_skill: Breakdown['by_skill'] = {};
  const by_difficulty: Breakdown['by_difficulty'] = {};
  let right = 0;
  questions.forEach((q, i) => {
    const ok = chosen[i] === q.answer;
    if (ok) right++;
    (by_skill[q.skill] ??= { right: 0, total: 0 }).total++;
    if (ok) by_skill[q.skill].right++;
    (by_difficulty[q.difficulty] ??= { right: 0, total: 0 }).total++;
    if (ok) by_difficulty[q.difficulty].right++;
  });
  return { right, breakdown: { by_skill, by_difficulty } };
}

/** Persist a finished paper. Only ever writes the caller's own row (RLS enforces it). */
export async function saveResult(args: {
  userId: string;
  course: QuizCourse;
  size: number;
  score: number;
  total: number;
  durationMs: number;
  breakdown: Breakdown;
  questions: QuizQuestion[];
  chosen: number[];
}): Promise<boolean> {
  const { error } = await supabase.from('sv_quiz_results').insert({
    user_id: args.userId,
    course: args.course,
    size: args.size,
    score: args.score,
    total: args.total,
    duration_ms: args.durationMs,
    breakdown: args.breakdown,
    answers: args.questions.map((q, i) => ({ q: q.id, chosen: args.chosen[i], correct: q.answer })),
  });
  if (error) { console.error('saveResult failed', error); return false; }
  return true;
}

export async function fetchResults(limit = 10): Promise<QuizResult[]> {
  const { data, error } = await supabase
    .from('sv_quiz_results')
    .select('id, course, size, score, total, duration_ms, breakdown, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('fetchResults failed', error); return []; }
  return (data ?? []) as QuizResult[];
}

/** How many questions exist per level — so the UI can say what's available. */
export async function poolCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('sv_quiz_questions').select('course').eq('active', true);
  if (error) return {};
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as { course: string }[]) out[r.course] = (out[r.course] ?? 0) + 1;
  return out;
}

export const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Very hard',
};
export const DIFF_COLOR: Record<Difficulty, string> = {
  easy: '#10b981', medium: '#f59e0b', hard: '#f97316', expert: '#ef4444',
};

/** Grade bands, so a score means something beyond a percentage. */
export function grade(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: 'Mycket bra', color: '#10b981' };
  if (pct >= 75) return { label: 'Godkänt', color: '#22c55e' };
  if (pct >= 60) return { label: 'Nästan där', color: '#f59e0b' };
  return { label: 'Öva mer', color: '#ef4444' };
}
