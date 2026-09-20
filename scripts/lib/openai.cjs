const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');

const root = path.resolve(__dirname, '../..');
const env = {};
for (const name of ['.env', '.env.local']) {
  const file = path.join(root, name);
  if (fs.existsSync(file)) Object.assign(env, parseEnv(fs.readFileSync(file, 'utf8')));
}
Object.assign(env, process.env);

const OPENAI_MODEL = env.OPENAI_MODEL || 'gpt-4.1-mini-2025-04-14';
const OPENAI_AUDIT_MODEL = env.OPENAI_AUDIT_MODEL || 'gpt-4.1-2025-04-14';

async function generateText(options) {
  const core = await import('../../supabase/functions/_shared/openai.mjs');
  return core.generateText({ apiKey: env.OPENAI_API_KEY, model: OPENAI_MODEL, ...options });
}

module.exports = { generateText, OPENAI_MODEL, OPENAI_AUDIT_MODEL, env };
