import { supabase } from './supabase';

export interface Role {
  userId: string;
  email: string | null;
  isAdmin: boolean;
}

const FN_URL = 'https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/sv-users';
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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

export function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
}

export function signOut() {
  return supabase.auth.signOut();
}

export function changePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}

// Gated sign-up via the edge function (invite code + user cap enforced server-side).
export async function signupWithCode(email: string, password: string, code: string): Promise<{ error?: string }> {
  try {
    const data = await callFn({ action: 'signup', email: email.trim().toLowerCase(), password, code: code.trim() });
    if (data.error) return { error: data.error };
    return {};
  } catch {
    return { error: 'Network error. Please try again.' };
  }
}

// Who is the currently-signed-in user? Returns null ONLY for a genuine
// "signed out / not approved" state. THROWS on a transient network/DB error, so
// callers can retry instead of falsely logging a valid user out on a blip.
export async function fetchRole(): Promise<Role | null> {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  if (!user) return null;
  const { data, error } = await supabase.from('approved_users').select('is_admin').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { userId: user.id, email: user.email ?? null, isAdmin: !!data.is_admin };
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
