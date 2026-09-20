import { generateCards, validateWords } from './generate.mjs';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, 'Content-Type': 'application/json' },
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Sign in first.' }, 401);
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!url || !anonKey || !apiKey) return json({ error: 'AI generation is not configured.' }, 503);

  try {
    const headers = { apikey: anonKey, Authorization: authorization };
    const auth = await fetch(`${url}/auth/v1/user`, { headers, signal: AbortSignal.timeout(10000) });
    if (!auth.ok) return json({ error: 'Sign in again.' }, 401);
    const user = await auth.json();
    if (!user.id) return json({ error: 'Sign in again.' }, 401);
    const role = await fetch(`${url}/rest/v1/approved_users?select=is_admin&user_id=eq.${encodeURIComponent(user.id)}`, {
      headers, signal: AbortSignal.timeout(10000),
    });
    if (!role.ok) return json({ error: 'Could not verify access. Try again.' }, 503);
    const rows = await role.json();
    if (!rows.some((row: { is_admin: boolean }) => row.is_admin === true)) {
      return json({ error: 'Only the owner can generate English cards.' }, 403);
    }

    let words: string[];
    try { words = validateWords((await req.json()).words); }
    catch { return json({ error: 'Send 1–50 words or phrases, each at most 200 characters.' }, 400); }

    // Generation returns a preview only. This function never writes to Supabase.
    return json(await generateCards(words, { apiKey, model: Deno.env.get('OPENAI_MODEL') }));
  } catch {
    return json({ error: 'Could not generate cards. Please try again.' }, 502);
  }
});
