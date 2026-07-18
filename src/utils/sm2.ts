import type { Database } from '../types/supabase';

export const CardState = {
  NEW: 'NEW',
  LEARNING: 'LEARNING',
  REVIEW: 'REVIEW',
  RELEARNING: 'RELEARNING',
} as const;

export type CardState = typeof CardState[keyof typeof CardState];

export interface OtherMeaning {
  english: string;
  persian: string;
}

export interface Flashcard {
  type?: 'vocab';  // discriminator — optional for backwards compat, set by mapper
  id: string;
  front: string;
  back: string;
  pronunciation?: string;
  tone?: string;
  synonyms?: string;
  examples?: string[];

  // Stats (NEVER touch during data migration)
  state: CardState;
  nextReviewDate: number;
  interval: number;
  easeFactor: number;
  createdAt: number;

  user_notes?: string;

  word_forms?: {
      noun?: string;
      verb?: string;
      adj?: string;
      adv?: string;
      past?: string;
      pp?: string;
  };

  other_meanings?: OtherMeaning[];
  native_speaking?: boolean;
  dailySynonym?: string;
  usageNote?: string;
  scenario?: string;
  scenarioAnswer?: string;
}

// Anki-like SM-2 configuration
const SETTINGS = {
  learningSteps: [1, 10],       // Minutes
  relearningSteps: [10],         // Minutes
  graduatingInterval: 1,         // Days
  easyInterval: 4,               // Days
  minimumInterval: 1,            // Days
  easyBonus: 1.3,
  hardInterval: 1.2,
  lapseNewInterval: 0.5,         // After lapse, new interval = old * this (minimum 1 day)
  maxInterval: 365,              // Cap at 1 year
};

// Minimal shape needed by the SM-2 algorithm. Works for Flashcard or GrammarCard.
export interface SRSCard {
    state: CardState;
    nextReviewDate: number;
    interval: number;
    easeFactor: number;
}

const MIN_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Anki-style SM-2 with real learning steps.
 * Rating: 0=Again, 3=Hard, 4=Good, 5=Easy
 *
 * Units for `interval`:
 *  - LEARNING:   minutes — the card's current position on the learning ladder
 *                (SETTINGS.learningSteps). 1 → first step, 10 → last step.
 *  - RELEARNING: DAYS — the preserved pre-lapse REVIEW interval, so lapse
 *                recovery can compute from it. The relearning delay itself is
 *                a fixed number of minutes and is NOT stored in `interval`.
 *  - REVIEW:     days.
 *
 * Learning ladder (steps [1, 10] minutes):
 *  - Again → back to step 1 (1 min)
 *  - Hard  → between current and next step (new card: 6 min); repeats last step
 *  - Good  → next step; past the last step → graduate to 1 day
 *  - Easy  → graduate immediately to 4 days
 * Ease factor is untouched while a card is in learning (Anki behavior).
 */
export function calculateSM2<T extends SRSCard>(
  card: T,
  rating: number
): Partial<T> {
  const now = Date.now();
  const next = { ...card };
  const steps = SETTINGS.learningSteps;

  // --- NEW or LEARNING: walk the minutes ladder ---
  if (next.state === CardState.NEW || next.state === CardState.LEARNING) {
    // Position on the ladder: NEW cards sit at the first step.
    const cur = next.state === CardState.NEW ? steps[0] : next.interval;
    const nextStep = steps.find(s => s > cur);

    if (rating === 0) {
        // Again — restart the ladder.
        next.state = CardState.LEARNING;
        next.interval = steps[0];
        next.nextReviewDate = now + next.interval * MIN_MS;
    } else if (rating === 3) {
        // Hard — halfway between current and next step (or repeat the last).
        next.state = CardState.LEARNING;
        next.interval = nextStep ? Math.round((cur + nextStep) / 2) : cur;
        next.nextReviewDate = now + next.interval * MIN_MS;
    } else if (rating === 4) {
        if (nextStep) {
            // Good — advance to the next step.
            next.state = CardState.LEARNING;
            next.interval = nextStep;
            next.nextReviewDate = now + next.interval * MIN_MS;
        } else {
            // Good past the last step — graduate to tomorrow.
            next.state = CardState.REVIEW;
            next.interval = SETTINGS.graduatingInterval;
            next.nextReviewDate = now + next.interval * DAY_MS;
        }
    } else if (rating === 5) {
        // Easy — skip the ladder, graduate a few days out.
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.easyInterval;
        next.nextReviewDate = now + next.interval * DAY_MS;
    }
  }

  // --- REVIEW ---
  else if (next.state === CardState.REVIEW) {
      if (rating === 0) {
          // Lapse: into relearning. KEEP `interval` (pre-lapse days) so
          // graduation can recover from it; the delay is a fixed step.
          next.state = CardState.RELEARNING;
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
          next.nextReviewDate = now + SETTINGS.relearningSteps[0] * MIN_MS;
      } else if (rating === 3) {
          // Hard: small growth (always at least +1 day), ease penalty.
          next.interval = Math.max(next.interval + 1, Math.round(next.interval * SETTINGS.hardInterval));
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
          next.nextReviewDate = now + next.interval * DAY_MS;
      } else if (rating === 4) {
          // Good: standard growth (always at least +1 day).
          next.interval = Math.max(next.interval + 1, Math.round(next.interval * next.easeFactor));
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * DAY_MS;
      } else if (rating === 5) {
          // Easy: growth with bonus (always at least +1 day), ease reward.
          next.interval = Math.max(next.interval + 1, Math.round(next.interval * next.easeFactor * SETTINGS.easyBonus));
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * DAY_MS;
      }
  }

  // --- RELEARNING (interval holds the preserved pre-lapse DAYS) ---
  else if (next.state === CardState.RELEARNING) {
      const preLapse = Math.max(1, next.interval);

      if (rating === 0) {
          // Again: repeat the relearning step; interval (pre-lapse) preserved.
          // No ease penalty here — the lapse already charged -0.2 once
          // (Anki: ease is untouched while relearning).
          next.interval = preLapse;
          next.nextReviewDate = now + SETTINGS.relearningSteps[0] * MIN_MS;
      } else if (rating === 3) {
          // Hard: repeat the step with a longer delay; stay relearning.
          next.interval = preLapse;
          next.nextReviewDate = now + Math.round(SETTINGS.relearningSteps[0] * 1.5) * MIN_MS;
      } else if (rating === 4) {
          // Good: graduate back at half the pre-lapse interval.
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(preLapse * SETTINGS.lapseNewInterval));
          next.nextReviewDate = now + next.interval * DAY_MS;
      } else if (rating === 5) {
          // Easy: graduate back a bit above the Good recovery.
          next.state = CardState.REVIEW;
          const goodIvl = Math.max(SETTINGS.minimumInterval, Math.round(preLapse * SETTINGS.lapseNewInterval));
          next.interval = Math.max(goodIvl + 1, Math.round(preLapse * 0.75));
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * DAY_MS;
      }
  }

  // Cap interval — and reschedule from the CAPPED value, so the stored
  // interval always matches the actual gap until the next review.
  if (next.state === CardState.REVIEW && next.interval > SETTINGS.maxInterval) {
      next.interval = SETTINGS.maxInterval;
      next.nextReviewDate = now + next.interval * DAY_MS;
  }

  return next;
}

/**
 * How long before a card's due time the session may re-queue/show it.
 * Covers every learning/relearning step (1–15 min) with headroom.
 */
export const LEARNING_REQUEUE_WINDOW_MS = 20 * MIN_MS;

/**
 * Human label for when a card would come back if rated `rating` now —
 * shown under the rating buttons (Anki-style): "1m", "6m", "1d", "25d".
 */
export function previewIntervalLabel<T extends SRSCard>(card: T, rating: number): string {
  const next = calculateSM2(card, rating);
  const ms = (next.nextReviewDate ?? Date.now()) - Date.now();
  if (ms < 60 * MIN_MS) return `${Math.max(1, Math.round(ms / MIN_MS))}m`;
  const days = Math.max(1, Math.round(ms / DAY_MS));
  if (days >= 30) return `${Math.round(days / 30)}mo`;
  return `${days}d`;
}

// Mapper to convert DB Row -> App Flashcard
export function mapRowToCard(row: Database['public']['Tables']['cards']['Row']): Flashcard {
    return {
        type: 'vocab',
        id: row.id,
        front: row.front,
        back: row.back,
        pronunciation: row.pronunciation || undefined,
        tone: row.tone || undefined,
        synonyms: row.synonyms || undefined,
        examples: (() => {
            if (Array.isArray(row.examples)) return row.examples as string[];
            if (typeof row.examples === 'string') {
                try {
                    return JSON.parse(row.examples) as string[];
                } catch {
                    return [row.examples];
                }
            }
            return undefined;
        })(),
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor,
        createdAt: new Date(row.created_at).getTime(),
        user_notes: row.user_notes || undefined,
        word_forms: (() => {
            if (row.word_forms && typeof row.word_forms === 'object' && !Array.isArray(row.word_forms)) {
                const wf = row.word_forms as Record<string, unknown>;
                const result: Flashcard['word_forms'] = {};
                for (const key of ['noun', 'verb', 'adj', 'adv', 'past', 'pp'] as const) {
                    if (wf[key] && typeof wf[key] === 'string') {
                        result[key] = wf[key] as string;
                    }
                }
                return Object.keys(result).length > 0 ? result : undefined;
            }
            return undefined;
        })(),
        other_meanings: (() => {
            if (Array.isArray(row.other_meanings)) {
                return (row.other_meanings as unknown as OtherMeaning[]).filter(
                    m => m && typeof m.english === 'string' && typeof m.persian === 'string'
                );
            }
            return undefined;
        })(),
        native_speaking: row.native_speaking ?? false,
        dailySynonym: row.daily_synonym || undefined,
        usageNote: row.usage_note || undefined,
        scenario: (row as any).scenario || undefined,
        scenarioAnswer: (row as any).scenario_answer || undefined,
    };
}

// -----------------------------------------------------------------------------
// Grammar Cards — a separate flashcard type for advanced grammar structures.
// Front: Persian sentence using the structure. Back: English sentence.
// Uses the same SM-2 algorithm via the shared SRSCard interface.
// -----------------------------------------------------------------------------

export interface GrammarCard {
    type: 'grammar';
    id: string;
    front: string;          // Persian
    back: string;           // English
    structure?: string;     // Name of the grammar structure (e.g., "Mixed Conditional")

    // SRS fields (shared shape with SRSCard)
    state: CardState;
    nextReviewDate: number;
    interval: number;
    easeFactor: number;
    createdAt: number;
}

export function mapGrammarRowToCard(
    row: Database['public']['Tables']['grammar_cards']['Row']
): GrammarCard {
    return {
        type: 'grammar',
        id: row.id,
        front: row.front,
        back: row.back,
        structure: row.structure || undefined,
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor,
        createdAt: new Date(row.created_at).getTime(),
    };
}

// Union type used by the unified study session
export type StudyCard = Flashcard | GrammarCard;

export const isGrammarCard = (c: StudyCard): c is GrammarCard => c.type === 'grammar';

// -----------------------------------------------------------------------------
// Swedish Cards — a SEPARATE language deck. Deliberately NOT part of StudyCard /
// the English session, so the two languages can never be mixed. Same SM-2
// algorithm via the shared SRSCard shape.
//
// Each card has a front and back, one Swedish and one English (frontLang tells
// you which). Examples live only on the back, written in the back-side language,
// each paired with a translation in the opposite language. Every piece of text
// (front, back, each example) is individually playable via TTS in its own lang.
// -----------------------------------------------------------------------------

export type Lang = 'sv' | 'en';

export interface SwedishExample {
    text: string;         // sentence in the back-side language
    translation?: string; // same sentence in the opposite language
    emphasis?: string;    // verbatim substring of `text` to stress (betoning)
}

export type SwedishPos = 'verb' | 'noun' | 'adjective';

// Inflection table stored per card (only on verb/noun/adjective cards). Which
// fields are populated depends on `pos`. The card's `back` is the headword
// (present tense for verbs, indefinite singular for nouns, base form for adj).
export interface SwedishWordForms {
    pos?: SwedishPos;
    // verb — principal parts
    infinitive?: string;  // att tala
    present?: string;     // talar
    past?: string;        // talade (preteritum)
    supine?: string;      // talat (supinum — used with har/hade)
    imperative?: string;  // tala!
    group?: number;       // conjugation group 1–4
    irregular?: boolean;  // true for oregelbundna verbs (är, har, gör, kan…)
    formExamples?: {      // a Swedish example sentence per form
        infinitive?: string;
        present?: string;
        past?: string;
        supine?: string;
        imperative?: string;
    };
    // noun — the four forms + gender
    gender?: 'en' | 'ett';
    indefinite?: string;       // en bok
    definite?: string;         // boken
    pluralIndefinite?: string; // böcker
    pluralDefinite?: string;   // böckerna
    // adjective — agreement + comparison
    base?: string;        // stor (en-form)
    neuter?: string;      // stort (ett-form)
    plural?: string;      // stora (plural / definite)
    comparative?: string; // större
    superlative?: string; // störst
    // verb — the preposition(s) it typically takes (with a usage note each)
    prepositions?: SwedishPrep[];
}

export interface SwedishPrep {
    prep: string;     // the preposition, e.g. "på" (or "—" when none)
    example?: string; // a short Swedish collocation, e.g. "titta på tv"
    note?: string;    // English explanation of this preposition's use
}

export interface SwedishCard {
    type: 'swedish';
    id: string;
    front: string;
    frontLang: Lang;
    back: string;
    backLang: Lang;
    examples?: SwedishExample[];
    wordForms?: SwedishWordForms;

    // SRS fields (shared shape with SRSCard)
    state: CardState;
    nextReviewDate: number;
    interval: number;
    easeFactor: number;
    createdAt: number;
}

export function mapSwedishRowToCard(
    row: Database['public']['Tables']['swedish_cards']['Row']
): SwedishCard {
    return {
        type: 'swedish',
        id: row.id,
        front: row.front,
        frontLang: (row.front_lang === 'en' ? 'en' : 'sv'),
        back: row.back,
        backLang: (row.back_lang === 'sv' ? 'sv' : 'en'),
        examples: (() => {
            if (Array.isArray(row.examples)) {
                return (row.examples as unknown as SwedishExample[])
                    .filter(e => e && typeof e.text === 'string')
                    .map(e => ({
                        text: e.text,
                        translation: typeof e.translation === 'string' ? e.translation : undefined,
                        emphasis: typeof e.emphasis === 'string' ? e.emphasis : undefined,
                    }));
            }
            return undefined;
        })(),
        wordForms: (() => {
            const wf = row.word_forms;
            if (wf && typeof wf === 'object' && !Array.isArray(wf)) {
                const o = wf as Record<string, unknown>;
                const result: SwedishWordForms = {};
                const strKeys = [
                    'infinitive', 'present', 'past', 'supine', 'imperative',
                    'indefinite', 'definite', 'pluralIndefinite', 'pluralDefinite',
                    'base', 'neuter', 'plural', 'comparative', 'superlative',
                ] as const;
                for (const key of strKeys) {
                    if (typeof o[key] === 'string') result[key] = o[key] as string;
                }
                if (o.pos === 'verb' || o.pos === 'noun' || o.pos === 'adjective') result.pos = o.pos;
                if (o.gender === 'en' || o.gender === 'ett') result.gender = o.gender;
                if (typeof o.group === 'number') result.group = o.group as number;
                if (Array.isArray(o.prepositions)) {
                    const preps = (o.prepositions as unknown[])
                        .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
                        .filter(p => typeof p.prep === 'string')
                        .map(p => ({
                            prep: p.prep as string,
                            example: typeof p.example === 'string' ? p.example : undefined,
                            note: typeof p.note === 'string' ? p.note : undefined,
                        }));
                    if (preps.length > 0) result.prepositions = preps;
                }
                return Object.keys(result).length > 0 ? result : undefined;
            }
            return undefined;
        })(),
        state: row.state as CardState,
        nextReviewDate: new Date(row.next_review).getTime(),
        interval: row.interval,
        easeFactor: row.ease_factor,
        createdAt: new Date(row.created_at).getTime(),
    };
}
