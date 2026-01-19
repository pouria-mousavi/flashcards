import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

// Manual Fix List
const fixes = [
    { type: 'DEL', id: '80e9ec53-1f9b-4ba3-b0b2-4c009c3bade3' }, // bore
    { type: 'DEL', id: '00651a86-9e6a-49a9-8e92-0f02d49d6c1e' }, // reckon up
    
    // Updates
    { 
      type: 'UPD', id: '485e0d75-5170-4f1e-9cb9-3e2aee986825', 
      changes: { examples: ["He ruthlessly exploited the situation.", "Companies shouldn't exploit their workers."] }
    },
    {
      type: 'UPD', id: '6f894fb3-c9a8-4d19-a72a-8c1a71d2c04e', // Overjoyed
      changes: { back: "**Def**: Extremely happy.\n**Farsi**: ذوق‌زده / سر از پا نشناختن" } // Assuming back is Def (Pre-swap? Or Post-swap?)
      // Wait, if I run swap first, 'front' will be Def. 
      // User note was "Better Persian". 
      // I should update the "Meaning" side. Which is Front after swap.
      // But I don't know if swap ran.
      // Safest: Update both if unsure? Or check content.
      // Let's assume Swap hasn't run or we update `back` assuming typical structure, 
      // actually, let's just update `synonyms` or `tone` if possible? No.
      // Let's just SET `front` and `back` explicitly to what we want.
      // Desired: Front = Meaning, Back = Word.
      // Word: "overjoyed".
      // Meaning: "Extremely happy / ذوق‌زده".
    },
    {
        type: 'SET', id: '6f894fb3-c9a8-4d19-a72a-8c1a71d2c04e',
        front: "**Def**: Extremely happy.\n**Farsi**: ذوق‌زده / سر از پا نشناختن",
        back: "overjoyed"
    },
    {
        type: 'SET', id: '77d35138-e4ec-4f7d-a6d1-c8ca366015cf',
        front: "**Def**: A gardening tool.\n**Farsi**: کج‌بیل (Hoe)",
        back: "hoe"
    },
    {
        type: 'SET', id: 'e600b45d-6f1c-4997-8106-6921714adad1', // olfactory bulb
        front: "**Def**: Brain structure for smell.\n**Farsi**: پیاز بویایی",
        back: "olfactory bulb"
    },
    {
        type: 'SET', id: '49018d38-cff3-42c6-a45a-8d0f56c062b1', // astringent?
        front: "**Def**: Quality of dryness in mouth.\n**Farsi**: گس / گس‌بودن",
        back: "astringency"
    },
    {
        type: 'SET', id: '2556181d-2917-409c-94a2-36f68974f2ec', // non-committal
        front: "**Def**: Avoiding clear answer.\n**Farsi**: طفره‌رونده / دوپهلو",
        back: "non-committal"
    },
    {
        type: 'SET', id: '1c685276-187c-46d3-91d4-2755aa9c7253', // steady on
        front: "**Def**: Warning to be calm.\n**Farsi**: آروم باش! (هشدار)",
        back: "Steady on!"
    },
    {
        type: 'UPD', id: 'cf2e5678-2407-4bf8-9d4e-4ccd1ae33931', // Spam note
        changes: {} // No changes, just clear note
    },
    {
        type: 'UPD', id: '76ff569d-e5f5-40e9-be4a-9378b0d9d087',
        changes: { examples: ["Please consider the environment.", "She considered him a genius."] }
    }
];

async function main() {
    console.log("Applying Manual Fixes...");
    for (const fix of fixes) {
        if (fix.type === 'DEL') {
            await supabase.from('cards').delete().eq('id', fix.id);
            console.log(`Deleted ${fix.id}`);
        } else if (fix.type === 'SET') {
            await supabase.from('cards').update({ ...fix, user_notes: null, type: undefined }).eq('id', fix.id); // type undefined to avoid sending it
            console.log(`Set ${fix.id}`);
        } else {
            await supabase.from('cards').update({ ...fix.changes, user_notes: null }).eq('id', fix.id);
            console.log(`Updated ${fix.id}`);
        }
    }
    console.log("Done.");
}

main();
