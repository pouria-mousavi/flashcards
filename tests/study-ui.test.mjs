import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

// Render the real React components without a browser or a live backend.
const result = await build({
  stdin: {
    contents: `
      export { default as English } from './src/components/StudySession';
      export { default as Swedish } from './src/components/SwedishStudySession';
      export { default as Dashboard } from './src/components/Dashboard';
      export { default as SwedishDashboard } from './src/components/SwedishDashboard';
      export { default as SwedishCard } from './src/components/SwedishCard';
      export { StudyTimeBudget, browserStudyTimeStorage } from './src/lib/studyTime';
      export { createElement } from 'react';
      export { renderToStaticMarkup as render } from 'react-dom/server';
    `,
    resolveDir: process.cwd(), loader: 'tsx',
  },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
  jsx: 'automatic', define: { 'import.meta.env': JSON.stringify({ VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_ANON_KEY: 'test-public-key' }) },
});
const storage = new Map();
globalThis.localStorage = {
  get length() { return storage.size; },
  key: i => [...storage.keys()][i] ?? null,
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
};
globalThis.document = { documentElement: { dataset: {}, setAttribute: () => {} } };
const module = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
const ui = module.exports;
const now = Date.parse('2026-09-15T12:00:00Z');
const originalNow = Date.now;
Date.now = () => now;
after(() => { Date.now = originalNow; });
const card = {
  id: 'card', front: 'A useful question', back: 'En användbar fråga', frontLang: 'en', backLang: 'sv',
  state: 'LEARNING', nextReviewDate: now + 10 * 60000, interval: 10, easeFactor: 2.5, createdAt: now,
};
const noop = () => {};
const props = {
  cards: [card], onPause: noop, onSessionComplete: noop, onUpdateCard: noop, onDeleteCard: noop,
  onStartStudy: noop, onAddCard: noop, activeLanguage: 'sv', onSwitchLanguage: noop,
};

test('both study screens let future learning cards wait without revealing or grading', () => {
  for (const Component of [ui.English, ui.Swedish]) {
    const html = ui.render(ui.createElement(Component, { ...props, userId: 'waiting' }));
    assert.match(html, /A little pause/);
    assert.match(html, /when they’re ready/);
    assert.doesNotMatch(html, /Show Answer|En användbar fråga/);
  }
});

test('both study screens stop at the shared budget and preserve the option to leave', () => {
  const budget = new ui.StudyTimeBudget('finished', ui.browserStudyTimeStorage);
  budget.start(now - 20 * 60000);
  budget.pause(now);
  for (const Component of [ui.English, ui.Swedish]) {
    const html = ui.render(ui.createElement(Component, { ...props, userId: 'finished', cards: [{ ...card, nextReviewDate: now - 1 }] }));
    assert.match(html, /Let it settle/);
    assert.match(html, /Back home/);
    assert.doesNotMatch(html, /Show Answer|En användbar fråga/);
  }
});

test('dashboards invite a small round without countdowns, backlog counts or progress panels', () => {
  for (const Component of [ui.Dashboard, ui.SwedishDashboard]) {
    const html = ui.render(ui.createElement(Component, {
      ...props, userId: 'fresh', cards: Array.from({ length: 268 }, (_, i) => ({ ...card, id: String(i), state: 'REVIEW', nextReviewDate: now - 1 })),
    }));
    assert.match(html, /Study a few cards/);
    assert.match(html, /Your learning space/);
    assert.doesNotMatch(html, /minutes left|268|reviews waiting|Your progress|Grammar help/);
  }
});

test('dashboards stop offering more sessions once the daily budget is used', () => {
  for (const Component of [ui.Dashboard, ui.SwedishDashboard]) {
    const html = ui.render(ui.createElement(Component, { ...props, userId: 'finished', hasActiveSession: true }));
    assert.match(html, /Let it settle/);
    assert.match(html, /disabled=""/);
    assert.doesNotMatch(html, /Resume studying/);
  }
});

test('grammar notes are optional reference text and never Swedish audio prompts', () => {
  const html = ui.render(ui.createElement(ui.SwedishCard, { card: { ...card, examples: [
    { text: 'English grammar explanation', kind: 'note', source: 'TB p.79' },
    { text: 'Jag läser en bok.', translation: 'I am reading a book.' },
  ] }, isFlipped: true, onFlip: noop }));
  assert.match(html, /<details><summary[^>]*>A little help/);
  assert.match(html, /Source: TB p.79/);
  assert.match(html, /I am reading a book/);
  assert.equal((html.match(/Play Svenska audio/g) ?? []).length, 2); // answer + real example
});

test('gap prompts keep the answer hidden and do not read the English hint as Swedish', () => {
  const html = ui.render(ui.createElement(ui.SwedishCard, { card: {
    ...card, front: 'Jag har två ___ hus.\n(small — plural of liten)', frontLang: 'sv', back: 'små',
    examples: [{ text: 'Jag har två små hus.', translation: 'I have two small houses.' }],
  }, isFlipped: false, onFlip: noop }));
  assert.match(html, /Fill in the gap/);
  assert.doesNotMatch(html, /små|Play Svenska audio|In everyday life/);
});
