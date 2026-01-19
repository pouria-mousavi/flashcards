
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
    { word: "I disagree", examples: ["I respect your opinion, but I disagree.", "They disagree on almost everything.", "The results disagree with the hypothesis.", "I strongly disagree with that statement."] },
    { word: "You're wrong", examples: ["If you think I'll help, you're wrong.", "You're wrong about him; he's honest.", "Prove to me that I'm wrong.", "I hate to admit it, but you're wrong."] },
    { word: "You're not right", examples: ["You're not right about him; he's good.", "Technically, you're not right.", "In this case, you're not right.", "I feel like you're not right in your judgment."] },
    { word: "Are you crazy?", examples: ["Driving that fast? Are you crazy?", "Are you crazy to quit your job?", "You want to swim there? Are you crazy?", "Are you crazy or just brave?"] },
    { word: "Shut your mouth", examples: ["Don't talk about my family! Shut your mouth!", "You'd better shut your mouth right now.", "He told him to shut his mouth.", "Shut your mouth and listen!"] },
    { word: "Sit down and shut up", examples: ["I'm in charge here. Sit down and shut up.", "Just sit down and shut up for once.", "The teacher told him to sit down and shut up.", "Sit down and shut up, I'm explaining."] },
    { word: "Get away from me", examples: ["You smell like alcohol. Get away from me.", "I said get away from me!", "Get away from me before I call security.", "She screamed, 'Get away from me!'"] },
    { word: "Keep your hands off me", examples: ["I warned you. Keep your hands off me.", "Keep your hands off me, I'm not joking.", "He shouted to keep his hands off me.", "Please keep your hands off me."] },
    { word: "Are you threatening me?", examples: ["You'll regret this. - Are you threatening me?", "Are you threatening me with violence?", "I need to know, are you threatening me?", "Don't act tough; are you threatening me?"] },
    { word: "You dare?", examples: ["Don't you dare touch that dial!", "You dare speak to me like that?", "How dare you come here?", "Don't you dare lie to me."] },
    { word: "I'm warning you", examples: ["Stay back! I'm warning you.", "I'm warning you, don't cross that line.", "I'm warning you for the last time.", "This is not a joke, I'm warning you."] },
    { word: "If it comes to that", examples: ["I'll fight him if it comes to that.", "We can sell the car if it comes to that.", "I'll resign if it comes to that.", "We'll run away if it comes to that."] },
    { word: "Over my dead body", examples: ["You want to date my daughter? Over my dead body!", "You'll sell this house over my dead body.", "Over my dead body will you drive drunk.", "He said I could go, over his dead body."] },
    { word: "Dream on", examples: ["You think you'll beat me? Dream on.", "You want a raise? Dream on.", "Dream on if you think she likes you.", "Win the lottery? Dream on."] },
    { word: "In your dreams", examples: ["Date a supermodel? In your dreams.", "You think you can win? In your dreams.", "Get a promotion? In your dreams.", "In your dreams, maybe."] },
    { word: "Fat chance", examples: ["Will he lend you money? Fat chance.", "Fat chance of that happening.", "There's a fat chance we'll finish on time.", "Fat chance she says yes."] },
    { word: "Not a chance", examples: ["Can I drive your Ferrari? Not a chance.", "There is not a chance I'm going.", "Not a chance in hell.", "We have not a chance of winning."] },
    { word: "I won't let that happen", examples: ["They want to fire you? I won't let that happen.", "I won't let that happen to you.", "Trust me, I won't let that happen.", "We must ensure I won't let that happen."] },
    { word: "Stop me", examples: ["I'm going to tell the truth. Try and stop me.", "You can't stop me now.", "Nobody can stop me.", "Try to stop me if you can."] },
    { word: "I'll make you", examples: ["I won't talk. - I'll make you.", "Eat your vegetables or I'll make you.", "Don't force me or I'll make you.", "I'll make you regret this."] },
    { word: "You'll regret this", examples: ["If you walk out, you'll regret this.", "Don't do it, you'll regret this.", "Mark my words, you'll regret this.", "Someday you'll regret this decision."] },
    { word: "You'll pay for this", examples: ["You ruined my car! You'll pay for this!", "You'll pay for this with your life.", "I swear you'll pay for this.", "He said I'll pay for this."] },
    { word: "Just you wait", examples: ["I'll be famous one day. Just you wait.", "Just you wait and see.", "You'll be sorry, just you wait.", "It's not over, just you wait."] },
    { word: "I'll show you", examples: ["Think I'm weak? I'll show you.", "I'll show you what I can do.", "Don't doubt me, I'll show you.", "I'll show you who's boss."] },
    { word: "I'll get you for this", examples: ["You pranked me? I'll get you for this.", "I'll get you for this insult.", "Wait until I get you for this.", "I'll get you for this betrayal."] },
    { word: "Knock it off", examples: ["Stop throwing food! Knock it off!", "Knock it off, you two.", "Seriously, knock it off.", "Can you please knock it off?"] },
    { word: "Enough is enough", examples: ["You've been late every day. Enough is enough.", "I've tolerated this long enough. Enough is enough.", "Say when enough is enough.", "Enough is enough! Stop fighting."] },
    { word: "I've had enough", examples: ["I've had enough of your excuses.", "I've had enough of this noise.", "I'm leaving, I've had enough.", "Have you had enough yet?"] },
    { word: "You make me sick", examples: ["You stole from your mother? You make me sick.", "Your attitude makes me sick.", "Liars like you make me sick.", "It makes me sick to see this."] },
    { word: "Get out of my sight", examples: ["I never want to see you again. Get out of my sight.", "You're fired. Get out of my sight.", "Get out of my sight right now.", "Leave and get out of my sight."] },
    { word: "Drop dead", examples: ["Will you marry me? Drop dead.", "He told me to drop dead.", "Why don't you just drop dead?", "I'd rather drop dead than help you."] },
    { word: "Go to hell", examples: ["You think you can buy me? Go to hell.", "Tell him to go to hell.", "Go to hell, I'm not listening.", "She told her boss to go to hell."] },
    { word: "Damn you", examples: ["Damn you for ruining everything!", "Datum you! (Typos happens)", "Damn you and your lies.", "Damn you all!"] },
    { word: "I'll kick your ass", examples: ["Touch my bike again and I'll kick your ass.", "I'll kick your ass if you lie.", "Don't mess with me or I'll kick your ass.", "I'll kick your ass at this game."] },
    { word: "I'll punch your lights out", examples: ["Keep talking and I'll punch your lights out.", "One more word and I'll punch your lights out.", "I swear I'll punch your lights out.", "Try it and I'll punch your lights out."] },
    { word: "You want a piece of me?", examples: ["You looking at me? You want a piece of me?", "Come on, you want a piece of me?", "You want a piece of me? Let's go.", "Anyone else want a piece of me?"] },
    { word: "Bring it on", examples: ["You think you can beat me? Bring it on!", "Challenge accepted. Bring it on.", "Hard work? Bring it on.", "Whatever happens, bring it on."] },
    { word: "Shake on it", examples: ["Deal? Deal. Shake on it.", "Let's shake on it.", "We should shake on it to make it official.", "If you agree, shake on it."] },
    { word: "It's a deal", examples: ["I wash, you dry. It's a deal.", "Okay, it's a deal.", "Do we have a deal? It's a deal.", "It's a deal then."] },
    { word: "Is that a promise?", examples: ["You'll quit smoking? Is that a promise?", "Is that a promise or just words?", "I need to know, is that a promise?", "Is that a promise you can keep?"] },
    { word: "Don't go back on your word", examples: ["You said you'd help. Don't go back on your word.", "A real man doesn't go back on his word.", "Promise me you won't go back on your word.", "Don't go back on your word now."] },
    { word: "I take it back", examples: ["I said you were ugly. I take it back.", "I take it back, I was wrong.", "Can I take it back?", "I take back what I said."] },
    { word: "Take that back", examples: ["Don't call me a liar! Take that back!", "You take that back right now.", "He refused to take that back.", "Take that back or else."] },
    { word: "I didn't say that", examples: ["You're twisting my words. I didn't say that.", "I didn't say that at all.", "No, I didn't say that.", "Wait, I didn't say that."] },
    { word: "It's a misunderstanding", examples: ["Wait, let me explain. It's a misunderstanding.", "This whole thing is a misunderstanding.", "I'm sure it's a misunderstanding.", "Avoid a misunderstanding."] },
    { word: "Let me explain", examples: ["It's not what it looks like. Let me explain.", "Please, let me explain myself.", "You have to let me explain.", "Let me explain before you get mad."] },
    { word: "Hear him out", examples: ["Don't interrupt. Just hear him out.", "You should hear him out.", "At least hear him out first.", "Hear him out before deciding."] },
    { word: "Be fair", examples: ["I did half the work. Be fair.", "Come on, be fair.", "You have to be fair to everyone.", "Let's be fair about this."] },
    { word: "It's not fair", examples: ["Why does he get two? It's not fair.", "Life is not always fair.", "It's not fair to blame him.", "That's simply not fair."] },
    { word: "Suit yourself", examples: ["You don't want to come? Suit yourself.", "Fine, suit yourself.", "If you won't listen, suit yourself.", "Suit yourself, I'm going."] }
];

async function main() {
    console.log(`Manually enriching ${manualData.length} cards...`);
    
    for (const item of manualData) {
        // Find existing card
        const { data: existing, error } = await supabase
            .from('cards')
            .select('id, back, examples')
            .ilike('back', `${item.word}%`) // Assumes card starts with English word
            .limit(1);

        if (error) {
            console.error(`Error searching for ${item.word}:`, error.message);
            continue;
        }

        if (existing && existing.length > 0) {
            const card = existing[0];
            // Update examples
            // We overwrite to ensure 4+ quality ones
            const { error: updateError } = await supabase
                .from('cards')
                .update({ examples: item.examples })
                .eq('id', card.id);
                
            if (updateError) console.error(`Failed to update ${item.word}:`, updateError.message);
            else console.log(`✅ Updated: ${item.word}`);
        } else {
            console.log(`⚠️ Not found in DB: ${item.word}`);
            // If not found, it might be stored differently (e.g. Back starts with Persian?)
            // Or maybe exact match failed.
        }
    }
}

main();
