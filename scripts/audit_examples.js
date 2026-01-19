
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function main() {
  // Fetch all cards and count manually to avoid rpc/jsonb restrictions in simple query
  const { data: cards, error } = await supabase
    .from('cards')
    .select('id, examples, created_at', { count: 'exact' })
    .range(0, 4999) // Increase range to verify if more than 1000 exist
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  let needsEnrichment = 0;
  let total = cards.length;
  let recentNeedsEnrichment = 0; // Check last 100 cards

  const candidates = [];

  cards.forEach((c, index) => {
    let count = 0;
    if (Array.isArray(c.examples)) {
      count = c.examples.length;
    }
    
    if (count < 4) {
      needsEnrichment++;
      if (index < 100) recentNeedsEnrichment++;
      if (candidates.length < 50) {
          // Collect IDs/words for manual batch if needed, but we need 'back' (English) to generate.
          // We'll fetch 'back' in a separate run or modify select if needed.
          // For now just counting.
      }
    }
  });

  console.log(`Total Cards: ${total}`);
  console.log(`Cards having < 4 examples: ${needsEnrichment}`);
  console.log(`Recent 100 cards needing enrichment: ${recentNeedsEnrichment}`);
}

main();
