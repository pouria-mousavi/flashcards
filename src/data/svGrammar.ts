/**
 * Grammatik — the grammar lessons learned so far (Rivstart A1/A2 FOKUS
 * sections, enriched). Each lesson = a memorizable CHEAT SHEET (blocks)
 * plus an expandable FULL lesson in English.
 *
 * Pipeline rule: whenever a new FOKUS/grammar section is extracted from the
 * book, add or extend a lesson here.
 */

export type CheatBlock =
  | { kind: 'table'; title?: string; columns: string[]; rows: string[][] }
  | { kind: 'pattern'; title?: string; slots: string[]; example: { sv: string; en: string } }
  | { kind: 'pairs'; title?: string; items: { sv: string; en: string; note?: string }[] }
  | { kind: 'note'; text: string };

export interface GrammarLesson {
  id: string;
  title: string;
  tag: string;
  hook: string; // one-line summary shown in the menu
  cheat: CheatBlock[];
  full: string[]; // paragraphs
}

export const SV_GRAMMAR: GrammarLesson[] = [
  {
    id: 'verb-groups',
    title: 'Verb groups & tenses',
    tag: 'Verbs',
    hook: 'Four families decide every verb ending: -ar, -er, -r, strong.',
    cheat: [
      {
        kind: 'table',
        title: 'The four groups',
        columns: ['Group', 'Infinitive', 'Present', 'Past', 'Supine'],
        rows: [
          ['1 · -ar', 'tala', 'talar', 'talade', 'har talat'],
          ['2a · -er', 'ringa', 'ringer', 'ringde', 'har ringt'],
          ['2b · -er', 'köpa', 'köper', 'köpte', 'har köpt'],
          ['3 · -r', 'bo', 'bor', 'bodde', 'har bott'],
          ['4 · strong', 'dricka', 'dricker', 'drack', 'har druckit'],
        ],
      },
      {
        kind: 'pairs',
        title: 'Spot the group',
        items: [
          { sv: 'jobba → jobbar', en: 'stem ends in -a → group 1 (the biggest)', note: 'past -ade' },
          { sv: 'köpa → köpte', en: 'k/p/s/t before the ending → 2b takes -te', note: 'voiceless consonant' },
          { sv: 'tro → trodde', en: 'one syllable, stressed vowel → group 3', note: 'past -dde, supine -tt' },
          { sv: 'springa → sprang → sprungit', en: 'vowel changes → group 4, memorize it', note: 'i–a–u is a common pattern' },
        ],
      },
      { kind: 'note', text: 'Present = what the dictionary form does after you: group 1 keeps its -a (talar), the others drop or change. If you know the past ending, you know the group.' },
    ],
    full: [
      'Swedish verbs never change for person — jag talar, du talar, alla talar. All the energy goes into TENSE endings, and those follow four families.',
      'Group 1 (-ar) is the default: any verb whose stem ends in unstressed -a. Present -ar, past -ade, supine -at. Nearly every modern loan (chatta, messa, fika) joins this group, so when in doubt, guess group 1.',
      'Group 2 (-er) verbs have stems ending in a consonant: ring-, köp-, läs-. Present adds -er. The past splits: -de normally (ringde), but -te after the voiceless consonants k, p, s, t (köpte, läste) — say them out loud and you\'ll hear why: your voice is already off.',
      'Group 3 (-r) is small: one-syllable verbs ending in a stressed vowel (bo, tro, må). Present just adds -r, past doubles up to -dde (bodde, trodde), supine -tt (bott, trott).',
      'Group 4 is the strong/irregular family: the past is made by CHANGING THE VOWEL instead of adding an ending — dricka→drack, springa→sprang, se→såg, gå→gick. The supine usually ends in -it (druckit, sprungit). These must be memorized; the Tables button gives you the complete list from your own deck.',
      'The supine (har talat) is only used after har/hade to build the perfect — that\'s the har-form in the tables. Deponent verbs (hoppas, ses, trivs, känns) keep their -s in every tense and have no imperative.',
    ],
  },
  {
    id: 'v2-word-order',
    title: 'V2 — main clause word order',
    tag: 'Word order',
    hook: 'The verb is ALWAYS the second element. Everything else negotiates.',
    cheat: [
      {
        kind: 'pattern',
        title: 'The machine',
        slots: ['Fundament', 'VERB', 'subject', 'inte/alltid', 'rest'],
        example: { sv: 'På kvällen läser hon alltid nyheterna.', en: 'In the evening she always reads the news.' },
      },
      {
        kind: 'pairs',
        title: 'Same sentence, three fundaments',
        items: [
          { sv: 'Hon läser nyheterna på kvällen.', en: 'subject first — the neutral version' },
          { sv: 'På kvällen läser hon nyheterna.', en: 'time first → verb stays 2nd, subject flips after it' },
          { sv: 'Nyheterna läser hon på kvällen.', en: 'even the object can go first — verb still 2nd' },
        ],
      },
      { kind: 'note', text: 'inte / alltid / ofta / aldrig / bara stand right AFTER the verb (and after the subject if it flipped): Hon läser inte… / På kvällen läser hon inte…' },
    ],
    full: [
      'The single most Swedish rule there is: in a statement, the finite verb is the SECOND constituent. Not the second word — the second building block.',
      'The first slot (the "fundament") is free real estate. Put the subject there for a neutral sentence, or front a time phrase, a place, even the object — for emphasis or flow. Whatever you front, the verb refuses to move from slot 2, so the subject slides to slot 3.',
      'Sentence adverbs — inte, alltid, ofta, aldrig, bara, gärna — take the slot right after the verb (after the subject too, when the subject has flipped). Jag läser inte. / På kvällen läser jag inte.',
      'Yes/no questions are the one place the verb goes FIRST: Läser du? Går det bra? The fundament is simply empty. Question-word questions put the question word in the fundament: Vad läser du? — and look, the verb is second again.',
      'Nearly every sentence needs a subject, even an empty one: Det regnar (it rains), Det är lunch. If you hear a sentence with no det and no subject, it\'s probably an imperative.',
    ],
  },
  {
    id: 'questions',
    title: 'Questions',
    tag: 'Word order',
    hook: 'Verb first for yes/no; question word first otherwise — plus the Vad…för trick.',
    cheat: [
      {
        kind: 'table',
        title: 'Question words',
        columns: ['Swedish', 'English', 'Watch out'],
        rows: [
          ['vem / vems', 'who / whose', 'vem är det?'],
          ['vad', 'what', ''],
          ['var / vart', 'where / where to', 'var = location, vart = direction'],
          ['när', 'when', ''],
          ['hur', 'how', 'hur dags = at what time'],
          ['varför', 'why', ''],
          ['vilken / vilket / vilka', 'which', 'agrees: en / ett / plural'],
          ['hur många / hur mycket', 'how many / how much', 'countable vs uncountable'],
        ],
      },
      {
        kind: 'pairs',
        title: 'Two shapes',
        items: [
          { sv: 'Går det bra? — Det går bra.', en: 'yes/no: verb first; statement: verb second' },
          { sv: 'Vad gillar du för musik?', en: 'Vad …(verb)… för + noun = what kind of' },
          { sv: 'Vet du var jag hittar brödet?', en: 'INDIRECT question: no inversion — var JAG HITTAR, not var hittar jag' },
        ],
      },
    ],
    full: [
      'Yes/no questions are made by inversion alone — no helper verb like English "do": Dricker du kaffe? Kan du komma? The melody rises, the verb leads.',
      'Question-word questions put the question word in the first slot and the verb second: Var bor du? När börjar kursen? Vilken and vilket agree with the noun\'s gender (vilken gata, vilket år), vilka with plurals.',
      'Three ways to ask about clock time, all fine: När börjar vi? / Vilken tid börjar vi? / Hur dags börjar vi? — hur dags is the most colloquial.',
      'The Vad…för construction splits "what kind of" around the verb: Vad har du för yrke? Vad gillar du för musik? Vad dricker du för vin? Word order: Vad + verb + subject + för + noun.',
      'Indirect questions (inside another sentence) LOSE the inversion: direct Var hittar jag brödet? but Vet du var jag hittar brödet? The subject moves back in front of the verb. This is the #1 word-order trap at A2.',
    ],
  },
  {
    id: 'nouns-definite',
    title: 'en/ett & the definite form',
    tag: 'Nouns',
    hook: 'The article moves to the END: en bok → boken, ett hus → huset.',
    cheat: [
      {
        kind: 'table',
        title: 'Building the definite',
        columns: ['Type', 'Indefinite', 'Definite', 'Rule'],
        rows: [
          ['en + consonant', 'en bok', 'boken', '+ en'],
          ['en + vowel', 'en väska', 'väskan', '+ n'],
          ['ett + consonant', 'ett hus', 'huset', '+ et'],
          ['ett + vowel', 'ett äpple', 'äpplet', '+ t'],
        ],
      },
      {
        kind: 'pairs',
        title: 'When definite?',
        items: [
          { sv: 'Jag har en katt. Katten heter Sixten.', en: 'first mention: en/ett → known thing: definite' },
          { sv: 'den här bananen / det där äpplet', en: 'after den här/den där the noun is DEFINITE' },
          { sv: 'Solen skiner. Klockan är tre.', en: 'unique things are always definite' },
        ],
      },
      { kind: 'note', text: 'About 75% of nouns are en-words. Learn every noun WITH its article — the gender decides den/det, adjective endings, and vilken/vilket.' },
    ],
    full: [
      'Swedish has two genders: en-words (utrum) and ett-words (neutrum). There is no reliable logic — en bok but ett bord — so the article is part of the word. Never learn "bok"; learn "en bok".',
      'English puts "the" in front; Swedish glues it on the back. En-words take -en/-n (boken, väskan), ett-words take -et/-t (huset, äpplet).',
      'Use the definite exactly where English uses "the": something already mentioned (Jag har en katt → katten), something unique (solen, klockan), or something both speakers can point at.',
      'After demonstratives the noun stays definite — den här boken, det där wienerbrödet — literally "this here book-the". This feels doubled to English speakers; embrace it.',
      'A few endings are irregular: ett nummer → numret, ett museum → museet. And some nouns never take an article in set phrases: spela piano, tala svenska, ha feber.',
    ],
  },
  {
    id: 'plurals',
    title: 'Plurals — the five groups',
    tag: 'Nouns',
    hook: '-or, -ar, -er, -n, or nothing: the singular\'s shape tells you which.',
    cheat: [
      {
        kind: 'table',
        title: 'The system',
        columns: ['Group', 'Pattern', 'Example', 'Definite plural'],
        rows: [
          ['1 · -or', 'en …a → -or', 'en gurka → gurkor', 'gurkorna'],
          ['2 · -ar', 'many en-words', 'en bil → bilar', 'bilarna'],
          ['3 · -er', 'stressed last syllable', 'en citron → citroner', 'citronerna'],
          ['4 · -n', 'ett + vowel', 'ett äpple → äpplen', 'äpplena'],
          ['5 · —', 'ett + consonant', 'ett hus → hus', 'husen'],
          ['5 · —', '-are / -er people', 'en lärare → lärare', 'lärarna'],
        ],
      },
      {
        kind: 'pairs',
        title: 'The famous irregulars',
        items: [
          { sv: 'en bok → böcker', en: 'vowel change + -er' },
          { sv: 'en man → män', en: '' },
          { sv: 'en dotter → döttrar · en syster → systrar', en: 'drop the e' },
          { sv: 'ett museum → museer · ett kafé → kaféer', en: 'ett-words that still take -er' },
        ],
      },
    ],
    full: [
      'Plural endings look chaotic until you see the sorting logic: it\'s driven by the singular\'s ending and gender.',
      'En-words ending in -a swap it for -or (gurka→gurkor, flicka→flickor). A big second family takes -ar (bilar, hundar, pojkar) — this is the default for short en-words. Words stressed on the last syllable — often loanwords — take -er (citroner, biljetter, familjer).',
      'Ett-words split by their ending: vowel-final ones add -n (äpplen, möten, kvitton), consonant-final ones add NOTHING — ett hus, två hus, många barn. Counting makes it visible: ett år, tio år.',
      'People-nouns in -are never change either: en lärare, två lärare — but their definite plural drops the e: lärarna, bagarna.',
      'The definite plural adds one more ending on top: gurkorna, bilarna, husen, äpplena. Pattern: indefinite plural + -na (en-words) / -en, -a (ett-words). Your deck\'s Tables button lists every noun in all four forms.',
      'Memorize the star irregulars as words, not rules: böcker, män, söner, döttrar, systrar, mödrar, händer, städer.',
    ],
  },
  {
    id: 'den-det',
    title: 'den / det / de + demonstratives',
    tag: 'Pronouns',
    hook: '"It" agrees with gender; det is also the empty subject that runs Swedish small talk.',
    cheat: [
      {
        kind: 'pairs',
        title: 'The system',
        items: [
          { sv: 'Jag har en bok. Jag gillar den.', en: 'en-word → den' },
          { sv: 'Jag har ett äpple. Jag äter det.', en: 'ett-word → det' },
          { sv: 'Var är mina skor? Jag ser dem inte.', en: 'plural → de (says "dom"), object dem' },
          { sv: 'Det regnar. Det är lunch. Det går bra.', en: 'DUMMY det — the empty subject, whatever the topic' },
        ],
      },
      {
        kind: 'table',
        title: 'Pointing (demonstratives)',
        columns: ['Near', 'Far', 'Noun form'],
        rows: [
          ['den här boken', 'den där boken', 'definite (en)'],
          ['det här äpplet', 'det där äpplet', 'definite (ett)'],
          ['de här böckerna', 'de där böckerna', 'definite (plural)'],
        ],
      },
      { kind: 'note', text: 'Answering about a named thing keeps its gender: Vad är klockan? — DEN är tre. När börjar kursen? — DEN börjar klockan tio.' },
    ],
    full: [
      '"It" is not one word in Swedish. Referring back to an en-word you say den, to an ett-word det, to a plural de: Kaffet? Jag drack det. Bilen? Jag sålde den.',
      'Det has a second life as the empty subject — the "it" in "it\'s raining". Det regnar, det är kallt, det finns kaffe, det låter bra. Even when the real subject comes later: Det står två flaskor på bordet.',
      'This is why Går det bra? / Det går bra is the universal check-in: det refers to nothing and everything.',
      'Demonstratives: den här (this) and den där (that) for en-words, det här/det där for ett-words, de här/de där for plurals — and the noun after them takes the DEFINITE form: den här bananen kostar fjorton kronor.',
      'Pronunciation bonus: de and dem are both pronounced "dom" in speech. Written Swedish keeps them apart: de = they (subject), dem = them (object).',
    ],
  },
  {
    id: 'adjectives',
    title: 'Adjective agreement',
    tag: 'Adjectives',
    hook: 'One adjective, three shapes: stor · stort · stora.',
    cheat: [
      {
        kind: 'table',
        title: 'The three shapes',
        columns: ['With en-word', 'With ett-word', 'Plural / definite'],
        rows: [
          ['en stor bil', 'ett stort hus', 'stora bilar'],
          ['en god kaka', 'gott kaffe', 'goda kakor'],
          ['en ny mobil', 'ett nytt jobb', 'nya mobiler'],
        ],
      },
      {
        kind: 'pairs',
        title: 'Comparison',
        items: [
          { sv: 'stor → större → störst', en: 'irregular greats change vowel' },
          { sv: 'rolig → roligare → roligast', en: 'the regular pattern: -are, -ast' },
          { sv: 'bra → bättre → bäst · gammal → äldre → äldst', en: 'memorize the top irregulars' },
        ],
      },
      { kind: 'note', text: 'jätte- glues onto any adjective for "really": jättebra, jättegod, jättetrött — and still agrees: jättegoda kanelbullar.' },
    ],
    full: [
      'Adjectives agree with their noun in gender and number. The base form goes with en-words (en stor bil), the -t form with ett-words (ett stort hus), and the -a form with all plurals (stora bilar) — and also after the definite article (den stora bilen).',
      'It happens after "is" too, which English speakers forget: Kaffet är gott. Huset är stort. Kakorna är goda. Your homework correction "Kakorna är mycket goda" is exactly this rule.',
      'Some adjectives resist: bra never changes (en bra bok, ett bra jobb, bra böcker); adjectives already ending in -t or from participles like nybakad follow slightly shifted patterns (nybakat bröd, nybakade bullar); liten is the diva — en liten bil, ett litet hus, små bilar.',
      'Comparison is -are / -ast for most (roligare, roligast), but the most common adjectives are irregular and worth learning as triplets: bra–bättre–bäst, stor–större–störst, gammal–äldre–äldst, liten–mindre–minst, många–fler–flest.',
      'The jätte- prefix is the everyday intensifier — one word, no space: jättebra, jättesnäll. Stronger casual options: skit- (rude-ish), super-, as well as plain mycket/väldigt before the adjective.',
    ],
  },
  {
    id: 'possessives',
    title: 'Possessives & sin/sitt/sina',
    tag: 'Pronouns',
    hook: 'min/mitt/mina agree like adjectives — and "their own" is sin, not deras.',
    cheat: [
      {
        kind: 'table',
        title: 'Agreement',
        columns: ['Owner', 'en-word', 'ett-word', 'plural'],
        rows: [
          ['my', 'min bok', 'mitt hus', 'mina böcker'],
          ['your', 'din bok', 'ditt hus', 'dina böcker'],
          ['our', 'vår bok', 'vårt hus', 'våra böcker'],
          ['his/her/their (fixed)', 'hans / hennes / deras', 'hans / hennes / deras', 'hans / hennes / deras'],
          ['his/her/their OWN', 'sin bok', 'sitt hus', 'sina böcker'],
        ],
      },
      {
        kind: 'pairs',
        title: 'The sin test',
        items: [
          { sv: 'De handlar sina bakelser från Lillebrors bageri.', en: 'their OWN pastries — subject owns it → sin/sitt/sina' },
          { sv: 'Deras bakelser är alltid nybakade.', en: '"their" is the SUBJECT here → deras' },
          { sv: 'Han älskar sin fru. / Han älskar hans fru.', en: 'sin = his own wife; hans = someone else\'s wife (!)' },
        ],
      },
    ],
    full: [
      'The my/your/our family agrees with the THING owned, not the owner: min bok (en), mitt kafé (ett), mina kompisar (plural). Same for din/ditt/dina and vår/vårt/våra. Your homework correction "Mitt favoritkafé" is this rule.',
      'Hans, hennes and deras never change form. But they hide Swedish\'s most elegant trap: inside a sentence, when the owner IS the subject, you must switch to sin/sitt/sina.',
      'Han älskar sin fru = he loves his own wife. Han älskar hans fru = he loves some other man\'s wife. Swedish gossip depends on this distinction.',
      'The test: ask "does the thing belong to the sentence\'s subject?" Yes → sin/sitt/sina (agreeing with the thing). No, or the possessive is part of the subject itself → hans/hennes/deras.',
      'That\'s why your teacher corrected "de handlar deras bakelser" to "sina bakelser" (the bakery buys its own pastries) while "Deras bakelser är alltid nybakade" stays deras — there, "their pastries" is the subject, so sin is impossible.',
    ],
  },
  {
    id: 'modals',
    title: 'Modal verbs + infinitive',
    tag: 'Verbs',
    hook: 'kan / vill / ska / måste / får / brukar + bare infinitive — never att.',
    cheat: [
      {
        kind: 'table',
        title: 'The team',
        columns: ['Modal', 'Meaning', 'Example'],
        rows: [
          ['kan', 'can', 'Jag kan inte stanna.'],
          ['vill', 'want to', 'Jag vill äta något gott. (want a THING: vill ha)'],
          ['ska', 'will / going to', 'Vi ska gå på bio på fredag.'],
          ['måste', 'must', 'Jag måste plugga i helgen.'],
          ['får', 'may / get to', 'Du får provsmaka osten.'],
          ['brukar', 'usually', 'Vad brukar du äta till lunch?'],
          ['tänker', 'intend to', 'Jag tänker stanna hemma.'],
        ],
      },
      { kind: 'note', text: 'inte comes right after the modal: kan INTE stanna, vill INTE jobba. And "want a noun" needs ha: Jag vill HA en kaffe — never "jag vill en kaffe".' },
      {
        kind: 'pairs',
        title: 'Past forms',
        items: [
          { sv: 'kunde · ville · skulle · fick · brukade', en: 'could · wanted · was going to · got · used to' },
          { sv: 'Vi skulle träffas klockan fem.', en: 'skulle = was supposed to' },
        ],
      },
    ],
    full: [
      'Modals chain directly onto a bare infinitive — no att, no to: Jag kan simma. Man måste äta. English speakers\' most common A1 error is "kan äter"; your teacher\'s correction "Man kan äta lunch" is the fix.',
      'Ska is the everyday future: Vi ska gå på bio. It carries intention — someone decided. For plain predictions Swedes often use blir instead: Det blir regn i morgon.',
      'Vill means "want TO do". Wanting an object needs vill ha: Jag vill ha en kopp te. Politeness ladder: vill ha → skulle vilja ha → the café-counter shortcut Jag tar….',
      'Får is double-faced: permission (Du får gå nu) and getting-to (Jag fick ett paket — I received). Får inte = not allowed.',
      'Brukar has no English twin — it turns any sentence into a habit: Jag brukar träna på morgonen = I usually work out in the morning. Past brukade = used to.',
      'In V2 terms a modal is the finite verb: it sits in slot 2, the infinitive goes later — På fredag SKA jag GÅ på bio.',
    ],
  },
  {
    id: 'time',
    title: 'Time: clock, days & om vs i',
    tag: 'Time',
    hook: 'halv tre = 2:30, på söndagar = habit, om = future, i = duration.',
    cheat: [
      {
        kind: 'table',
        title: 'The clock',
        columns: ['Swedish', 'Means', 'Trap'],
        rows: [
          ['fem över åtta', '8:05', 'över = past'],
          ['kvart i nio', '8:45', 'i = to'],
          ['halv tre', '2:30 (!)', 'halfway TO three'],
          ['fem i halv nio', '8:25', 'the tricky zone'],
          ['fem över halv nio', '8:35', ''],
        ],
      },
      {
        kind: 'pairs',
        title: 'Prepositions of time',
        items: [
          { sv: 'på morgonen · på kvällen · på söndagar', en: 'parts of day; PLURAL day = every (habit)' },
          { sv: 'Bussen kommer om tre minuter.', en: 'om + time = IN (future)' },
          { sv: 'Jag tränar i två timmar. / Jag har bott här i tre år.', en: 'i + time = FOR (duration)' },
          { sv: 'tre gånger i veckan — två gånger om dagen', en: 'per week/month = i · per day/year = om' },
          { sv: 'för två veckor sedan', en: 'ago = för … sedan' },
        ],
      },
    ],
    full: [
      'The clock\'s one landmine: halv counts toward the NEXT hour. Halv tre is 2:30, halv ett is 12:30. Minutes use över (past) and i (to): tio över åtta, kvart i nio.',
      'The 25–35 window pivots around the half hour: 8:25 = fem i halv nio (five to half-nine), 8:35 = fem över halv nio. Learn those two and the whole dial unlocks.',
      'Days: på måndag = this coming Monday; på måndagar (plural) = every Monday; i måndags = last Monday. The plural-means-habit trick works for all days and helger.',
      'Om vs i is really future vs duration: om tre minuter = three minutes from now; i tre timmar = for a span of three hours. Om also does "per" with natural cycles (om dagen, om året) while i takes the calendar units (i veckan, i månaden).',
      '"Ago" is the sandwich för … sedan: för två år sedan. Your own bio sentences — Jag kom till Sverige för två år sedan; Jag har bott här i tre år — hold the whole system.',
    ],
  },
  {
    id: 'place',
    title: 'Place: på vs i, hem/hemma, ligger/står',
    tag: 'Prepositions',
    hook: 'i for inside-places, på for surfaces/streets/events — and position has its own verbs.',
    cheat: [
      {
        kind: 'pairs',
        title: 'på vs i',
        items: [
          { sv: 'i Malmö · i Sverige · i köket', en: 'i = inside a container: cities, countries, rooms' },
          { sv: 'på Mangogatan 5 · på Odenplan', en: 'på = streets and squares' },
          { sv: 'på jobbet · på kafé · på bio · på fest', en: 'på = workplaces & events (activity-places)' },
          { sv: 'till jobbet — från Iran', en: 'direction: till = to, från = from' },
        ],
      },
      {
        kind: 'table',
        title: 'Motion vs location',
        columns: ['Going (motion)', 'Being (location)'],
        rows: [
          ['hem — Jag går hem.', 'hemma — Jag är hemma.'],
          ['ut', 'ute'],
          ['bort', 'borta'],
        ],
      },
      { kind: 'note', text: 'Things don\'t just "are" somewhere — they LIE, STAND or SIT: Boken LIGGER på bordet (flat), Flaskan STÅR på bordet (upright), Tavlan SITTER på väggen (attached).' },
    ],
    full: [
      'The i/på split follows a container-vs-surface logic: you are IN a city, country or room (i Stockholm, i köket) but ON a street, square, island (på Storgatan, på Odenplan, på Gotland).',
      'Activity-places take på even though you\'re indoors: på jobbet, på kafé, på bio, på gymmet, på fest, på museum. Think of them as events rather than boxes.',
      'Direction words: till for "to" (åka till jobbet), från for "from". And the pairs hem/hemma, ut/ute, bort/borta encode motion vs location in the word itself: gå HEM (going) but vara HEMMA (being). Your homework\'s "åker tillbaka hem" is the motion form.',
      'Where English says "the book is on the table", Swedish prefers a position verb: ligger for horizontal things, står for vertical ones, sitter for attached ones. Using är isn\'t wrong, but ligger/står/sitter is what natives actually say — and your deck\'s cards now hint which one.',
      'Existence is det finns: Det finns ett gym i närheten (there is a gym nearby). Asking where something is sold: Var finns mjölken? For buildings: Var ligger ICA?',
    ],
  },
  {
    id: 'imperative',
    title: 'Imperative — commands & requests',
    tag: 'Verbs',
    hook: 'Group 1 keeps -a, everyone else uses the bare stem. Politeness comes from tack.',
    cheat: [
      {
        kind: 'table',
        title: 'Formation',
        columns: ['Group', 'Present', 'Imperative'],
        rows: [
          ['1', 'arbetar', 'Arbeta!'],
          ['2', 'läser / köper', 'Läs! Köp!'],
          ['3', 'tror', 'Tro!'],
          ['4', 'kommer / dricker', 'Kom! Drick!'],
        ],
      },
      {
        kind: 'pairs',
        title: 'In the wild',
        items: [
          { sv: 'Ta en halstablett! Stanna hemma!', en: 'advice — imperatives are friendly in Swedish' },
          { sv: 'Jobba inte hela natten!', en: 'negative: inte right after the verb' },
          { sv: 'Stäng fönstret, tack!', en: 'politeness = add tack, not "please"' },
          { sv: 'Kom så ska jag visa!', en: 'Kom så… = come and I\'ll…' },
        ],
      },
    ],
    full: [
      'The imperative is the verb\'s shortest outfit. Group 1 verbs keep their -a (Arbeta! Lyssna! Titta!); groups 2–4 strip down to the bare stem (Läs! Kom! Drick! Gå!).',
      'A shortcut that always works: take the infinitive and — for group 1 — use it as is; for the others chop the final -a.',
      'Swedish imperatives are not rude. Recipes, signs, teachers and friendly advice all use them constantly: Krya på dig! Ta det lugnt! Sov gott!',
      'Politeness is carried by tack, tone, or the kan du-question — not by a magic "please" word: Stäng dörren, tack. / Kan du stänga dörren? Snälla exists but is pleading rather than polite: Snälla, läs en bok för mig!',
      'Negate right after the verb: Glöm inte mötet! Oroa dig inte! And deponent -s verbs simply have no imperative — you can\'t command hoppas.',
    ],
  },
  {
    id: 'perfect',
    title: 'Perfect & past — har gjort vs gjorde',
    tag: 'Verbs',
    hook: 'har + supine connects to NOW; the plain past pins a THEN.',
    cheat: [
      {
        kind: 'pairs',
        title: 'The contrast',
        items: [
          { sv: 'Jag har bott här i tre år.', en: 'perfect: still true now (i = for)' },
          { sv: 'Jag bodde i Iran förut.', en: 'past: a closed chapter' },
          { sv: 'Har du ätit frukost?', en: 'perfect: result matters now' },
          { sv: 'Jag åt frukost klockan sju.', en: 'past: a stated time → simple past' },
          { sv: 'Hur länge har du bott i Sverige?', en: 'the classic duration question' },
        ],
      },
      { kind: 'note', text: 'Time signals: i går / förra veckan / för två år sedan → plain past. redan / än / alltid / hela dagen / i tre år → perfect. Word order: Har du INTE ätit? — har is the verb in slot 2.' },
    ],
    full: [
      'The perfect is har + supine (the -t/-it form): har talat, har köpt, har bott, har druckit. Hade + supine gives the pluperfect: hade redan ätit.',
      'Choose the perfect when the past touches now: experience (Har du sett filmen?), result (Jag har glömt nycklarna — they\'re still lost), or unfinished duration (Jag har bott här i tre år — and still do).',
      'Choose the simple past when the moment is anchored: i går, i morse, för två veckor sedan, klockan sju. Jag besökte ett kafé för två veckor sedan.',
      'This maps closely to English have-done vs did, with one twist: Swedish happily says Jag har bott här i tre år where English needs "have been living".',
      'In questions and negations the har does the V2 work: Har du hört nyheten? Jag har inte gjort läxan än. (än = yet, redan = already.)',
    ],
  },
  {
    id: 'synonym-traps',
    title: 'Synonym traps — which word does Swedish want?',
    tag: 'Vocabulary',
    hook: 'Two English words, one Swedish choice — the pairs your flashcard hints pin down.',
    cheat: [
      {
        kind: 'table',
        title: 'The classic pairs',
        columns: ['English', 'Everyday', 'Formal / other', 'Rule of thumb'],
        rows: [
          ['work', 'jobba', 'arbeta', 'same meaning, register differs'],
          ['study', 'plugga', 'studera / läsa', 'läsa = be enrolled in'],
          ['speak/talk', 'prata', 'tala', 'tala språk, hålla tal'],
          ['like', 'gilla', 'tycka om', 'interchangeable'],
          ['think', 'tror (believe)', 'tycker (opinion) / tänker (process)', 'three different verbs!'],
          ['know', 'veta (facts)', 'känna (people)', 'kan = know a skill'],
          ['go', 'gå (walk)', 'åka (by vehicle)', 'gå ≠ travel!'],
          ['watch/see', 'titta på', 'se', 'se en film is fine too'],
        ],
      },
      { kind: 'note', text: 'Tror/tycker/tänker is the crown jewel: Jag TROR att det regnar (belief), Jag TYCKER att filmen är bra (opinion), Jag TÄNKER på dig (process) — and tänker + infinitive = intend to.' },
    ],
    full: [
      'Swedish often has two everyday words where English has one — one informal, one neutral. Neither is wrong; natives just lean informal in speech: jobba over arbeta, plugga over studera, prata over tala.',
      'Some pairs split by MEANING, not register, and using the wrong one changes the sentence. Gå strictly means going on foot: Jag går till Malmö claims you walked there. Any vehicle → åka.',
      'The three "thinks": tro = believe something is true, tycka = hold an opinion/find, tänka = the act of thinking (tänka på = think about; tänker + infinitive = plan to). English "I think it\'s good" is tycker; "I think it\'s raining" is tror.',
      'Veta is knowing facts (Jag vet inte), känna is knowing people (Känner du Anna?), and kunna covers skills and languages (Jag kan svenska). Känna sig + adjective = feel: Jag känner mig trött.',
      'Your flashcards now carry hints like "(use åka, not ta)" precisely because these pairs are invisible from the English side. This sheet is the map behind those hints.',
    ],
  },
  {
    id: 'pronouns',
    title: 'Pronouns: subject, object & man',
    tag: 'Pronouns',
    hook: 'jag→mig, han→honom, de→dem — and man is Swedish\'s favorite subject.',
    cheat: [
      {
        kind: 'table',
        title: 'The full set',
        columns: ['Subject', 'Object', 'English'],
        rows: [
          ['jag', 'mig', 'I / me'],
          ['du', 'dig', 'you'],
          ['han / hon / hen', 'honom / henne / hen', 'he / she / they (sg.)'],
          ['den / det', 'den / det', 'it'],
          ['vi', 'oss', 'we / us'],
          ['ni', 'er', 'you (pl.)'],
          ['de', 'dem', 'they / them'],
        ],
      },
      {
        kind: 'pairs',
        title: 'In action',
        items: [
          { sv: 'Kan du hjälpa mig? — Jag ringer dig i kväll.', en: 'object forms after verbs & prepositions' },
          { sv: 'Man kan äta lunch där. Man måste öva varje dag.', en: 'man = one / you-in-general / people' },
          { sv: 'Vi ses! Vi hörs!', en: 'reciprocal -s verbs: see/hear each other' },
        ],
      },
    ],
    full: [
      'Subject forms drive the sentence; object forms take the action: Jag älskar henne. Hon älskar mig. After prepositions it\'s always the object form: med mig, till honom, för oss.',
      'Mig, dig, sig are pronounced "mej, dej, sej" — and de/dem both come out as "dom" in speech, which is why Swedes themselves mix them up in writing.',
      'Hen is the accepted gender-neutral singular — useful when gender is unknown or irrelevant.',
      'Man is everywhere in Swedish: a generic subject meaning "one/you/people". Man kan inte gilla allt. Hur säger man…? Its object form is en, its possessive ens — but at this level, just master man as subject.',
      'The -s on ses/hörs/träffas makes verbs reciprocal: Vi ses = we\'ll see each other. That\'s the same -s family as the deponents (hoppas, trivs), so no imperative and no extra object needed.',
    ],
  },
];
