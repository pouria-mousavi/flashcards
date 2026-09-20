import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

// Exercise the actual Deno entry point without a Supabase instance or API calls.
test('Edge Function only generates previews for an authenticated owner', async () => {
  const originalDeno = globalThis.Deno;
  const originalFetch = globalThis.fetch;
  let handler;
  globalThis.Deno = {
    env: { get: key => ({ SUPABASE_URL: 'https://test.supabase.co', SUPABASE_ANON_KEY: 'anon', OPENAI_API_KEY: 'test' })[key] },
    serve: fn => { handler = fn; },
  };
  try {
    const entry = new URL('../supabase/functions/generate-flashcards/index.ts', import.meta.url);
    const generator = new URL('../supabase/functions/generate-flashcards/generate.mjs', import.meta.url);
    const source = fs.readFileSync(entry, 'utf8').replace("'./generate.mjs'", JSON.stringify(generator.href));
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

    const request = (authorization, words = ['resilient']) => new Request('https://test/function', {
      method: 'POST', headers: authorization ? { Authorization: authorization } : {}, body: JSON.stringify({ words }),
    });
    let calls = [];
    let authenticated = true;
    let admin = false;
    globalThis.fetch = async (url, options = {}) => {
      calls.push({ url, method: options.method || 'GET' });
      if (url.endsWith('/auth/v1/user')) return Response.json(authenticated ? { id: 'owner' } : {}, { status: authenticated ? 200 : 401 });
      if (url.includes('/rest/v1/approved_users')) return Response.json([{ is_admin: admin }]);
      assert.equal(url, 'https://api.openai.com/v1/responses');
      return Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify({ cards: [{ back: 'resilient', front: 'تاب‌آور' }] }) }] }] });
    };

    assert.equal((await handler(request())).status, 401);
    assert.equal(calls.length, 0);
    authenticated = false;
    assert.equal((await handler(request('Bearer invalid'))).status, 401);
    authenticated = true;
    assert.equal((await handler(request('Bearer friend'))).status, 403);
    assert.equal(calls.some(call => call.url.includes('openai.com')), false);
    admin = true;
    assert.equal((await handler(request('Bearer owner', []))).status, 400);
    calls = [];
    const response = await handler(request('Bearer owner'));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).cards[0].back, 'resilient');
    assert.ok(calls.filter(call => call.url.includes('supabase.co')).every(call => call.method === 'GET'));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDeno === undefined) delete globalThis.Deno;
    else globalThis.Deno = originalDeno;
  }
});
