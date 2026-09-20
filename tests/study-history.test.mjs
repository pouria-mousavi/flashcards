import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeSessions } from '../src/lib/sessionHistory.ts';

test('new events extend legacy totals on the Stockholm date without changing old records', () => {
  const legacy = [{ studied_on: '2026-09-20', cards_done: 5, correct: 3, again_count: 2 }];
  const snapshot = structuredClone(legacy);
  const days = mergeSessions(legacy, [
    { reviewed_at: '2026-09-20T21:59:00Z', rating: 4 },
    { reviewed_at: '2026-09-20T22:01:00Z', rating: 0 },
    { reviewed_at: '2026-09-20T22:02:00Z', rating: 3 },
  ]);
  assert.deepEqual(legacy, snapshot);
  assert.deepEqual(days, [
    { studied_on: '2026-09-21', cards_done: 2, correct: 1, again_count: 1 },
    { studied_on: '2026-09-20', cards_done: 6, correct: 4, again_count: 2 },
  ]);
});
