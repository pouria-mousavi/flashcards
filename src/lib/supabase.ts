
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing!');
}

// We interpret 'undefined' as empty string to prevent rash, but we must handle it in UI.
// Using 'as string' to satisfy TS for now, but we will check validity in App.tsx
//
// persistSession + autoRefreshToken keep users signed in across reloads and app
// relaunches — the session is stored in the browser and its token auto-refreshes,
// so nobody has to log in every time they open the link. (These are the library
// defaults; set explicitly so the behavior is guaranteed and obvious.)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  { auth: { persistSession: true, autoRefreshToken: true } },
);
export const isConfigured = !!(supabaseUrl && supabaseAnonKey);
