import { createClient } from 'jsr:@supabase/supabase-js@2';

// Server-side gate for account creation. The invite code and the user cap live
// here (never shipped to the browser). Rotate the code by redeploying.
const INVITE_CODE = 'svenska-fika-7k92';
const MAX_USERS = 15;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const svc = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  const action = String(body.action || '');

  // --- Public: gated signup ---
  if (action === 'signup') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const code = String(body.code || '');
    if (code !== INVITE_CODE) return json({ error: 'That invite code is not valid.' }, 403);
    if (!email || !email.includes('@')) return json({ error: 'Enter a valid email address.' }, 400);
    if (password.length < 6) return json({ error: 'Password must be at least 6 characters.' }, 400);

    // Cap check — fail CLOSED: if the count query itself errors, refuse rather
    // than silently letting signups past the cap (count:null would coerce to 0).
    const { count, error: cntErr } = await svc.from('approved_users').select('*', { count: 'exact', head: true });
    if (cntErr) return json({ error: 'Could not verify availability right now. Please try again.' }, 503);
    if ((count ?? 0) >= MAX_USERS) return json({ error: 'This app is full — ask the owner for a spot.' }, 403);

    const { data: created, error: cErr } = await svc.auth.admin.createUser({ email, password, email_confirm: true });
    if (cErr || !created?.user) {
      const dup = /already|registered|exists/i.test(cErr?.message || '');
      // Never surface the raw GoTrue error to the caller; keep a helpful (but
      // non-secret) hint for the common duplicate-email case.
      return json({ error: dup ? 'That email is already registered — just log in.' : 'Could not create the account. Check your details or try logging in.' }, 400);
    }

    const { data: inserted, error: aErr } = await svc.from('approved_users')
      .insert({ user_id: created.user.id, email, is_admin: false })
      .select('created_at').single();
    if (aErr || !inserted) {
      const { error: delErr } = await svc.auth.admin.deleteUser(created.user.id);
      if (delErr) console.error('signup rollback failed — orphaned auth user', created.user.id, delErr.message);
      return json({ error: 'Could not finalize the account. Please try again.' }, 500);
    }

    // Close the check-then-create race (TOCTOU): the cap check above is not
    // atomic with the insert, so concurrent signups could all pass it. Recheck
    // by creation rank — if THIS row landed beyond the cap, roll it back.
    const { count: rank, error: rankErr } = await svc.from('approved_users')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', inserted.created_at);
    if (!rankErr && (rank ?? 0) > MAX_USERS) {
      await svc.from('approved_users').delete().eq('user_id', created.user.id);
      const { error: delErr } = await svc.auth.admin.deleteUser(created.user.id);
      if (delErr) console.error('over-cap rollback failed — orphaned auth user', created.user.id, delErr.message);
      return json({ error: 'This app is full — ask the owner for a spot.' }, 403);
    }
    return json({ ok: true });
  }

  // --- Admin-only actions (manual JWT check since verify_jwt is off) ---
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Not authorized.' }, 401);
  const { data: userData } = await svc.auth.getUser(token);
  const caller = userData?.user;
  if (!caller) return json({ error: 'Not authorized.' }, 401);
  const { data: me } = await svc.from('approved_users').select('is_admin').eq('user_id', caller.id).maybeSingle();
  if (!me?.is_admin) return json({ error: 'Admins only.' }, 403);

  if (action === 'list') {
    const { data } = await svc.from('approved_users').select('user_id, email, is_admin, created_at').order('created_at');
    return json({ users: data ?? [] });
  }

  if (action === 'config') {
    const { count } = await svc.from('approved_users').select('*', { count: 'exact', head: true });
    return json({ code: INVITE_CODE, max: MAX_USERS, count: count ?? 0 });
  }

  if (action === 'delete') {
    const userId = String(body.userId || '');
    if (!userId) return json({ error: 'Missing user.' }, 400);
    if (userId === caller.id) return json({ error: "You can't delete yourself." }, 400);
    const { data: target } = await svc.from('approved_users').select('is_admin').eq('user_id', userId).maybeSingle();
    if (target?.is_admin) return json({ error: "You can't delete another admin." }, 400);
    const { error } = await svc.auth.admin.deleteUser(userId);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Unknown action.' }, 400);
});
