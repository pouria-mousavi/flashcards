import test from 'node:test';
import assert from 'node:assert/strict';
import { applyFreshStart } from '../src/lib/freshStart.ts';
import { calmReviewOrder, CALM_ROUND_SIZE } from '../src/lib/calmRound.ts';
import { SESSION_KEY, SWEDISH_SESSION_KEY, ACTIVE_LANGUAGE_KEY } from '../src/lib/session.ts';

function storage(entries) {
  const map = new Map(Object.entries(entries));
  return { map, getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k) };
}

test('fresh start clears only current round pointers once and preserves ratings, history and time', () => {
  const saved = storage({
    [SESSION_KEY]: JSON.stringify({ uid: 'owner', cardIds: ['a'] }),
    [SWEDISH_SESSION_KEY]: JSON.stringify({ uid: 'owner', cardIds: ['b'] }),
    [ACTIVE_LANGUAGE_KEY]: 'en', pendingRatings: 'keep', savedProgress: 'keep', studyTime: 'keep',
  });
  assert.equal(applyFreshStart(saved, 'owner', true), true);
  assert.equal(saved.getItem(SESSION_KEY), null);
  assert.equal(saved.getItem(SWEDISH_SESSION_KEY), null);
  assert.equal(saved.getItem(ACTIVE_LANGUAGE_KEY), 'sv');
  for (const key of ['pendingRatings', 'savedProgress', 'studyTime']) assert.equal(saved.getItem(key), 'keep');
  saved.setItem(SWEDISH_SESSION_KEY, 'new round');
  assert.equal(applyFreshStart(saved, 'owner', true), false);
  assert.equal(saved.getItem(SWEDISH_SESSION_KEY), 'new round');
});

test('fresh start does not affect another account or run for a non-owner', () => {
  const other = JSON.stringify({ uid: 'friend', cardIds: ['a'] });
  const saved = storage({ [SWEDISH_SESSION_KEY]: other });
  assert.equal(applyFreshStart(saved, 'friend', false), false);
  assert.deepEqual([...saved.map], [[SWEDISH_SESSION_KEY, other]]);
  assert.equal(applyFreshStart(saved, 'owner', true), true);
  assert.equal(saved.getItem(SWEDISH_SESSION_KEY), other);
});

test('a short reviewed card opens a five-card round without losing scheduler order or changing cards', () => {
  const cards = [
    { id: 'learning', back: 'kort', state: 'LEARNING' },
    { id: 'long', back: 'Jag vill gärna läsa en bok idag', state: 'REVIEW' },
    { id: 'short', back: 'en bok', state: 'REVIEW' },
    { id: 'later', back: 'kort', state: 'REVIEW' },
  ];
  const original = structuredClone(cards);
  assert.equal(CALM_ROUND_SIZE, 5);
  assert.deepEqual(calmReviewOrder(cards).map(c => c.id), ['short', 'learning', 'long', 'later']);
  assert.deepEqual(cards, original);
  assert.deepEqual(calmReviewOrder(cards.slice(0, 2)), cards.slice(0, 2));
});
