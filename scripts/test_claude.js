import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_KEY = process.env.CLAUDE_KEY || "";
const anthropic = new Anthropic({
  apiKey: CLAUDE_KEY, 
});

async function testModel(model) {
    process.stdout.write(`Testing ${model}... `);
    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 10,
            messages: [{ role: "user", content: "Hi" }]
        });
        console.log(`✅ OK`);
        return true;
    } catch (e) {
        console.log(`❌ FAIL (${e.status || e.type})`);
        return false;
    }
}

    await testModel("claude-sonnet-4-5-20250929");    // User Requested Specific Model
    await testModel("claude-3-5-sonnet-20241022");    // Fallback standard

main();
