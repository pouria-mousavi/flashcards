export interface Flashcard {
  id: string;
  front: string;
  back: string;
  pronunciation?: string;
  examples?: string[];
  tone?: string;
}

export function parseFlashcards(text: string): Flashcard[] {
  const lines = text.split('\n');
  const cards: Flashcard[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Expected format:
    // Front | Back -- Pronunciation: /.../ -- Ex: 1. ... 2. ... -- Tone: ...

    // 1. Split Front and the rest
    const parts = line.split('|');
    if (parts.length < 2) continue; // Invalid line

    const front = parts[0].trim();
    let rest = parts.slice(1).join('|').trim();

    // 2. Extract Back (everything before the first " -- ")
    const backEndIndex = rest.indexOf(' -- ');
    let back = rest;
    let meta = '';

    if (backEndIndex !== -1) {
      back = rest.substring(0, backEndIndex).trim();
      meta = rest.substring(backEndIndex);
    }

    // 3. Extract Metadata
    const pronunciationMatch = meta.match(/-- Pronunciation: (.*?) (--|$)/);
    const examplesMatch = meta.match(/-- Ex: (.*?) (--|$)/);
    const toneMatch = meta.match(/-- Tone: (.*?) (--|$)/);

    const pronunciation = pronunciationMatch ? pronunciationMatch[1].trim() : undefined;
    const tone = toneMatch ? toneMatch[1].trim() : undefined;

    let examples: string[] = [];
    if (examplesMatch) {
      const exText = examplesMatch[1].trim();
      // Split by "1. ", "2. ", etc.
      examples = exText.split(/\d+\.\s+/).filter(ex => ex.trim().length > 0);
    }

    cards.push({
      id: crypto.randomUUID(), // Generate unique ID
      front,
      back,
      pronunciation,
      examples,
      tone
    });
  }
  return cards;
}
