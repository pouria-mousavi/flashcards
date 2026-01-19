import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const chunksDir = path.resolve(process.cwd(), "scripts/pdf_chunks");
const outputDir = path.resolve(process.cwd(), "scripts/extracted_json");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function processChunkWithRetry(filename, retries = 3) {
    const filePath = path.join(chunksDir, filename);
    const jsonPath = path.join(outputDir, `${filename}.json`);

    if (fs.existsSync(jsonPath)) {
        console.log(`Skipping ${filename} (Done)`);
        return;
    }

    console.log(`Processing ${filename}...`);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Upload
            const uploadResult = await fileManager.uploadFile(filePath, {
                mimeType: "application/pdf",
                displayName: filename,
            });

            // Wait for Active
            let file = await fileManager.getFile(uploadResult.file.name);
            while (file.state === "PROCESSING") {
                await delay(2000);
                file = await fileManager.getFile(uploadResult.file.name);
            }
            if (file.state === "FAILED") throw new Error("Processing failed");

            // Generate
            const prompt = `
            Extract ALL vocabulary from this textbook section sections.
            Return a JSON Array: [{ "word": "...", "definition": "...", "example": "...", "persian": "..." }].
            Translate to Persian. Be exhaustive.
            Return ONLY JSON.
            `;

            const result = await model.generateContent([
                { fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri } },
                { text: prompt }
            ]);

            const jsonStr = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Validate JSON
            JSON.parse(jsonStr); 

            fs.writeFileSync(jsonPath, jsonStr);
            console.log(`Saved ${filename}.json`);
            
            // Cleanup
            await fileManager.deleteFile(uploadResult.file.name);
            return; // Success

        } catch (e) {
            console.error(`Error ${filename} (Attempt ${attempt}): ${e.message}`);
            if (e.message.includes("429") || e.message.includes("Quota")) {
                 const waitTime = attempt * 15000; // 15s, 30s, 45s
                 console.log(`Waiting ${waitTime/1000}s...`);
                 await delay(waitTime);
            } else {
                 await delay(5000);
            }
        }
    }
    console.error(`Failed ${filename} after ${retries} attempts.`);
}

async function main() {
    const files = fs.readdirSync(chunksDir).filter(f => f.endsWith(".pdf")).sort();
    
    // Concurrency Limit = 2
    const limit = 2;
    const queue = [...files];
    
    const workers = [];
    for (let i = 0; i < limit; i++) {
        workers.push((async () => {
            while (queue.length > 0) {
                const file = queue.shift();
                if (file) await processChunkWithRetry(file);
            }
        })());
    }
    
    await Promise.all(workers);
    console.log("All chunks processed.");
}

main();
