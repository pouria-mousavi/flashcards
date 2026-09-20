import test from 'node:test';
import assert from 'node:assert/strict';
import { ReviewStore } from '../src/lib/reviewStore.ts';
import { makeReview } from '../src/lib/scheduler.ts';

const base = { id: 'card', state: 'REVIEW', nextReviewDate: Date.now(), interval: 10, easeFactor: 2.5 };
function fixture() {
  const map = new Map();
  const storage = { getItem: k => map.get(k) ?? null, setItem: (k,v) => map.set(k,v), removeItem: k => map.delete(k), keys: () => [...map.keys()] };
  return { storage, store: new ReviewStore(storage) };
}
function row(event, user_id = 'owner') {
  return { user_id, deck: event.deck, card_id: event.card_id, revision: event.expected_revision + 1,
    last_event_id: event.id, fsrs: event.fsrs_after, stats: event.after_stats };
}

test('an offline chain survives reload and saves every individual rating in order', async () => {
  const f = fixture();
  const first = makeReview(base, 'swedish', 0, 1000);
  const second = makeReview(first.updated, 'swedish', 4, 2000, first.updated.nextReviewDate);
  f.store.enqueue('owner', first.event);
  f.store.enqueue('owner', second.event);
  await assert.rejects(f.store.flush('owner', async () => { throw new Error('offline'); }));
  const reloaded = new ReviewStore(f.storage);
  assert.equal(reloaded.overlay('owner', 'swedish', base).scheduleRevision, 2);
  const ratings = [];
  await reloaded.flush('owner', async event => { ratings.push(event.rating); return { status: 'applied', state: row(event) }; });
  assert.deepEqual(ratings, [0, 4]);
  assert.equal(reloaded.pending('owner').length, 0);
  assert.equal(reloaded.overlay('owner', 'swedish', base).scheduleRevision, 2);
});

test('a confirmed old save cannot roll back a newer locally pending review', async () => {
  const { store } = fixture();
  const first = makeReview(base, 'swedish', 0, 1000);
  const second = makeReview(first.updated, 'swedish', 4, 1000, first.updated.nextReviewDate);
  store.enqueue('owner', second.event);
  store.remember('owner', row(first.event));
  assert.equal(store.overlay('owner', 'swedish', first.updated).scheduleEventId, second.event.id);
});

test('conflicting parents are never overlaid on a newer server card', () => {
  const { store } = fixture();
  const local = makeReview(base, 'swedish', 0, 1000);
  const remote = makeReview(base, 'swedish', 5, 2000);
  store.enqueue('owner', local.event);
  store.remember('owner', row(remote.event));
  assert.equal(store.overlay('owner', 'swedish', base).scheduleEventId, remote.event.id);
});

test('account changes cannot replay or cache another user\'s reviews', async () => {
  const { store } = fixture();
  const event = makeReview(base, 'swedish', 4, 1000).event;
  store.enqueue('owner', event);
  assert.equal(store.pending('friend').length, 0);
  assert.throws(() => store.remember('friend', row(event)), /account mismatch/);
  let calls = 0;
  await store.flush('friend', async () => { calls++; });
  assert.equal(calls, 0);
});

test('local storage failure stops a rating before optimistic progress is accepted', () => {
  const { storage } = fixture();
  const store = new ReviewStore({ ...storage, setItem: () => { throw new Error('quota'); } });
  assert.throws(() => store.enqueue('owner', makeReview(base, 'swedish', 4, 1000).event), /quota/);
});
