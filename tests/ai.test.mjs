import test from 'node:test';
import assert from 'node:assert/strict';
import { generateText } from '../supabase/functions/_shared/openai.mjs';
import { generateCards, validateWords } from '../supabase/functions/generate-flashcards/generate.mjs';

const completed = text => Response.json({ status: 'completed', output: [
  { type: 'message', content: [{ type: 'output_text', text }] },
] });

test('generation keeps input words in order across batches and sends no database writes', async () => {
  const words = Array.from({ length: 12 }, (_, i) => `word ${i}`);
  const batches = [];
  const result = await generateCards(words, { apiKey: 'test-key' }, async (url, request) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(request.body);
    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    const batch = JSON.parse(body.input[0].content);
    batches.push(batch);
    return completed(JSON.stringify({ cards: batch.map(back => ({ back, front: 'ترجمه' })) }));
  });
  assert.deepEqual(batches.map(batch => batch.length), [10, 2]);
  assert.deepEqual(result.cards.map(card => card.back), words);
});

test('rejects missing, oversized, and invalid input before spending tokens', () => {
  for (const value of [null, [], [''], [42], ['x'.repeat(201)], Array(51).fill('word')]) {
    assert.throws(() => validateWords(value));
  }
  assert.deepEqual(validateWords([' word ', 'word']), ['word']);
});

test('rejects missing or invented output words instead of accepting partial data', async () => {
  for (const cards of [[], [{ back: 'wrong word', front: 'ترجمه' }]]) {
    await assert.rejects(generateCards(['resilient'], { apiKey: 'test' }, async () =>
      completed(JSON.stringify({ cards }))), /did not match/);
  }
});

test('rejects incomplete and refused responses instead of parsing them as cards', async () => {
  await assert.rejects(generateText({ apiKey: 'test', messages: [] }, async () =>
    Response.json({ status: 'incomplete', output: [] })), /incomplete/);
  await assert.rejects(generateText({ apiKey: 'test', messages: [] }, async () =>
    Response.json({ status: 'completed', output: [{ content: [{ type: 'refusal' }] }] })), /could not generate/);
});

test('authentication failures keep the status and never expose the provider body', async () => {
  await assert.rejects(generateText({ apiKey: 'test', messages: [] }, async () =>
    Response.json({ error: { message: 'secret-provider-data' } }, { status: 401 })), error => {
      assert.equal(error.status, 401);
      assert.equal(error.message, 'OpenAI request failed (HTTP 401).');
      return true;
    });
});
