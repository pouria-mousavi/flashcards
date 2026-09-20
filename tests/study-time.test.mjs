import test from 'node:test';
import assert from 'node:assert/strict';
import { StudyTimeBudget, DAILY_STUDY_LIMIT_MS, studyDay, studyDayStart } from '../src/lib/studyTime.ts';

const minute = 60000;
const start = Date.parse('2026-09-15T10:00:00Z');
function fixture() {
  const rows = new Map();
  const storage = { entries: () => [...rows], setItem: (k, v) => rows.set(k, v) };
  let id = 0;
  return { storage, rows, clock: (uid = 'owner') => new StudyTimeBudget(uid, storage, () => String(++id)) };
}

test('Swedish, English, repeats and resumed sessions share one allowance', () => {
  const f = fixture();
  const swedish = f.clock();
  swedish.start(start);
  assert.equal(swedish.pause(start + 12 * minute), 8 * minute);
  const english = f.clock();
  english.start(start + 60 * minute);
  assert.equal(english.pause(start + 65 * minute), 3 * minute);
  const resumed = f.clock();
  resumed.start(start + 70 * minute);
  assert.equal(resumed.checkpoint(start + 74 * minute), 0);
  assert.equal(f.clock().remaining(start + 90 * minute), 0);
});

test('pause and background gaps are excluded, including final fractional seconds', () => {
  const { clock } = fixture();
  const budget = clock();
  budget.start(start);
  budget.checkpoint(start + 1000);
  budget.pause(start + 1500);
  assert.equal(budget.checkpoint(start + 10 * minute), DAILY_STUDY_LIMIT_MS - 1500);
  budget.start(start + 10 * minute);
  budget.pause(start + 10 * minute + 2500);
  assert.equal(budget.remaining(start), DAILY_STUDY_LIMIT_MS - 4000);
});

test('repeated checkpoints never count the same time twice or exceed the cap', () => {
  const { clock } = fixture();
  const budget = clock();
  budget.start(start);
  for (let second = 1; second <= 1210; second++) budget.checkpoint(start + second * 1000);
  assert.equal(budget.pause(start + 1300 * 1000), 0);
});

test('overlapping browser tabs count wall time once without losing sequential time', () => {
  const f = fixture();
  const first = f.clock(), second = f.clock();
  first.start(start);
  first.checkpoint(start + 5 * minute);
  second.start(start + 3 * minute);
  second.checkpoint(start + 8 * minute);
  first.pause(start + 10 * minute);
  assert.equal(second.pause(start + 12 * minute), 8 * minute);
  assert.equal(f.clock().remaining(start), 8 * minute);
});

test('accounts have separate allowances, and malformed records do not break study', () => {
  const f = fixture();
  const owner = f.clock();
  owner.start(start);
  owner.pause(start + 5 * minute);
  assert.equal(f.clock('another-account').remaining(start), DAILY_STUDY_LIMIT_MS);
  const prefix = [...f.rows.keys()][0];
  f.rows.set(prefix + ':broken', '{');
  f.rows.set(prefix + ':invalid', '["NaN",-1]');
  assert.equal(owner.remaining(start), 15 * minute);
});

test('missing days does not accumulate extra time or consume the next allowance', () => {
  const f = fixture();
  const budget = f.clock();
  budget.start(start);
  budget.pause(start + 5 * minute);
  const nextWeek = start + 7 * 86400000;
  assert.equal(f.clock().remaining(nextWeek), DAILY_STUDY_LIMIT_MS);
});

test('a midnight session splits time at Stockholm midnight', () => {
  const { clock } = fixture();
  const budget = clock();
  const midnight = Date.parse('2026-09-15T22:00:00Z');
  budget.start(midnight - 2 * minute);
  budget.pause(midnight + 3 * minute);
  assert.equal(budget.remaining(midnight - 1), 18 * minute);
  assert.equal(budget.remaining(midnight + 1), 17 * minute);
});

test('Stockholm day boundaries handle both daylight-saving transitions', () => {
  assert.equal(studyDay(Date.parse('2026-09-15T22:00:00Z')), '2026-09-16');
  assert.equal(new Date(studyDayStart(Date.parse('2026-03-29T12:00:00Z'))).toISOString(), '2026-03-28T23:00:00.000Z');
  assert.equal(new Date(studyDayStart(Date.parse('2026-10-25T12:00:00Z'))).toISOString(), '2026-10-24T22:00:00.000Z');
  for (const midnight of ['2026-03-29T22:00:00Z', '2026-10-25T23:00:00Z']) {
    const budget = fixture().clock();
    const at = Date.parse(midnight);
    budget.start(at - minute);
    budget.pause(at + minute);
    assert.equal(budget.remaining(at - 1), 19 * minute);
    assert.equal(budget.remaining(at + 1), 19 * minute);
  }
});
