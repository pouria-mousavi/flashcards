import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node scripts/cleanup_beginner.js <URL> <KEY>");
    process.exit(1);
}
const [url, key] = args;
const supabase = createClient(url, key);

const beginnerFronts = [
    "مدت زیادیه خبری ازت نیست",
    "چه خبر؟ (تازه چه خبر)",
    "اوضاع چطوره؟",
    "نمی‌تونم شکایتی بکنم (خوبم)",
    "شوخی میکنی؟",
    "جدی میگی؟",
    "مسخره‌م کردی؟ (دست انداختی)",
    "باورم نمیشه",
    "بزن بریم",
    "عجله کن (بجنب)",
    "مهم نیست (اشکالی نداره)",
    "موافقم (هم‌نظرم)",
    "بزن قدش",
    "خسته نباشید (کارت خوب بود)",
    "موفق باشی (پا تو پای شانس بذار)",
    "متاسفم (حیف شد)",
    "خجالت بکش",
    "دهنتو ببند (ساکت شو)",
    "نگران نباش",
    "همه چی درست میشه",
    "به تو ربطی نداره",
    "دست نگه دار",
    "یه لحظه صبر کن",
    "گوش کن (ببین چی میگم)",
    "متوجه نمیشم",
    "میشه تکرار کنی؟",
    "منظورت چیه؟",
    "نکته‌ش چیه؟",
    "منظورم اینه که ...",
    "راستش رو بخوای",
    "بسه دیگه (تمومش کن)",
    "فراموشش کن (بیخیال)",
    "شوخی کردم",
    "آشتی کردیم؟",
    "ناامید نشو",
    "ادامه بده",
    "تو میتونی",
    "فکر خوبیه",
    "واقعاً؟",
    "دروغ نگو (برو بابا)",
    "حتما شوخی میکنی",
    "منظوری ندارم",
    "قصد بدی نداشتم",
    "از قصد نبود",
    "تصادفی بود",
    "تقصیر من نیست",
    "من اینکارو نکردم",
    "مدرک داری؟",
    "حرفت رو باور میکنم",
    "بهت اعتماد دارم",
    "شک دارم",
    "بعید میدونم",
    "مطمئن نیستم",
    "شاید",
    "ببینیم چی میشه",
    "بستگی داره",
    "مخالفم",
    "اشتباه میکنی",
    "حق با تو نیست",
    "دیوونه شدی؟",
    "خفه شو",
    "بشین سر جات",
    "تهدیدم میکنی؟",
    "جرات داری؟",
    "بهت هشدار میدم",
    "حالا میبینی",
    "تمومش کن",
    "بسه دیگه",
    "دیگه بسمه (تحمل ندارم)",
    "از جلو چشمم گم شو",
    "برو به جهنم",
    "لعنت بهت",
    "میخوای دعوا کنی؟",
    "بیا جلو (دعوا)",
    "قبول (معامله)",
    "من همچین حرفی نزدم",
    "بذار توضیح بدم",
    "بهش گوش کن",
    "منصفانه باش",
    "انصاف نیست",
    "خودت میدونی",
    "به من چه (مشکل من نیست)",
    "من کاره‌ای نیستم",
    "من بی‌گناهم",
    "قسم می‌خورم",
    "به خدا قسم",
    "باور کن",
    "بهم اعتماد کن",
    "راست میگم",
    "دروغ میگی",
    "دروغگو",
    "بهونه نیار",
    "توجیه نکن",
    "مسئولیتش با من",
    "متاسفم که ...",
    "ای کاش ...",
    "تقصیر توئه",
    "سرزنش نکن",
    "باهات قهرم",
    "تنهام بذار",
    "آروم باش",
    "ریلکس کن",
    "نفس عمیق بکش",
    "مشکلی نیست",
    "بی‌خیال بابا",
    "بگذر ازش",
    "پایه بیرون رفتن هستی؟",
    "بریم یه دوری بزنیم",
    "بریم یه رستوران",
    "خوش بگذره (حال کن)",
    "خوش گذشت؟",
    "سفرت بخیر",
    "رسیدی خبر بده",
    "جات امنه؟",
    "مواظب خودت باش",
    "احتیاط کن",
    "عجله نکن",
    "کمک لازم داری؟",
    "بذار کمکت کنم",
    "ممنون بابت کمکت",
    "خیلی لطف کردی",
    "قابل نداره (خواهش میکنم)",
    "مشکلی نیست (اشکال نداره)",
    "هر زمان (کاری داشتی بگو)",
    "دمت گرم",
    "ببخشید (عذر می‌خوام)",
    "متاسفم (شرمنده)",
    "ببخشید که دیر کردم",
    "تقصیر من بود",
    "منو ببخش",
    "می‌شه یه لطفی بکنی؟",
    "سرا پا گوشم",
    "سرت شلوغه؟",
    "وقت داری؟",
    "مزاحمت نمیشم",
    "خوش اومدی",
    "برو پی کارت",
    "گم شو"
];

async function cleanup() {
    console.log(`Scanning for ${beginnerFronts.length} beginner cards to delete...`);
    
    // Batch fetch IDs
    const batchSize = 20;
    let totalDeleted = 0;

    for (let i = 0; i < beginnerFronts.length; i += batchSize) {
        const batch = beginnerFronts.slice(i, i + batchSize);
        
        // Step 1: Find IDs
        const { data: foundCards, error: fetchError } = await supabase
            .from('cards')
            .select('id, front')
            .in('front', batch);

        if (fetchError) {
            console.error("Error fetching batch:", fetchError);
            continue;
        }

        if (foundCards && foundCards.length > 0) {
            const idsToDelete = foundCards.map(c => c.id);
            console.log(`Found ${idsToDelete.length} cards in this batch. Deleting...`);

            // Step 2: Delete by ID
            const { error: deleteError, count } = await supabase
                .from('cards')
                .delete({ count: 'exact' })
                .in('id', idsToDelete);

            if (deleteError) {
                console.error("Error deleting:", deleteError);
            } else {
                console.log(`Deleted ${count} cards.`);
                totalDeleted += count;
            }
        } else {
             console.log(`No cards found in batch ${i}.`);
        }
    }
    console.log(`Cleanup complete. Total deleted: ${totalDeleted}`);
}

cleanup();
