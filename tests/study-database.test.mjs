import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { makeReview } from '../src/lib/scheduler.ts';

const db = new PGlite();
const owner = '00000000-0000-4000-8000-000000000001';
const friend = '00000000-0000-4000-8000-000000000002';
const cardId = '00000000-0000-4000-8000-000000000010';
const base = { id: cardId, state: 'REVIEW', nextReviewDate: Date.now() - 86400000, interval: 30, easeFactor: 2.5 };
const rate = event => db.query('select public.record_study_review($1::jsonb) as result', [JSON.stringify(event)]).then(r => r.rows[0].result);
const login = uid => db.query("select set_config('request.jwt.claim.sub',$1,false)", [uid]);
let first;

before(async () => {
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key);
    insert into auth.users values('${owner}'),('${friend}');
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create function public.is_approved() returns boolean language sql stable as $$ select auth.uid() in ('${owner}'::uuid,'${friend}'::uuid) $$;
    create function public.is_sv_admin() returns boolean language sql stable as $$ select auth.uid()='${owner}'::uuid $$;
    create table public.swedish_cards(id uuid primary key, retired boolean default false, front text);
    create table public.cards(id uuid primary key);
    create table public.grammar_cards(id uuid primary key);
    create table public.sv_progress(card_id uuid primary key,state text,next_review timestamptz);
    insert into public.swedish_cards(id,front) values('${cardId}','original content');
    insert into public.cards values('${cardId}');
    insert into public.sv_progress values('${cardId}','REVIEW','2026-09-01T12:00:00Z');
    grant usage on schema auth to authenticated;
  `);
  await db.exec(fs.readFileSync(new URL('../supabase/migrations/202609200001_study_engine.sql', import.meta.url), 'utf8'));
  await login(owner);
});
after(async () => { await db.close(); });

test('migration and first real review preserve legacy content and progress', async () => {
  const beforeProgress = (await db.query('select * from public.sv_progress')).rows;
  assert.equal((await db.query('select public.sv_smooth_backlog(20) as moved')).rows[0].moved, 0);
  first = makeReview(base, 'swedish', 4, 12000).event;
  const saved = await rate(first);
  assert.equal(saved.status, 'applied');
  assert.equal(saved.state.revision, 1);
  assert.equal(saved.state.fsrs.last_review, first.reviewed_at);
  assert.deepEqual((await db.query('select * from public.sv_progress')).rows, beforeProgress);
  assert.equal((await db.query('select front from public.swedish_cards')).rows[0].front, 'original content');
});

test('lost responses can be retried without another event or state transition', async () => {
  assert.equal((await rate(first)).status, 'duplicate');
  assert.equal((await db.query('select count(*)::int as n from public.study_review_events')).rows[0].n, 1);
  await assert.rejects(rate({ ...first, rating: 0 }), /Event ID already used/);
});

test('stale devices and their dependent offline reviews cannot replace newer state', async () => {
  const stale = makeReview(base, 'swedish', 0, 3000);
  assert.equal((await rate(stale.event)).status, 'conflict');
  const dependent = makeReview(stale.updated, 'swedish', 4, 2000, stale.updated.nextReviewDate);
  assert.equal((await rate(dependent.event)).status, 'conflict');
  assert.equal((await rate(stale.event)).status, 'conflict');
  const state = (await db.query('select * from public.study_card_state')).rows[0];
  assert.equal(state.last_event_id, first.id);
  assert.equal(state.revision, 1);
});

test('a malformed review rolls back the event and state together', async () => {
  const next = makeReview({ ...base, fsrs: first.fsrs_after, scheduleRevision: 1, scheduleEventId: first.id }, 'swedish', 4, 2000).event;
  await assert.rejects(rate({ ...next, duration_ms: -1 }));
  assert.equal((await db.query('select count(*)::int as n from public.study_review_events where id=$1', [next.id])).rows[0].n, 0);
  assert.equal((await db.query('select revision from public.study_card_state')).rows[0].revision, 1);
});

test('authorization and row security keep accounts and English-owner cards separate', async () => {
  await login('');
  await assert.rejects(rate(makeReview(base, 'swedish', 4, 1000).event), /Not authorized/);
  await login(friend);
  await assert.rejects(rate(makeReview(base, 'english', 4, 1000).event), /Card unavailable/);
  await db.exec('set role authenticated');
  assert.equal((await db.query('select * from public.study_card_state')).rows.length, 0);
  assert.equal((await db.query('select * from public.study_review_events')).rows.length, 0);
  await assert.rejects(db.query('delete from public.study_card_state'), /permission denied/);
  await db.exec('reset role');
  await login(owner);
});

test('time sync is monotonic, idempotent, and isolated per account', async () => {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Stockholm' }).format(new Date());
  const segment = { id: crypto.randomUUID(), studied_on: day, started_at: `${day}T10:00:00Z`, ended_at: `${day}T10:10:00Z` };
  const sync = data => db.query('select * from public.sync_study_time($1::jsonb)', [JSON.stringify(data)]);
  await sync([segment]);
  await sync([{ ...segment, ended_at: `${day}T10:05:00Z` }]);
  const rows = (await sync([])).rows;
  assert.equal(rows.length, 1);
  assert.equal(new Date(rows[0].ended_at).toISOString(), `${day}T10:10:00.000Z`);
  await assert.rejects(sync([{ ...segment, studied_on: '2000-01-01' }]), /Invalid time segment/);
  await login(friend);
  assert.equal((await sync([])).rows.length, 0);
  await login(owner);
});
