
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing since dotenv is not installed
const envPath = path.resolve(process.cwd(), '.env');
let env = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) env[key.trim()] = val.trim();
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCards() {
  const wordsToCheck = [
    "burdened", "faculty", "sentient", "immediacy", "transcending",
    "inevitably", "confrontation", "finitude", "humming", "psyche"
  ];

  console.log("Checking for words:", wordsToCheck.join(", "));

  const { data, error } = await supabase
    .from('cards')
    .select('back, front, word_forms, synonyms')
    .in('back', wordsToCheck);

  if (error) {
    console.error("Error fetching cards:", error);
    return;
  }

  console.log(`\nFound ${data.length} out of ${wordsToCheck.length} words.`);
  data.forEach(card => {
    console.log(`\n✅ Found: ${card.back}`);
    console.log(`   Front: ${card.front}`);
    console.log(`   Forms: ${JSON.stringify(card.word_forms)}`);
  });

  if (data.length === 0) {
      console.log("\n⚠️ No cards found from the list!");
  }
}

checkCards();
