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

/**
 * SM-2 Algorithm Implementation
 * Rating: 0=Again, 3=Hard, 4=Good, 5=Easy
 *
 * Generic over any card with the SRS fields — used by both vocab Flashcards
 * and GrammarCards.
 */
export function calculateSM2<T extends SRSCard>(
  card: T,
  rating: number
): Partial<T> {
  const now = Date.now();
  const next = { ...card };

  // Store the previous interval for lapse recovery
  const previousReviewInterval = next.state === CardState.REVIEW ? next.interval : 1;

  // --- NEW or LEARNING ---
  // Day-based scheduling: any PASSING answer (Hard/Good/Easy) on a new or
  // learning card graduates it to a whole-day interval, so a card you answer
  // today never comes back the same day — not even in a later session that day.
  // Only "Again" keeps it short, so a card you got WRONG is relearned now.
  if (next.state === CardState.NEW || next.state === CardState.LEARNING) {
    if (rating === 0) {
        // Again — failed: relearn within THIS session (under the 10-min
        // re-queue threshold), not in a later same-day session.
        next.state = CardState.LEARNING;
        next.interval = 1; // minute
        next.nextReviewDate = now + next.interval * 60 * 1000;
    } else if (rating === 3) {
        // Hard — graduate to tomorrow, with a small ease penalty.
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.graduatingInterval; // 1 day
        next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    } else if (rating === 4) {
        // Good — graduate to tomorrow.
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.graduatingInterval; // 1 day
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    } else if (rating === 5) {
        // Easy — graduate a few days out.
        next.state = CardState.REVIEW;
        next.interval = SETTINGS.easyInterval; // 4 days
        next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
    }
  }

  // --- REVIEW ---
  else if (next.state === CardState.REVIEW) {
      if (rating === 0) {
          // Lapse: move to relearning
          next.state = CardState.RELEARNING;
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
          // Store the pre-lapse interval so we can recover it
          next.interval = SETTINGS.relearningSteps[0]; // 10m in minutes
          next.nextReviewDate = now + next.interval * 60 * 1000;
      } else if (rating === 3) {
          // Hard: small increase, penalty to ease
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(next.interval * SETTINGS.hardInterval));
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) {
          // Good: standard interval growth
          next.interval = Math.round(next.interval * next.easeFactor);
          // SM-2 ease factor adjustment
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 5) {
          // Easy: interval * EF * easyBonus
          next.interval = Math.round(next.interval * next.easeFactor * SETTINGS.easyBonus);
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
  }

  // --- RELEARNING ---
  else if (next.state === CardState.RELEARNING) {
      if (rating === 0) {
          // Again: stay in relearning
          next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
          next.interval = SETTINGS.relearningSteps[0];
          next.nextReviewDate = now + next.interval * 60 * 1000;
      } else if (rating === 3) {
          // Hard: graduate back but with reduced interval
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(previousReviewInterval * SETTINGS.lapseNewInterval));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) {
          // Good: graduate back
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, Math.round(previousReviewInterval * SETTINGS.lapseNewInterval));
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 5) {
          // Easy: graduate back with better interval
          next.state = CardState.REVIEW;
          next.interval = Math.max(SETTINGS.minimumInterval, previousReviewInterval);
          const q = rating;
          next.easeFactor = Math.max(1.3, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
          next.nextReviewDate = now + next.interval * 24 * 60 * 60 * 1000;
      }
  }

  // Cap interval
  if (next.state === CardState.REVIEW) {
      next.interval = Math.min(next.interval, SETTINGS.maxInterval);
  }

  return next;
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
