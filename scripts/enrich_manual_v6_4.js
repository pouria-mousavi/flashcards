
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const cards = [
    { word: "Vacillate", examples: [
        "She vacillated between the two options for weeks.", 
        "His mood vacillates between hope and despair.", 
        "Stop vacillating and make a decision!", 
        "The market continues to vacillate."
    ]},
    { word: "Instigate", examples: [
        "He was accused of instigating the riot.", 
        "Don't instigate an argument during dinner.", 
        "The government instigated a new health program.", 
        "She instigated a change in policy."
    ]},
    { word: "Appease", examples: [
        "They tried to appease the angry customers with coupons.", 
        "Nothing could appease his anger.", 
        "The manager appeased the critics by promising reform.", 
        "He made a sacrifice to appease the gods."
    ]},
    { word: "Fabricate", examples: [
        "The evidence was completely fabricated.", 
        "He fabricated an excuse for being late.", 
        "The story was a pure fabrication.", 
        "Don't fabricate data for your report."
    ]},
    { word: "Scrutinize", examples: [
        "The contract was scrutinized by lawyers.", 
        "The media scrutinizes every move he makes.", 
        "Please scrutinize the data for errors.", 
        "She scrutinized his face for a reaction."
    ]},
    { word: "Reiterate", examples: [
        "Let me reiterate my point clearly.", 
        "The professor reiterated the importance of the exam.", 
        "I want to reiterate our commitment.", 
        "He reiterated his refusal to resign."
    ]},
    { word: "Digress", examples: [
        "Let me digress for a moment to explain.", 
        "He digressed from the main topic.", 
        "Don't digress; stick to the agenda.", 
        "If I may digress, I have a story to tell."
    ]},
    { word: "Exacerbate", examples: [
        "Stress can exacerbate the symptoms.", 
        "His comments only exacerbated the situation.", 
        "Skipping meals will exacerbate your headache.", 
        "Don't exacerbate the problem by arguing."
    ]},
    { word: "Indoctrinate", examples: [
        "The cult indoctrinates its members.", 
        "Schools should educate, not indoctrinate.", 
        "He was indoctrinated into the ideology.", 
        "They tried to indoctrinate the youth."
    ]},
    { word: "Obstinate", examples: [
        "He is too obstinate to admit he was wrong.", 
        "An obstinate refusal to compromise.", 
        "The stain was obstinate.", 
        "Don't be so obstinate; listen to reason."
    ]},
    { word: "Negligent", examples: [
        "The company was negligent in safety procedures.", 
        "The driver was found negligent.", 
        "Don't be negligent with your duties.", 
        "She was negligent in her reporting."
    ]},
    { word: "Wistful", examples: [
        "She gave a wistful smile.", 
        "A wistful glance at the toys.", 
        "He spoke wistfully of his childhood.", 
        "She felt a wistful longing for the past."
    ]},
    { word: "Nonchalant", examples: [
        "He was nonchalant about winning.", 
        "She strolled in with a nonchalant air.", 
        "Try to appear nonchalant.", 
        "His nonchalant attitude annoyed me."
    ]},
    { word: "Notorious", examples: [
        "The city is notorious for traffic.", 
        "A notorious criminal was caught.", 
        "This restaurant is notorious for bad service.", 
        "He is notorious for being late."
    ]},
    { word: "Mundane", examples: [
        "I need a break from my mundane routine.", 
        "Even mundane tasks can be meditative.", 
        "He led a mundane life until now.", 
        "It was a mundane conversation about weather."
    ]},
    { word: "Down-to-earth", examples: [
        "Despite his fame, he is down-to-earth.", 
        "She's so down-to-earth and easy to talk to.", 
        "We need a down-to-earth approach.", 
        "He's a very down-to-earth guy."
    ]},
    { word: "Grumpy", examples: [
        "I'm always grumpy in the morning.", 
        "Why are you so grumpy today?", 
        "A grumpy old man lived next door.", 
        "Don't be grumpy, smile!"
    ]},
    { word: "Tenacious", examples: [
        "She is a tenacious negotiator.", 
        "The tenacious weeds kept growing.", 
        "His tenacious grip on reality.", 
        "A tenacious defense of his rights."
    ]},
    { word: "Gullible", examples: [
        "Don't be so gullible.", 
        "Scammers target gullible people.", 
        "I was gullible enough to believe him.", 
        "He sold the fake ring to a gullible tourist."
    ]},
    { word: "Enigmatic", examples: [
        "The Mona Lisa has an enigmatic smile.", 
        "He is an enigmatic figure.", 
        "An enigmatic message was left.", 
        "Her past remains enigmatic."
    ]},
    { word: "Blatant", examples: [
        "That was a blatant lie.", 
        "A blatant disregard for the rules.", 
        "His attempt to cheat was blatant.", 
        "It was a blatant error."
    ]},
    { word: "Obsolete", examples: [
        "Floppy disks are obsolete.", 
        "New technology makes old devices obsolete.", 
        "These skills are becoming obsolete.", 
        "The law is now obsolete."
    ]},
    { word: "Comprehensive", examples: [
        "We need a comprehensive study.", 
        "A comprehensive guide to Python.", 
        "A comprehensive insurance policy.", 
        "Her knowledge of the subject is comprehensive."
    ]},
    { word: "Concise", examples: [
        "Keep your report concise.", 
        "He gave a concise summary.", 
        "Be concise; we don't have time.", 
        "A concise explanation is best."
    ]},
    { word: "Vague", examples: [
        "His instructions were too vague.", 
        "I have a vague memory of him.", 
        "Don't be vague; be specific.", 
        "A vague sense of unease."
    ]},
    { word: "Ironic", examples: [
        "It's ironic that it rained on the 'Sun Festival'.", 
        "An ironic twist of fate.", 
        "He spoke with an ironic tone.", 
        "Life is full of ironic situations."
    ]},
    { word: "Grueling", examples: [
        "It was a grueling 10-hour hike.", 
        "The grueling schedule exhausted him.", 
        "Athletes endure grueling training.", 
        "A grueling interrogation."
    ]},
    { word: "Filthy", examples: [
        "Go wash your filthy hands.", 
        "The streets were filthy.", 
        "He has a filthy habit.", 
        "This place is absolutely filthy."
    ]},
    { word: "Pristine", examples: [
        "The beach was in pristine condition.", 
        "A pristine white shirt.", 
        "The car is pristine.", 
        "Keep the forest pristine."
    ]},
    { word: "Fussy", examples: [
        "He is a fussy eater.", 
        "Don't be fussy about details.", 
        "Babies get fussy when tired.", 
        "She is fussy about her clothes."
    ]},
    { word: "Extravagant", examples: [
        "An extravagant wedding party.", 
        "Her spending is extravagant.", 
        "Don't make extravagant promises.", 
        "It was an extravagant gift."
    ]},
    { word: "Stingy", examples: [
        "Don't be stingy with the tip.", 
        "He is too stingy to buy clothes.", 
        "A stingy portion of food.", 
        "Stop being stingy."
    ]},
    { word: "Alert", examples: [
        "Drivers must remain alert.", 
        "Stay alert for danger.", 
        "Coffee helped me stay alert.", 
        "Be alert to changes."
    ]},
    { word: "Restless", examples: [
        "Detailed work makes me restless.", 
        "The audience grew restless.", 
        "A restless night's sleep.", 
        "He felt restless and bored."
    ]},
    { word: "Nosy", examples: [
        "Stop being so nosy.", 
        "A nosy neighbor watched us.", 
        "I hate nosy questions.", 
        "Don't be nosy."
    ]},
    { word: "Embarrassing", examples: [
        "It was an embarrassing mistake.", 
        "An embarrassing silence.", 
        "An embarrassing situation.", 
        "That photo is embarrassing."
    ]},
    { word: "Offensive", examples: [
        "His comments were offensive.", 
        "I find that language offensive.", 
        "An offensive gesture.", 
        "It was meant to be funny, not offensive."
    ]},
    { word: "Respectful", examples: [
        "Be respectful to elders.", 
        "A respectful distance.", 
        "He was respectful of opinions.", 
        "A respectful tone."
    ]},
    { word: "Vital", examples: [
        "Water is vital for life.", 
        "It is vital that you attend.", 
        "Tourism is vital to the economy.", 
        "Speed is vital in this mission."
    ]},
    { word: "Ecstatic", examples: [
        "I was ecstatic about the news.", 
        "An ecstatic crowd cheered.", 
        "She was ecstatic about the job.", 
        "He felt ecstatic joy."
    ]},
    { word: "Devastated", examples: [
        "She was devastated by the loss.", 
        "The town was devastated.", 
        "He was devastated by the failure.", 
        "I felt absolutely devastated."
    ]},
    { word: "Furious", examples: [
        "He was furious about the damage.", 
        "A furious argument.", 
        "She was furious with herself.", 
        "He is furious at you."
    ]},
    { word: "Terrified", examples: [
        "I am terrified of spiders.", 
        "The child looked terrified.", 
        "He was terrified to speak.", 
        "She was terrified of the dark."
    ]},
    { word: "Numb", examples: [
        "My fingers are numb.", 
        "I felt numb with shock.", 
        "The dentist made my jaw numb.", 
        "My leg went numb."
    ]},
    { word: "Swollen", examples: [
        "His ankle is swollen.", 
        "Her eyes were swollen.", 
        "A swollen river.", 
        "My hand is swollen and painful."
    ]},
    { word: "Bruised", examples: [
        "Her arm is badly bruised.", 
        "A bruised ego.", 
        "The fruit was bruised.", 
        "He was bruised but okay."
    ]},
    { word: "Itchy", examples: [
        "The sweater is itchy.", 
        "My bite is itchy.", 
        "I have itchy feet.", 
        "My eyes are itchy."
    ]},
    { word: "Sour", examples: [
        "These grapes are sour.", 
        "The milk has gone sour.", 
        "Don't make a sour face.", 
        "A sour taste in my mouth."
    ]},
    { word: "Bitter", examples: [
        "Dark chocolate is bitter.", 
        "A bitter disappointment.", 
        "She feels bitter about it.", 
        "A bitter cold wind."
    ]},
    { word: "Bland", examples: [
        "The soup was bland.", 
        "A bland diet.", 
        "His personality is bland.", 
        "The movie was a bit bland."
    ]}
];

async function main() {
    console.log(`Manually enriching V6 Part 4 (50 cards)...`);
    
    for (const item of cards) {
        // Search by Back (English Word)
        // Note: Sometimes cards have IPA or extra text. matching 'back' starting with Word is usually safe.
        const { data: existing, error } = await supabase
            .from('cards')
            .select('id, back, examples')
            .ilike('back', `${item.word}%`)
            .limit(1);

        if (error) {
            console.error(`Error searching ${item.word}:`, error.message);
            continue;
        }

        if (existing && existing.length > 0) {
            const card = existing[0];
            const { error: updErr } = await supabase
                .from('cards')
                .update({ examples: item.examples })
                .eq('id', card.id);
            if (updErr) console.error(`Failed ${item.word}:`, updErr.message);
            else console.log(`✅ Updated: ${item.word}`);
        } else {
            console.log(`⚠️ Not found: ${item.word}`);
        }
    }
}

main();
