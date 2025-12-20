import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
    try {
        // Since listModels isn't on the client, we have to fetch manually or check if the SDK exposes it via a hidden query or error message.
        // Actually, let's try a simple fetch to the list endpoint.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                   console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log("Error listing models:", data);
        }
    } catch (e) {
        console.error(e);
    }
}

main();
