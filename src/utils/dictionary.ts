export interface DictionaryDefinition {
  pos: string;
  def: string;
}

export interface CollectedWord {
  word: string;
  definitions: DictionaryDefinition[];
  timestamp: number;
}

// In-memory cache so repeated lookups are instant
const cache = new Map<string, DictionaryDefinition[] | null>();

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Look up a word using the Free Dictionary API.
 * Results are cached in memory so subsequent lookups are instant.
 */
export async function lookupWord(word: string): Promise<DictionaryDefinition[] | null> {
  const normalized = word.toLowerCase().trim();
  if (!normalized || normalized.length < 2) return null;

  // Return from cache if available
  if (cache.has(normalized)) return cache.get(normalized)!;

  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(normalized)}`);
    if (!res.ok) {
      cache.set(normalized, null);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      cache.set(normalized, null);
      return null;
    }

    const definitions: DictionaryDefinition[] = [];
    for (const entry of data) {
      if (!entry.meanings) continue;
      for (const meaning of entry.meanings) {
        const pos = meaning.partOfSpeech || '';
        for (const def of meaning.definitions || []) {
          if (def.definition) {
            definitions.push({ pos, def: def.definition });
          }
        }
      }
    }

    const result = definitions.length > 0 ? definitions : null;
    cache.set(normalized, result);
    return result;
  } catch {
    // Network error — don't cache so it can be retried
    return null;
  }
}
