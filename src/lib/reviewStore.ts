import type { Deck, ReviewEvent, SchedulerMetadata, StudyState, StudyStats } from './studyTypes';

export interface ReviewStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  keys(): string[];
}
export interface ReviewResult { status: 'applied' | 'duplicate' | 'conflict'; state: StudyState | null }
const prefix = (uid: string) => `study-reviews:v1:${uid}:`;
const cacheKey = (uid: string, deck: Deck, id: string) => `study-state:v1:${uid}:${deck}:${id}`;

export class ReviewStore {
  private storage: ReviewStorage;
  private states = new Map<string, StudyState>();
  private running = new Map<string, Promise<{ states: StudyState[]; conflicts: number; pending: number }>>();
  constructor(storage: ReviewStorage) { this.storage = storage; }

  enqueue(uid: string, event: ReviewEvent) {
    // A failed local save must reach the UI before the card is advanced.
    this.storage.setItem(prefix(uid) + event.id, JSON.stringify(event));
  }

  pending(uid: string): ReviewEvent[] {
    return this.storage.keys().filter(k => k.startsWith(prefix(uid))).flatMap(key => {
      try { return [JSON.parse(this.storage.getItem(key)!) as ReviewEvent]; } catch { return []; }
    }).sort((a, b) => `${a.deck}:${a.card_id}`.localeCompare(`${b.deck}:${b.card_id}`)
      || a.expected_revision - b.expected_revision || a.reviewed_at.localeCompare(b.reviewed_at));
  }

  remember(uid: string, state: StudyState) {
    if (state.user_id !== uid) throw new Error('Review account mismatch');
    const key = cacheKey(uid, state.deck, state.card_id);
    const current = this.cached(uid, state.deck, state.card_id);
    if (!current || state.revision >= current.revision) {
      this.states.set(key, state);
      try { this.storage.setItem(key, JSON.stringify(state)); } catch { /* server copy is durable */ }
    }
  }

  private cached(uid: string, deck: Deck, id: string): StudyState | null {
    const key = cacheKey(uid, deck, id);
    const memory = this.states.get(key) ?? null;
    try {
      const saved = JSON.parse(this.storage.getItem(key) || 'null') as StudyState | null;
      return saved && saved.revision > (memory?.revision ?? 0) ? saved : memory;
    } catch { return memory; }
  }

  overlay<T extends StudyStats & SchedulerMetadata & { id: string }>(uid: string, deck: Deck, card: T, pending = this.pending(uid)): T {
    let next = { ...card };
    const state = this.cached(uid, deck, card.id);
    if (state) {
      next = { ...next, ...state.stats, fsrs: state.fsrs, scheduleRevision: state.revision, scheduleEventId: state.last_event_id };
    }
    for (const event of pending.filter(e => e.deck === deck && e.card_id === card.id)) {
      if (event.expected_revision !== (next.scheduleRevision ?? 0) || event.parent_event_id !== (next.scheduleEventId ?? null)) continue;
      next = { ...next, ...event.after_stats, fsrs: event.fsrs_after, scheduleRevision: event.expected_revision + 1, scheduleEventId: event.id };
    }
    return next;
  }

  overlayMany<T extends StudyStats & SchedulerMetadata & { id: string }>(uid: string, deck: Deck, cards: T[]): T[] {
    const pending = this.pending(uid);
    return cards.map(card => this.overlay(uid, deck, card, pending));
  }

  flush(uid: string, send: (event: ReviewEvent) => Promise<ReviewResult>) {
    const existing = this.running.get(uid);
    if (existing) return existing;
    const run = (async () => {
      const states: StudyState[] = [];
      let conflicts = 0;
      for (const event of this.pending(uid)) {
        const result = await send(event); // failure leaves this event and its dependents intact
        if (result.state) { this.remember(uid, result.state); states.push(result.state); }
        if (result.status === 'conflict') conflicts++;
        this.storage.removeItem(prefix(uid) + event.id);
      }
      return { states, conflicts, pending: this.pending(uid).length };
    })().finally(() => this.running.delete(uid));
    this.running.set(uid, run);
    return run;
  }
}
