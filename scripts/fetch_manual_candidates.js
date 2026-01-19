
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function main() {
  // Fetch 1000 latest cards to find candidates
  const { data: cards, error } = await supabase
    .from('cards')
    .select('id, back, examples')
    .order('created_at', { ascending: true })
    .limit(5000);

  if (error) {
    console.error(error);
    return;
  }
  
  // Filter for < 4 examples
  const candidates = cards.filter(c => {
      // If null, we likely caught it before, but include just in case
      if (!c.examples) return true;
      if (!Array.isArray(c.examples)) return true;
      return c.examples.length < 4;
  }).slice(0, 100);

  if (candidates.length === 0) {
      console.log("No more candidates found!");
      return;
  }

  // Sanitize
  const cleanCandidates = candidates.map(c => ({ id: c.id, back: c.back }));

  fs.writeFileSync('current_candidates.json', JSON.stringify(cleanCandidates, null, 2));
  console.log(`Wrote ${cleanCandidates.length} candidates to current_candidates.json`);
}


main();
