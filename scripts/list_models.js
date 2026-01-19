import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

const genAI = new GoogleGenerativeAI(apiKeyMatch[1].trim());

async function main() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        // GenerativeModel doesn't have listModels directly on it in this SDK version usually?
        // Actually, the SDK might not expose listModels easily without looking at docs.
        // But the error message said "Call ListModels". 
        // Let's try to infer or just use a known one.
        // Actually, newer SDKs use a clear pattern.
        
        console.log("Testing models...");
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.0-pro", "gemini-pro", "gemini-flash-latest"];
        
        for (const m of models) {
             try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Test");
                console.log(`✅ ${m} WORKS`);
             } catch (e) {
                 console.log(`❌ ${m} FAILED: ${e.message}`);
             }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
