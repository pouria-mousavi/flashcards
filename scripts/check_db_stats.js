
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
const env = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
const envVars = env.split('\n').reduce((acc, line) => {
    const [key, val] = line.split('=');
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
}, {});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function checkStats() {
    console.log("Checking DB Stats...");
    
    const { data: cards, error } = await supabase.from('cards').select('*');
    if (error) {
        console.error(error);
        return;
    }
    
    console.log(`Total Cards: ${cards.length}`);
    
    const stateCounts = {};
    const dueCounts = { overdue: 0, future: 0 };
    const now = Date.now();
    
    cards.forEach(c => {
        stateCounts[c.state] = (stateCounts[c.state] || 0) + 1;
        const nextReview = new Date(c.next_review).getTime();
        
        if (c.state !== 'NEW') {
            if (nextReview <= now) dueCounts.overdue++;
            else dueCounts.future++;
        }
    });
    
    console.log("State Counts:", stateCounts);
    console.log("Review Timing:", dueCounts);
    
    // Sample a few "Review" cards to see their data
    const reviews = cards.filter(c => c.state === 'REVIEW' || c.state === 'LEARNING' || c.state === 'RELEARNING').slice(0, 3);
    console.log("Sample Reviews:", JSON.stringify(reviews.map(c => ({ 
        front: c.front, 
        state: c.state, 
        next_review: c.next_review,
        interval: c.interval
    })), null, 2));
}

checkStats();
