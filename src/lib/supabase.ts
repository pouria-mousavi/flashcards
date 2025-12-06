
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing!');
}

// We interpret 'undefined' as empty string to prevent rash, but we must handle it in UI.
// Using 'as string' to satisfy TS for now, but we will check validity in App.tsx
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
export const isConfigured = !!(supabaseUrl && supabaseAnonKey);
