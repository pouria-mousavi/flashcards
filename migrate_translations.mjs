import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://dgqkwzuykhmcxvajumne.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncWt3enV5a2htY3h2YWp1bW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTY1MjUsImV4cCI6MjA4MDYzMjUyNX0.GTaS-pT_XF_0v-a_Zx9cwodyaBFEnsFYyP3i2AUNP1s'
);

const cards = JSON.parse(readFileSync('/Users/pouriamousavi/Desktop/all_words_translated.json', 'utf8'));

console.log(`Loaded ${cards.length} cards from JSON`);

// Progress fields we must NOT touch
const PROGRESS_FIELDS = ['state', 'next_review', 'interval', 'ease_factor', 'user_notes', 'review_count', 'lapse_count'];

let success = 0;
let failed = 0;
let errors = [];

// Process in batches of 20 concurrent
const BATCH_SIZE = 20;

for (let i = 0; i < cards.length; i += BATCH_SIZE) {
  const batch = cards.slice(i, i + BATCH_SIZE);

  const results = await Promise.allSettled(
    batch.map(async (card) => {
      // Only update translation-related fields, NOT progress
      const updateData = {
        front: card.front,
        back: card.back,
        pronunciation: card.pronunciation,
        tone: card.tone,
        examples: card.examples,
        word_forms: card.word_forms,
        other_meanings: card.other_meanings,
        native_speaking: card.native_speaking,
      };

      const { error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', card.id);

      if (error) throw { id: card.id, back: card.back, error: error.message };
      return card.id;
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      success++;
    } else {
      failed++;
      errors.push(r.reason);
    }
  }

  if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= cards.length) {
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, cards.length)}/${cards.length} | ✅ ${success} | ❌ ${failed}`);
  }
}

console.log(`\n=== DONE ===`);
console.log(`✅ Updated: ${success}`);
console.log(`❌ Failed: ${failed}`);
if (errors.length > 0) {
  console.log(`\nFailed cards:`);
  errors.forEach(e => console.log(`  - ${e.back}: ${e.error}`));
}

// Verify progress wasn't touched
const { data: sample } = await supabase
  .from('cards')
  .select('state, next_review, interval, ease_factor')
  .not('state', 'eq', 'NEW')
  .limit(5);

console.log(`\n=== Progress verification (5 non-NEW cards) ===`);
sample?.forEach(c => console.log(`  state=${c.state} interval=${c.interval} ef=${c.ease_factor} next=${c.next_review}`));
