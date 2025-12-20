import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Load Env manually since we are in a script
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
// Use Gemini Flash Latest
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const chunksDir = path.resolve(process.cwd(), "scripts/pdf_chunks");
const outputDir = path.resolve(process.cwd(), "scripts/extracted_json");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function processChunk(filename) {
    const filePath = path.join(chunksDir, filename);
    console.log(`Processing ${filename}...`);

    try {
        // 1. Upload File
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: "application/pdf",
            displayName: filename,
        });
        
        console.log(`Uploaded ${uploadResult.file.displayName} as ${uploadResult.file.uri}`);

        // 2. Wait for Active (usually instant for small files, but good practice)
        let file = await fileManager.getFile(uploadResult.file.name);
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(uploadResult.file.name);
        }
        if (file.state === "FAILED") {
            throw new Error("Video processing failed.");
        }

        // 3. Prompt
        const prompt = `
        You are an expert lexicographer processing a vocabulary textbook ("Oxford Word Skills Advanced").
        Extract every SINGLE vocabulary word/phrase that is being explicitly taught in this section.
        Look for:
        - Words in **bold** within the text.
        - Words in vocabulary lists or tables.
        - Phrasal verbs and idioms.

        For each word, provide:
        1. "word": The word or phrase.
        2. "definition": The definition provided in the text (or a concise advanced definition if implied).
        3. "example": The example sentence from the text containing the word.
        4. "persian": Translation of the word/phrase to Farsi (Persian).

        Ignore:
        - General instructions (e.g., "Match the words...").
        - Table of contents.
        - Index pages (if any).

        Return ONLY a raw JSON Array of objects. Do not use Markdown code blocks.
        Format: [{ "word": "...", "definition": "...", "example": "...", "persian": "..." }]
        `;

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri
                }
            },
            { text: prompt }
        ]);

        const responseText = result.response.text();
        
        // Clean markdown if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        fs.writeFileSync(path.join(outputDir, `${filename}.json`), jsonStr);
        console.log(`Saved ${filename}.json`);

        // Cleanup
        await fileManager.deleteFile(uploadResult.file.name);

    } catch (e) {
        console.error(`Error processing ${filename}:`, e);
    }
}

async function main() {
    const files = fs.readdirSync(chunksDir).filter(f => f.endsWith(".pdf")).sort();
    
    // Process strictly sequentially to avoid rate limits
    for (const file of files) {
        const jsonPath = path.join(outputDir, `${file}.json`);
        if (fs.existsSync(jsonPath)) {
            console.log(`Skipping ${file} (already processed).`);
            continue;
        }

        await processChunk(file);
        // Wait 30 seconds between chunks to avoid Rate Limits (Free Tier)
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
    console.log("All chunks processed.");
}

main();
