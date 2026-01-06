import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "csk-h4cdc836ffmc3tv59fvhwjkyx36kef3hk4d6fpjhr395h4mj",
    baseURL: "https://api.cerebras.ai/v1",
});

async function main() {
    try {
        const models = await client.models.list();
        console.log("Available Cerebras Models:");
        models.data.forEach(m => console.log(`- ${m.id}`));
    } catch (e) {
        console.error("Error fetching models:", e.message);
    }
}
main();
