
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function verify() {
    const targets = ["Flammable", "Get over it", "Spicy", "Vacillate"];
    
    for (const t of targets) {
        const { data } = await supabase.from('cards').select('back, examples').ilike('back', `${t}%`).limit(1);
        if (data && data.length > 0) {
            console.log(`Card: ${data[0].back}`);
            console.log(`Examples Count: ${Array.isArray(data[0].examples) ? data[0].examples.length : 'Not Array'}`);
            console.log('---');
        } else {
            console.log(`Card ${t} not found.`);
        }
    }
}
verify();
