import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    // 1. Total Count
    const { count: total, error: cErr } = await supabase.from('cards').select('*', { count: 'exact', head: true });
    
    // 2. Count by State
    // We can't do group by easily with simple client, so let's just sample or check 'new'
    const { count: newCards } = await supabase.from('cards').select('*', { count: 'exact', head: true }).eq('state', 'NEW');
    const { count: learning } = await supabase.from('cards').select('*', { count: 'exact', head: true }).eq('state', 'LEARNING');
    const { count: review } = await supabase.from('cards').select('*', { count: 'exact', head: true }).eq('state', 'REVIEW');
    
    console.log(`Total Cards: ${total}`);
    console.log(`New: ${newCards}`);
    console.log(`Learning: ${learning}`);
    console.log(`Review: ${review}`);
    
    // Check recent imports (Oxford)
    // Assuming they have a specific tag or we can check by created_at if possible, but schema might not have it.
    // Let's just lookup a specific word we know is from Oxford, e.g. "abacus" or something advanced? 
    // Or just check if count is high (>600).
}

main();
