import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const geminiMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

if (!urlMatch || !keyMatch || !geminiMatch) {
    console.error("Missing credentials in .env");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const genAI = new GoogleGenerativeAI(geminiMatch[1].trim());

// Directory
const wordsDir = path.resolve(process.cwd(), 'words');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function processImage(fileName) {
    const filePath = path.join(wordsDir, fileName);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 

    const prompt = `
    Extract all vocabulary items from this image.
    Return a JSON Array of objects.
    Each object must have:
    - word (The English word/phrase)
    - definition (English definition)
    - persian (Persian translation)
    - examples (Array of 1-2 example sentences found or generated if missing)
    - pronunciation (IPA if visible, or generate it)
    - tone (Formal, Informal, Neutral, Slang, etc.)
    
    OUTPUT FORMAT (JSON ONLY):
    [
      {
        "word": "Example",
        "definition": "A thing characteristic of its kind",
        "persian": "مثال",
        "examples": ["This is a good example."],
        "pronunciation": "/ɪɡˈzɑːmpəl/",
        "tone": "Neutral"
      }
    ]
    `;

    const imagePart = await fileToGenerativePart(filePath, "image/jpeg");

    let attempt = 1;
    while(attempt <= 5) {
        try {
            console.log(`Analyzing ${fileName} (Attempt ${attempt})...`);
            const result = await model.generateContent([prompt, imagePart]);
            const text = result.response.text();
            
            // Clean JSON
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(cleanText);
            return json;
        } catch (e) {
            console.error(`Error processing ${fileName}: ${e.message}`);
            if (e.message.includes("429") || e.message.includes("Quota")) {
                const waitTime = Math.min(attempt * 20000, 60000);
                console.log(`Rate limit, waiting ${waitTime/1000}s...`);
                await delay(waitTime);
                attempt++;
            } else {
                return []; // Non-retriable error?
            }
        }
    }
    return [];
}

async function main() {
    console.log("Starting Image Import...");
    
    const files = fs.readdirSync(wordsDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`Found ${files.length} images.`);
    
    // 1. Fetch Existing Words to Dedup
    // Note: User swapped layout, so 'back' contains the WORD.
    const { data: existingData } = await supabase.from('cards').select('back');
    const existingWords = new Set(existingData.map(c => {
         // Expecting "Word \n Definition" or just "Word" in 'back'.
         // Or sometimes user puts "Word" in back.
         // Let's normalize by taking the first line or splitting by space if it looks like a phrase?
         // Actually, let's just create a set of lowercased full content of 'back' for now
         // and also try to extract the first word.
         // More robust: just check inclusion strings.
         return (c.back || '').toLowerCase();
    }));
    
    // Also check 'front' just in case some weren't swapped.
    const { data: existingFront } = await supabase.from('cards').select('front');
    existingFront.forEach(c => existingWords.add((c.front || '').toLowerCase()));

    let totalAdded = 0;

    for (const file of files) {
        const items = await processImage(file);
        if (!items || items.length === 0) continue;
        
        for (const item of items) {
             const wordKey = item.word.toLowerCase().trim();
             
             // Dedupe Check
             // Simple check: does any existing card contain this word?
             // Checking inclusion might be too aggressive (e.g. "cat" inside "catch").
             // Checking exact match?
             let isDuplicate = false;
             for (const exist of existingWords) {
                 if (exist.includes(wordKey) || wordKey.includes(exist)) {
                     // Potential dupe.
                     // If strict match
                     if (exist === wordKey) {
                         isDuplicate = true; 
                         break;
                     }
                 }
             }
             
             if (isDuplicate) {
                 console.log(`Skipping duplicate: ${item.word}`);
                 continue;
             }

             // Insert
             // Structure requested: Front=Persian, Back=Word+Examples+Pronunciation+Tone
             
             // Construct Back Content
             // User likes: "Word [IPA]\nTone\nExamples"
             
             let backContent = `${item.word}`;
             if (item.pronunciation) backContent += ` ${item.pronunciation}`;
             backContent += `\n\n`; // Spacer
             
             // Actually, formatting via columns is better if we rely on App's UI.
             // But user asked for specific layout.
             // "standard card structure(persian in front, word pronounciation tone and examples on the back)"
             // The App renders specific columns if they exist.
             // If we put everything in 'back' text, it might duplicate if we also fill columns.
             // Let's fill columns correctly and put a minimal 'back' (The Word).
             // The App's `Flashcard.tsx` displays:
             // - H3: card.back (The Word)
             // - Pronunciation (from col)
             // - Tone (from col)
             // - Examples (from col)
             
             // So we just need to map correctly.
             // Front = Persian
             // Back = Word
             
             const newCard = {
                 id: crypto.randomUUID(),
                 front: item.persian || item.definition, // Persian preferred
                 back: item.word,
                 pronunciation: item.pronunciation,
                 tone: item.tone,
                 examples: item.examples || [],
                 state: 'NEW',
                 next_review: new Date().toISOString(),
                 interval: 0,
                 ease_factor: 2.5
             };
             
             const { error } = await supabase.from('cards').insert(newCard);
             if (error) console.error(`Failed to insert ${item.word}: ${error.message}`);
             else {
                 console.log(`Added: ${item.word}`);
                 totalAdded++;
                 existingWords.add(item.word.toLowerCase()); // Add to set to prevent dupe within same batch
             }
        }
        
        // Wait between images to be nice to API
        await delay(5000); 
    }
    
    console.log(`\nImport Complete! Added ${totalAdded} cards.`);
}

main();
