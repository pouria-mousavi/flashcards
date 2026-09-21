import { SESSION_KEY, SWEDISH_SESSION_KEY, ACTIVE_LANGUAGE_KEY } from './session.ts';

interface Storage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }

/** Clear only the owner's round pointers, once per device. Never clear reviews. */
export function applyFreshStart(storage: Storage, uid: string, isOwner: boolean): boolean {
  if (!isOwner) return false;
  const marker = `sv:fresh-start:calm-v1:${uid}`;
  try {
    if (storage.getItem(marker)) return false;
    for (const key of [SESSION_KEY, SWEDISH_SESSION_KEY]) {
      const raw = storage.getItem(key);
      if (!raw) continue;
      let saved;
      try { saved = JSON.parse(raw); } catch { saved = null; }
      if (!saved?.uid || saved.uid === uid) storage.removeItem(key);
    }
    storage.setItem(ACTIVE_LANGUAGE_KEY, 'sv');
    storage.setItem(marker, '1');
    return true;
  } catch { return false; }
}
