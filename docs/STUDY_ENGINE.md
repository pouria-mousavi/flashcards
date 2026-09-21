# Sustainable A1 study

The active course is Swedish A1, using Rivstart A1–A2 and Form i fokus A. Existing cards are sufficient to begin; a current chapter is not required.

## Daily behaviour

- Roughly twenty active minutes total per account per Stockholm date, across Swedish and English. The guide runs quietly in the background: there is no countdown or moving progress bar. Reaching it lets the learner finish and rate the current card before suggesting a break. Background time, pauses, and waiting for learning steps do not count.
- Missed days retain real due dates and the same twenty-minute allowance on return. No debt of extra minutes and no automatic postponement of review deadlines.
- Rounds contain up to five cards. One short due review can open the review portion; the remaining learning and review cards retain scheduler order. Review cards are ordered by estimated recall probability; legacy cards use relative lateness until FSRS has a real observation.
- New Swedish cards pause when reviews fill the available session slots; otherwise at most two per day. New English intake is paused. Existing English reviews remain available.
- Each selected card appears once per round. Again saves the actual FSRS learning step without adding more cards to the current round. It can return in a later round when due; this is not suspension or mastery.
- Say the requested answer before revealing it. Again means forgotten; Hard means recalled with difficulty. Notes, examples and form tables are support rather than extra answers to memorise on every visit.

## Scheduling and storage

The pinned `ts-fsrs@5.4.2` scheduler uses default parameters, desired retention 0.90, interval fuzz, a three-year maximum interval and ten-minute learning/relearning steps. Desired retention is a model target, not a guarantee under a time cap. Parameters have not been personally optimised.

Existing data lacks reliable individual review timestamps. No history is invented from previously smoothed deadlines. A card's first actual answer under the new version anchors its FSRS state as a cold start; legacy counters are retained. A successful first answer can produce a shorter interval than its old SM-2 interval. New event records label legacy initialisation explicitly.

Apply `supabase/migrations/202609200001_study_engine.sql` before releasing the client. It creates `study_card_state`, `study_review_events`, and `study_time_segments`, with per-account read policies and authenticated write functions. It also makes the old backlog-smoothing endpoint return zero so old tabs cannot postpone cards. It does not update existing progress, card scheduling fields, or historical session totals.

Ratings are first stored individually in localStorage. A storage failure stops the card advance. The database atomically stores each accepted event and its resulting schedule; event IDs make retries idempotent. Revision and parent-event checks reject stale device branches without overwriting the current schedule. Conflicting attempts remain in the event log and are excluded from accepted-review statistics.

Study time syncs periodically, on ratings, and at session/visibility transitions. Overlapping time ranges count once. Disconnected devices cannot enforce a globally exact cap until they reconnect. Offline ratings remain local until confirmed; clearing browser storage before syncing loses them. Initial deck loading needs the network.

The old progress tables are retained as the baseline for cards not yet reviewed with FSRS. They are not the authoritative schedule for cards with a new `study_card_state` row. Legacy pending user ratings from old clients are replayed normally, but do not replace an existing FSRS state.

## Existing-card content repair

All 1,792 Swedish, 6,676 English and 89 grammar records were considered in the audit; this is not a claim that every translation has been teacher-reviewed.

The first Swedish repair preserves every answer and card ID. It clarifies 18 difficult or ambiguous cards with guided cues or original, shorter teaching examples. It also moves 518 active-card source/grammar entries out of sentence translations and labels them as notes. There are 520 affected content rows in total. The JSON examples now allow `kind: "note"` and `source`; notes never receive Swedish sentence audio. Full word forms and notes are optional expandable references.

The content patch is backed up and guarded against concurrent edits. Only `front` and `examples` are updated. Existing progress, answers, topics, retirement state and word forms are unchanged. Long sentence cards still need further individual teaching review; this release does not pretend they all became atomic A1 prompts. A future card with a genuinely different learning target must receive its own identity rather than inherit mastery from another target.

### Calm restart follow-up

The follow-up audit again considered every record and checked learning history across all accounts. It improves 464 active Swedish content rows: 46 unused, overloaded cards become one focused recall task each; seven cards receive individually revised examples or explanations, and remaining changes move grammatical labels and source references out of spoken examples. Eighty duplicate answer examples become quiet grammar notes. Some categories overlap.

For example, the unused card asking for both “Jag har ett litet hus” and “Jag har två små hus” becomes “Jag har två ___ hus. (small — plural of liten)”, with the answer “små” and one short translated example. Other repairs separate several time expressions or questions into a single task. No extra cards are added. Learned targets retain their prompts, answers and identities; long learned cards can still need a later individual review.

Changes to unused targets require no review history in any account, no FSRS state or event, and NEW global state, rechecked inside the content transaction. All content edits compare the original fields before updating. The backup includes original cards. Only `front`, `front_lang`, `back`, `examples` and `word_forms` can change; unrelated word-form tables are removed from the refocused unused cards. Scheduling columns and all progress, review-event and time tables remain unchanged.

The owner's current English and Swedish round pointers are cleared once per browser on opening this release, using an account-specific marker. Pending ratings, learning history, due dates and time usage are retained. This is a fresh round, not a reset of what has been learned. Later paused rounds can be resumed normally. A “Start a fresh round” action also clears the Swedish round pointer without changing any learning state.

The home page has a single study action. Grammar, word forms, card browsing, quizzes and progress remain available through “Your learning space”. Cards show one example first and tuck further examples, notes and forms into expandable sections. This follows the [minimum information principle](https://www.supermemo.com/en/blog/twenty-rules-of-formulating-knowledge); trying to retrieve an answer before revealing it is supported by [research on vocabulary retrieval practice](https://learninglab.psych.purdue.edu/downloads/2008/2008_Karpicke_Roediger_Science.pdf). Five cards is a practical starting point, not a scientific optimum.

## Verification and release

Run `npm ci`, `npm test`, and `npm run build` on Node 24. Tests exercise missed days, both Stockholm DST transitions, overlapping timers, both real study screens, storage failures, review replay, stale-device conflicts, permissions, and the actual SQL migration in PGlite. Live verification compares checksums of all legacy progress and session rows before and after, checks all content patches, and tests the review RPC in a rolled-back transaction.

The repository has pre-existing lint failures; compare touched files against the previous commit and introduce none. The build's existing large-chunk warning remains.

AI generation is independent of scheduling and these teacher-led edits. Neither an AI API key nor Ollama is required to study. The separate OpenAI generation endpoint requires provider quota and deployment; that is not a prerequisite for this release.

References: [FSRS implementation](https://github.com/open-spaced-repetition/ts-fsrs), [Anki's FSRS options](https://docs.ankiweb.net/deck-options#fsrs).
