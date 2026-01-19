
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const manualData = [
    { word: "It's your funeral", examples: ["You want to argue with him? It's your funeral.", "Go ahead, jump. It's your funeral.", "If you don't study, it's your funeral.", "I warned you; now it's your funeral."] },
    { word: "Not my problem", examples: ["You forgot your wallet? Not my problem.", "I missed the bus. - That's not my problem.", "If they fail, it's not my problem.", "Don't look at me, it's not my problem."] },
    { word: "Don't look at me", examples: ["I didn't break it. Don't look at me.", "Don't look at me! I wasn't even there.", "If you want money, don't look at me.", "Don't look at me for answers."] },
    { word: "I'm innocent", examples: ["I didn't do anything! I'm innocent!", "The jury found him innocent.", "I swear I'm innocent.", "He claims he's innocent."] },
    { word: "I swear", examples: ["I didn't touch it, I swear!", "I swear I'll pay you back.", "Do you swear to tell the truth?", "I swear, it wasn't me."] },
    { word: "On my mother's life", examples: ["I'm telling the truth, on my mother's life.", "I didn't steal it, on my mother's life.", "On my mother's life, I promise.", "I'll fix it, on my mother's life."] },
    { word: "I swear to God", examples: ["I swear to God, I had no idea.", "I swear to God, stop talking.", "I didn't do it, I swear to God.", "I swear to God, this is the last time."] },
    { word: "Believe me", examples: ["It's dangerous out there. Believe me.", "Believe me, you don't want to know.", "I tried my best, believe me.", "Believe me, it's not easy."] },
    { word: "Trust me", examples: ["I know a shortcut. Trust me.", "Trust me, everything will be fine.", "You can trust me.", "Don't trust me? Watch this."] },
    { word: "I'm telling the truth", examples: ["Why won't you believe me? I'm telling the truth.", "I'm telling the truth, officer.", "For once, I'm telling the truth.", "I hope you're telling the truth."] },
    { word: "You're lying", examples: ["Your face is red. You're lying.", "Don't pretend. You're lying.", "I know when you're lying.", "Admit it, you're lying."] },
    { word: "Liar", examples: ["You never went to college! Liar!", "He called me a liar.", "You are such a bad liar.", "Liar, liar, pants on fire!"] },
    { word: "You're making it up", examples: ["Aliens didn't take your homework. You're making it up.", "That story sounds fake. You're making it up.", "Stop making it up.", "Are you telling the truth or making it up?"] },
    { word: "Don't make excuses", examples: ["You're late again. Don't make excuses.", "Don't make excuses for your bad behavior.", "Just do it and don't make excuses.", "Winners don't make excuses."] },
    { word: "Don't justify it", examples: ["Stealing is wrong. Don't justify it.", "Don't try to justify your actions.", "There is no way to justify it.", "Don't justify it with lies."] },
    { word: "I take full responsibility", examples: ["The project failed. I take full responsibility.", "I take full responsibility for the error.", "She refused to take full responsibility.", "As manager, I take full responsibility."] },
    { word: "I regret", examples: ["I regret shouting at you.", "I regret not studying harder.", "Do you regret your decision?", "I regret nothing."] },
    { word: "I wish", examples: ["I wish I hadn't done that.", "I wish I could fly.", "I wish you were here.", "Be careful what you wish for."] },
    { word: "I should have said", examples: ["I should have said sorry earlier.", "I should have said no.", "I should have said something.", "What I should have said was..."] },
    { word: "I shouldn't have done it", examples: ["It was a mistake. I shouldn't have done it.", "I shouldn't have done it, I know.", "I regret it; I shouldn't have done it.", "Why did I do it? I shouldn't have done it."] },
    { word: "It's your fault", examples: ["We missed the bus! It's your fault.", "Don't say it's your fault.", "It's all your fault.", "If we lose, it's your fault."] },
    { word: "Don't blame me", examples: ["You chose this restaurant. Don't blame me.", "Don't blame me for your mistakes.", "If it rains, don't blame me.", "Don't blame me, I voted for the other guy."] },
    { word: "Don't point fingers", examples: ["Let's solve the problem instead of pointing fingers.", "Don't point fingers at others.", "It's rude to point fingers.", "We shouldn't point fingers right now."] },
    { word: "I'm not talking to you", examples: ["Go away. I'm not talking to you.", "I'm not talking to you anymore.", "She's mad and not talking to you.", "I'm not talking to you until you apologize."] },
    { word: "Leave me alone", examples: ["I said leave me alone!", "Just leave me alone, please.", "Why won't you leave me alone?", "Leave me alone to think."] },
    { word: "Get off my case", examples: ["I'll clean my room later. Get off my case.", "Stop nagging me! Get off my case.", "Get off my case about the dishes.", "He told his mom to get off his case."] },
    { word: "Give me some space", examples: ["We need a break. Give me some space.", "Back off and give me some space.", "I just need you to give me some space.", "Can you give me some space?"] },
    { word: "It's time to end this", examples: ["This war has gone on too long. It's time to end this.", "It's time to end this argument.", "I think it's time to end this relationship.", "It's time to end this suffering."] },
    { word: "It's over", examples: ["Our relationship isn't working. It's over.", "The game is over.", "It's over between us.", "Thank god it's over."] },
    { word: "Let's take this outside", examples: ["You wanna fight? Let's take this outside.", "If you want to argue, let's take this outside.", "Let's take this outside and settle it.", "We shouldn't fight here. Let's take this outside."] },
    { word: "Calm down", examples: ["Calm down, it's just a game.", "You need to calm down.", "Everyone please calm down.", "I can't calm down!"] },
    { word: "Chill", examples: ["Dude, just chill.", "Chill out, it's not a big deal.", "We need to chill for a bit.", "Just chill and watch TV."] },
    { word: "Take a deep breath", examples: ["You're panicking. Take a deep breath.", "Take a deep breath and relax.", "Just take a deep breath before you speak.", "Take a deep breath, it will be okay."] },
    { word: "Everything is under control", examples: ["Don't panic. Everything is under control.", "The police said everything is under control.", "I have everything under control.", "Is everything under control here?"] },
    { word: "It's cool", examples: ["Sorry I broke it. - It's cool, I have another one.", "If you can't come, it's cool.", "It's cool, don't worry about it.", "Is it cool if I bring a friend?"] },
    { word: "Get over it", examples: ["She dumped you a year ago. Get over it.", "You lost. Get over it.", "I can't just get over it.", "Get over it and move on."] },
    { word: "Move on", examples: ["Life goes on. You need to move on.", "It's time to move on.", "He decided to move on.", "Move on to the next question."] },
    { word: "The past is in the past", examples: ["Don't dwell on mistakes. The past is in the past.", "Leave it alone; the past is in the past.", "The past is in the past, look to the future.", "You can't change it; the past is in the past."] },
    { word: "Water under the bridge", examples: ["We fought years ago, but that's water under the bridge now.", "It's all water under the bridge.", "Let's consider it water under the bridge.", "Don't bring that up; it's water under the bridge."] },
    { word: "Bury the hatchet", examples: ["Let's stop fighting and bury the hatchet.", "They decided to bury the hatchet.", "Time to bury the hatchet.", "We should bury the hatchet and be friends."] },
    { word: "Let's start over", examples: ["We got off on the wrong foot. Let's start over.", "Hi, I'm John. Let's start over.", "Can we start over?", "Let's start over from the beginning."] },
    { word: "Turn a new leaf", examples: ["He came out of prison and turned a new leaf.", "I'm going to turn a new leaf this year.", "She decided to turn a new leaf.", "It's never too late to turn a new leaf."] },
    { word: "Second chance", examples: ["Everyone deserves a second chance.", "Thanks for giving me a second chance.", "Don't waste your second chance.", "This is your second chance."] }
];

async function main() {
    console.log(`Manually enriching Part 2 (${manualData.length} cards)...`);
    
    for (const item of manualData) {
        const { data: existing, error } = await supabase
            .from('cards')
            .select('id, back, examples')
            .ilike('back', `${item.word}%`)
            .limit(1);

        if (error) {
            console.error(`Error searching for ${item.word}:`, error.message);
            continue;
        }

        if (existing && existing.length > 0) {
            const card = existing[0];
            const { error: updateError } = await supabase
                .from('cards')
                .update({ examples: item.examples })
                .eq('id', card.id);
                
            if (updateError) console.error(`Failed to update ${item.word}:`, updateError.message);
            else console.log(`✅ Updated: ${item.word}`);
        } else {
            console.log(`⚠️ Not found in DB: ${item.word}`);
        }
    }
}

main();
