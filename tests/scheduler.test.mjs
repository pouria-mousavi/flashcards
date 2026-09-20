import test from 'node:test';
import assert from 'node:assert/strict';
import { makeReview, nextReview } from '../src/lib/scheduler.ts';
const at = Date.parse('2026-09-20T12:00:00Z');
const legacy = { id: '00000000-0000-4000-8000-000000000010', state: 'REVIEW', nextReviewDate: at - 86400000,
  interval: 30, easeFactor: 2.5, totalReviews: 45, lapses: 3, masteryLevel: 3 };

test('legacy adoption only changes the rated copy, preserving counters without fake history', () => {
  const original = structuredClone(legacy);
  const { updated, event } = makeReview(legacy, 'swedish', 4, 12500, at);
  assert.deepEqual(legacy, original);
  assert.equal(updated.totalReviews, 46);
  assert.equal(updated.lapses, 3);
  assert.equal(event.initialization, 'legacy');
  assert.equal(event.fsrs_before, null);
  assert.equal(updated.fsrs.last_review, new Date(at).toISOString());
  assert.equal(event.duration_ms, 12500);
  assert.ok(updated.nextReviewDate > at);
});

test('FSRS uses actual elapsed time for a late successful recall', () => {
  const adopted = nextReview(legacy, 4, at);
  const onTime = nextReview(adopted, 4, adopted.nextReviewDate);
  const late = nextReview(adopted, 4, adopted.nextReviewDate + 7 * 86400000);
  assert.ok(late.fsrs.stability > onTime.fsrs.stability);
  assert.ok(late.interval > onTime.interval);
});

test('forgotten cards retain a ten-minute step and all four ratings stay distinct in history', () => {
  for (const rating of [0, 3, 4, 5]) {
    const { updated, event } = makeReview(legacy, 'swedish', rating, 2000, at);
    assert.equal(event.rating, rating);
    if (rating === 0) assert.equal(updated.nextReviewDate, at + 10 * 60000);
  }
});

test('successive reviews carry an exact parent event and revision', () => {
  const first = makeReview(legacy, 'swedish', 4, 1000, at);
  const second = makeReview(first.updated, 'swedish', 4, 1000, first.updated.nextReviewDate);
  assert.equal(first.event.expected_revision, 0);
  assert.equal(second.event.expected_revision, 1);
  assert.equal(second.event.parent_event_id, first.event.id);
  assert.equal(second.event.initialization, null);
});
