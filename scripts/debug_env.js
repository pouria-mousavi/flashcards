
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
let manualEnv = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key && val) manualEnv[key] = val;
        }
    });
}

const keysToCheck = ['VITE_CLAUDE_KEY', 'VITE_GEMINI_API_KEY', 'VITE_SUPABASE_URL'];

console.log("--- Process Env ---");
keysToCheck.forEach(k => {
    const val = process.env[k];
    console.log(`${k}: ${val ? `Present (len=${val.length}, start=${val.substring(0,4)}...)` : 'Missing'}`);
});

console.log("\n--- Manual .env Parse ---");
keysToCheck.forEach(k => {
    const val = manualEnv[k];
    console.log(`${k}: ${val ? `Present (len=${val.length}, start=${val.substring(0,4)}...)` : 'Missing'}`);
});
