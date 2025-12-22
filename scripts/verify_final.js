import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Verifying updates...");
    
    // Check a few items from different batches
    const idsToCheck = [
        "20fff2c6-1687-4343-89e1-5632f8c07f02", // illumination (Batch 7)
        "6a10ed95-a0c2-466f-a3ba-bafbef6249d6", // Deafening (Batch 6)
        "27685601-576e-4e4b-9729-23c2a6f3a3f5"  // Conservative (Batch 5)
    ];

    const { data, error } = await supabase
        .from('cards')
        .select('id, front, back, word_forms')
        .in('id', idsToCheck);

    if (error) {
        console.error("Error:", error);
        return;
    }

    data.forEach(card => {
        console.log(`\nCard: ${card.back} (${card.id})`);
        console.log("Forms:", JSON.stringify(card.word_forms, null, 2));
    });
}

main();
