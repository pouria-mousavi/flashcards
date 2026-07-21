import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

export interface Role {
  userId: string;
  email: string | null;   // display identity: the chosen username for friends, real email for the owner
  isAdmin: boolean;
}

const FN_URL = 'https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/sv-users';
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Friends sign in with a USERNAME — no email required. Supabase Auth is
// email-based, so each username maps to a synthetic address behind the scenes.
// The owner still signs in with their real email; any input containing '@' is
// treated as a real email and passed through untouched.
const SV_DOMAIN = 'svenska.local';
export function toLoginEmail(usernameOrEmail: string): string {
  const v = usernameOrEmail.trim();
  return v.includes('@') ? v.toLowerCase() : `${v.toLowerCase()}@${SV_DOMAIN}`;
}
// Turn a stored identity back into something friendly to show (strips the
// synthetic domain if present; leaves a real email or a bare username as-is).
export function displayName(identity: string | null | undefined): string {
  if (!identity) return '';
  return identity.endsWith(`@${SV_DOMAIN}`) ? identity.slice(0, -(SV_DOMAIN.length + 1)) : identity;
}

async function callFn(bodyObj: Record<string, unknown>, withAuth = false): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', apikey: ANON };
  if (withAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  }
  const res = await fetch(FN_URL, { method: 'POST', headers, body: JSON.stringify(bodyObj) });
  let data: any = {};
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) return { error: data.error || `Request failed (${res.status}).` };
  return data;
}

export function signIn(usernameOrEmail: string, password: string) {
  return supabase.auth.signInWithPassword({ email: toLoginEmail(usernameOrEmail), password });
}

export function signOut() {
  return supabase.auth.signOut();
}

export function changePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}

// Gated sign-up via the edge function. Friends choose a USERNAME (+ password);
// the server maps it to a synthetic email and enforces the invite code + cap.
export async function signupWithCode(username: string, password: string, code: string): Promise<{ error?: string }> {
  try {
    const data = await callFn({ action: 'signup', username: username.trim(), password, code: code.trim() });
    if (data.error) return { error: data.error };
    return {};
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

// Resolve the app role from a Supabase session. Reads the user straight from
// the session — it must NEVER call supabase.auth.getUser(), because doing that
// inside an onAuthStateChange callback re-enters the auth lock and deadlocks the
// whole app on load (hangs on "Loading…"). Returns null for a genuine
// signed-out / not-approved state — including a since-deleted account, whose
// approved_users row is gone, so it lands on the login screen instead of
// hanging. THROWS on a transient DB error so callers can retry.
export async function roleForSession(session: Session | null): Promise<Role | null> {
  const user = session?.user;
  if (!user) return null;
  const { data, error } = await supabase.from('approved_users').select('is_admin').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  // Prefer the chosen username (stored in user metadata at signup) for display;
  // fall back to the email for the owner's real-email account.
  const uname = (user.user_metadata?.username as string | undefined) ?? null;
  return { userId: user.id, email: uname ?? user.email ?? null, isAdmin: !!data.is_admin };
}

export interface AdminUser { user_id: string; email: string | null; is_admin: boolean; created_at: string; }

export async function adminListUsers(): Promise<{ users?: AdminUser[]; error?: string }> {
  try {
    const data = await callFn({ action: 'list' }, true);
    if (data.error) return { error: data.error };
    return { users: data.users };
  } catch { return { error: 'Network error.' }; }
}

export async function adminDeleteUser(userId: string): Promise<{ error?: string }> {
  try {
    const data = await callFn({ action: 'delete', userId }, true);
    if (data.error) return { error: data.error };
    return {};
  } catch { return { error: 'Network error.' }; }
}

export async function adminConfig(): Promise<{ code?: string; max?: number; count?: number; error?: string }> {
  try {
    const data = await callFn({ action: 'config' }, true);
    if (data.error) return { error: data.error };
    return data;
  } catch { return { error: 'Network error.' }; }
}
