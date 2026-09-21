import test, { after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://test.local/', pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
document.hasFocus = () => true;
// Run the real time hook, with manual clock ticks instead of waiting 20 minutes.
const intervals = new Map();
let intervalId = 0;
window.setInterval = callback => { intervals.set(++intervalId, callback); return intervalId; };
window.clearInterval = id => intervals.delete(id);
let now = Date.parse('2026-09-21T10:00:00Z');
const originalNow = Date.now;
Date.now = () => now;

const bundle = await build({
  stdin: { contents: `
    export { default as Swedish } from './src/components/SwedishStudySession';
    export { default as English } from './src/components/StudySession';
    export { default as Home } from './src/components/SwedishDashboard';
    export { StudyTimeBudget, browserStudyTimeStorage } from './src/lib/studyTime';
  `, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic',
  define: { 'import.meta.env': JSON.stringify({ VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_ANON_KEY: 'test-public-key' }) },
  plugins: [{ name: 'silent-audio', setup(build) {
    build.onLoad({ filter: /[\\/]lib[\\/]tts\.ts$/ }, () => ({ contents: 'export const playTTS = () => {};', loader: 'ts' }));
    build.onLoad({ filter: /[\\/]lib[\\/]supabase\.ts$/ }, () => ({ contents: 'export const supabase = {};', loader: 'ts' }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
const ui = module.exports;
const host = document.getElementById('root');
let root;
const noop = () => {};
const card = { id: 'a', front: 'first question', back: 'en bok', frontLang: 'en', backLang: 'sv', state: 'REVIEW', nextReviewDate: now - 1000, interval: 1, easeFactor: 2.5, createdAt: now, word: 'first question', definition: 'an answer' };
async function mount(Component, props) {
  root = createRoot(host);
  await act(async () => { root.render(createElement(Component, props)); });
  await act(async () => { await new Promise(r => setTimeout(r, 10)); });
}
function button(label) {
  const found = [...host.querySelectorAll('button')].find(b => b.textContent.trim().toLowerCase().startsWith(label.toLowerCase()));
  assert.ok(found, `Button missing: ${label}`);
  return found;
}
const click = async label => act(async () => button(label).click());
async function tick(ms) {
  now += ms;
  await act(async () => { for (const fn of [...intervals.values()]) fn(); });
}
afterEach(async () => { if (root) await act(async () => root.unmount()); root = null; });
after(() => { Date.now = originalNow; dom.window.close(); });

for (const language of ['Swedish', 'English']) {
  test(`${language}: reaching the daily guide does not interrupt the current answer or offer another card`, async () => {
    const uid = `finish-${language}`;
    const budget = new ui.StudyTimeBudget(uid, ui.browserStudyTimeStorage);
    budget.start(now - 20 * 60000 + 2000); budget.pause(now);
    const reviews = [];
    await mount(ui[language], { userId: uid, cards: [card, { ...card, id: 'b', front: 'second question' }], onPause: noop, onSessionComplete: noop, onDeleteCard: noop, onUpdateCard: (card, event) => reviews.push(event) });
    await tick(3000);
    assert.ok(button('Show answer'));
    assert.doesNotMatch(host.textContent, /Let it settle/);
    await click('Show answer');
    await click('Good');
    assert.equal(reviews.length, 1);
    assert.equal(reviews[0].card_id, 'a');
    assert.match(host.textContent, /Let it settle/);
    assert.doesNotMatch(host.textContent, /second question/);
  });
}

test('Again records its future review but ends the small round without adding retries', async () => {
  let completed = 0;
  const reviews = [];
  await mount(ui.Swedish, { userId: 'again-once', cards: [card], onPause: noop, onSessionComplete: () => completed++, onDeleteCard: noop, onUpdateCard: (updated, event) => reviews.push({ updated, event }) });
  await click('Show answer');
  await click('Again');
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].event.rating, 0);
  assert.ok(reviews[0].updated.nextReviewDate > now);
  assert.equal(completed, 1);
});

test('home notices newly due cards and keeps library tools behind one button', async () => {
  let opened = 0;
  await mount(ui.Home, { userId: 'home', cards: [{ ...card, nextReviewDate: now + 10000 }], onStartStudy: noop, activeLanguage: 'sv', onSwitchLanguage: noop, onOpenGrammar: () => opened++ });
  assert.equal(button('Rest for now').disabled, true);
  await tick(30000);
  assert.equal(button('Study a few cards').disabled, false);
  assert.doesNotMatch(host.textContent, /Grammar help/);
  await click('Your learning space');
  assert.match(host.textContent, /Grammar help/);
  assert.equal(document.activeElement.getAttribute('aria-label'), 'Close learning space');
  await click('Grammar help');
  assert.equal(opened, 1);
  await act(async () => document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.equal(host.querySelector('#learning-space'), null);
});
