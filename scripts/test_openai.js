import assert from 'node:assert/strict';
import { generateText, OPENAI_MODEL } from './lib/openai.cjs';

try {
  const text = await generateText({
    maxOutputTokens: 200,
    messages: [{ role: 'user', content: 'Return only JSON: an object with back equal to resilient, and front containing its natural Persian translation.' }],
  });
  const card = JSON.parse(text);
  assert.equal(card.back, 'resilient');
  assert.match(card.front, /[\u0600-\u06ff]/u);
  console.log(`OpenAI ${OPENAI_MODEL}: flashcard generation verified.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
