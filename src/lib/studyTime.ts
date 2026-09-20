export const DAILY_STUDY_LIMIT_MS = 20 * 60 * 1000;
const PREFIX = 'flashcards:study-time:v1:';
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function dateParts(at: number) {
  return Object.fromEntries(dateFormatter.formatToParts(at).map(p => [p.type, p.value]));
}

export function studyDay(at: number): string {
  const p = dateParts(at);
  return `${p.year}-${p.month}-${p.day}`;
}

function offset(at: number): number {
  const p = dateParts(at);
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(at / 1000) * 1000;
}

export function studyDayStart(at: number): number {
  const p = dateParts(at);
  const utcMidnight = Date.UTC(+p.year, +p.month - 1, +p.day);
  let start = utcMidnight - offset(at);
  // Midnight can have a different UTC offset from the current time on DST days.
  start = utcMidnight - offset(start);
  return start;
}

type Range = [number, number];
export interface StudyTimeStorage {
  entries(): [string, string][];
  setItem(key: string, value: string): void;
}

// Keep the allowance working in this page even if browser storage is unavailable.
const memory = new Map<string, string>();
export const browserStudyTimeStorage: StudyTimeStorage = {
  entries() {
    const entries = new Map(memory);
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) {
          const value = localStorage.getItem(key);
          if (value !== null && !memory.has(key)) entries.set(key, value);
        }
      }
    } catch { /* use the in-memory allowance */ }
    return [...entries];
  },
  setItem(key, value) {
    memory.set(key, value);
    try { localStorage.setItem(key, value); } catch { /* retain the in-memory value */ }
  },
};

export function coveredMilliseconds(ranges: Range[]): number {
  let end = -Infinity;
  let total = 0;
  for (const [start, stop] of [...ranges].sort((a, b) => a[0] - b[0])) {
    total += Math.max(0, stop - Math.max(start, end));
    end = Math.max(end, stop);
  }
  return total;
}

/** Browser-local time ledger. Independent segment keys avoid lost tab updates;
 * overlapping segments count once. It never writes card state or due dates. */
export class StudyTimeBudget {
  private uid: string;
  private storage: StudyTimeStorage;
  private createId: () => string;
  private segment: { id: string; start: number; recorded: number } | null = null;
  private activeMs = 0;

  constructor(uid: string, storage: StudyTimeStorage, createId = () => crypto.randomUUID()) {
    this.uid = encodeURIComponent(uid);
    this.storage = storage;
    this.createId = createId;
  }

  private prefix(at: number) { return `${PREFIX}${this.uid}:${studyDay(at)}:`; }

  private ranges(at: number, except?: string): Range[] {
    const prefix = this.prefix(at);
    return this.storage.entries().flatMap(([key, value]) => {
      if (!key.startsWith(prefix) || key === except) return [];
      try {
        const range = JSON.parse(value);
        return Array.isArray(range) && range.length === 2 && range.every(Number.isFinite)
          && range[1] >= range[0] ? [range as Range] : [];
      } catch { return []; }
    });
  }

  remaining(at: number): number {
    return Math.max(0, DAILY_STUDY_LIMIT_MS - coveredMilliseconds(this.ranges(at)));
  }

  start(at: number): void {
    if (!this.segment) this.segment = { id: this.createId(), start: at, recorded: 0 };
  }

  checkpoint(at: number): number {
    if (this.segment && at > this.segment.start) {
      let recorded = 0;
      let cursor = this.segment.start;
      while (cursor < at) {
        const start = Math.max(this.segment.start, studyDayStart(cursor));
        // 36h from midnight is always within the following Stockholm date.
        const nextDay = studyDayStart(studyDayStart(cursor) + 36 * 3600000);
        const end = Math.min(at, nextDay);
        const key = this.prefix(cursor) + this.segment.id;
        const others = this.ranges(cursor, key);
        // Find the latest endpoint that still fits the shared allowance.
        let low = start, high = end;
        while (low < high) {
          const middle = Math.ceil((low + high) / 2);
          if (coveredMilliseconds([...others, [start, middle]]) <= DAILY_STUDY_LIMIT_MS) low = middle;
          else high = middle - 1;
        }
        if (low > start) this.storage.setItem(key, JSON.stringify([start, low]));
        recorded += low - start;
        cursor = nextDay;
      }
      this.activeMs += Math.max(0, recorded - this.segment.recorded);
      this.segment.recorded = recorded;
    }
    return this.remaining(at);
  }

  elapsed(): number { return this.activeMs; }

  pause(at: number): number {
    const remaining = this.checkpoint(at);
    this.segment = null;
    return remaining;
  }
}
