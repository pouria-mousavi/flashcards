import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "csk-h4cdc836ffmc3tv59fvhwjkyx36kef3hk4d6fpjhr395h4mj",
    baseURL: "https://api.cerebras.ai/v1",
});

const TEST_CASES = [
    "The early bird catches the worm",
    "Watch your mouth",
    "Hit the sack",
    "Piece of cake",
    "It's raining cats and dogs",
    "Break a leg"
];

const MODELS = [
    "llama-3.3-70b",
    // "qwen-3-235b-a22b-instruct-2507" // Need to double check this ID functionality, but assuming it works based on list
    // Actually let's try the simple ID first if it maps? 
    // The list in step 475 showed "qwen-3-235b-a22b-instruct-2507".
    "qwen-3-32b", // Try the small one too just in case
];

// The big one ID is long, let's try to fetch it properly or hardcode what we saw.
const BIG_QWEN = "qwen-3-235b-a22b-instruct-2507"; 

async function testModel(modelName) {
    console.log(`\n--- Testing ${modelName} ---`);
    for (const phrase of TEST_CASES) {
        try {
            const response = await client.chat.completions.create({
                model: modelName,
                messages: [
                    { 
                        role: "system", 
                        content: `You are a Persian Translator. Translate the given English phrase to the MOST COMMON, NATURAL Persian equivalent. 
                        If it matches a Persian proverb, use the proverb.
                        Output ONLY the Persian translation. No explanation.` 
                    },
                    { role: "user", content: phrase }
                ],
                temperature: 0.1,
            });
            console.log(`[${phrase}] -> ${response.choices[0].message.content}`);
        } catch (e) {
            console.error(`Error with ${modelName}:`, e.message);
        }
    }
}

async function main() {
    await testModel("llama-3.3-70b");
    // We try specifically the specific model ID we saw
    // Note: If the ID is wrong the API will confusingly fail, but we saw it in the list.
    // Wait, the list output in Step 475: "qwen-3-235b-a22b-instruct-2507"
    // However, sometimes these are internal IDs. Let's try.
    // I suspect that list might have been a bit weird formatted? 
    // "qwen-3-235b-a22b-instruct-2507" looks like a specific finetune.
    // Let's also try "gpt-oss-120b" (likely a generic name for something else).
    
    // Actually, I'll filter the model list again to be sure I have the exact string.
    const models = await client.models.list();
    const bigQwen = models.data.find(m => m.id.includes('235b') || m.id.includes('qwen') && !m.id.includes('32b'));
    
    if (bigQwen) {
        await testModel(bigQwen.id);
    } else {
        console.log("Could not find Big Qwen, trying qwen-3-32b");
        await testModel("qwen-3-32b");
    }
}

main();
