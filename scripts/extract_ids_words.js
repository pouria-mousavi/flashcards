
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manualProcessDir = path.resolve(__dirname, '../manual_ai_process');
const allWordsPath = path.join(manualProcessDir, 'all_words.csv');
const testWordsPath = path.join(manualProcessDir, 'test_words.csv');

// Regex to match chunk files: chunk_1.json ... chunk_79.json
const chunkFileRegex = /^chunk_\d+\.json$/;

let allWords = [];

// Read directory
try {
    const files = fs.readdirSync(manualProcessDir);
    
    // Sort files numerically if possible, though not strictly required
    const chunkFiles = files.filter(f => chunkFileRegex.test(f)).sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    console.log(`Found ${chunkFiles.length} chunk files.`);

    for (const file of chunkFiles) {
        const filePath = path.join(manualProcessDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);
            
            if (Array.isArray(json)) {
                json.forEach(item => {
                    if (item.id && item.back) {
                        // Escape quotes in content just in case, though usually simple words
                        const id = item.id;
                        let back = item.back || "";
                        if (back) {
                            allWords.push({ id: id, english_word: back });
                        }
                    }
                });
            } else {
                console.warn(`File ${file} does not contain a JSON array.`);
            }
        } catch (err) {
            console.error(`Error processing ${file}: ${err.message}`);
        }
    }


    // Write all words to JSON
    fs.writeFileSync(path.join(manualProcessDir, 'all_words.json'), JSON.stringify(allWords, null, 2), 'utf8');
    console.log(`Successfully wrote ${allWords.length} records to ${path.join(manualProcessDir, 'all_words.json')}`);

    // Write test file (first 5) to JSON
    const testWords = allWords.slice(0, 5);
    fs.writeFileSync(path.join(manualProcessDir, 'test_words.json'), JSON.stringify(testWords, null, 2), 'utf8');
    console.log(`Successfully wrote test file to ${path.join(manualProcessDir, 'test_words.json')}`);

} catch (err) {

    console.error(`Error reading directory or executing script: ${err.message}`);
}
