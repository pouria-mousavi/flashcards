// Single source of truth for the active-study-session localStorage key.
// Both App.tsx (reads/restores) and StudySession.tsx (writes progress) import
// this — keeping the literal in one place so they can never drift apart and
// silently lose session progress.
//
// Bump the version suffix to invalidate all in-flight sessions on deploy.
export const SESSION_KEY = 'flashcards_active_session_v2';

// Swedish deck has a COMPLETELY separate session so it can never resume into,
// or get merged with, the English session. Different key = hard isolation.
export const SWEDISH_SESSION_KEY = 'swedish_active_session_v1';

// Remembers which language section the user was last in ('en' | 'sv').
export const ACTIVE_LANGUAGE_KEY = 'flashcards_active_language';
