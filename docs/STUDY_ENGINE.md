# Sustainable A1 study

The active course is Swedish A1, using Rivstart A1–A2 and Form i fokus A. Existing cards are sufficient to begin; a current chapter is not required.

## Daily behaviour

- Twenty active minutes total per account per Stockholm date, across Swedish and English. Background time, pauses, and waiting for learning steps do not count.
- Missed days retain real due dates and the same twenty-minute allowance on return. No debt of extra minutes and no automatic postponement of review deadlines.
- Learning cards that are due lead, then review cards ordered by estimated recall probability. Legacy cards use relative lateness until FSRS has a real observation.
- New Swedish cards pause when reviews fill the available session slots; otherwise at most two per day. New English intake is paused. Existing English reviews remain available.
- Repeated failures stop reappearing in the same round after two consecutive Again ratings. Their due date is retained; this is not suspension or mastery.
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

## Verification and release

Run `npm ci`, `npm test`, and `npm run build` on Node 24. Tests exercise missed days, both Stockholm DST transitions, overlapping timers, both real study screens, storage failures, review replay, stale-device conflicts, permissions, and the actual SQL migration in PGlite. Live verification compares checksums of all legacy progress and session rows before and after, checks all content patches, and tests the review RPC in a rolled-back transaction.

The repository has pre-existing lint failures; compare touched files against the previous commit and introduce none. The build's existing large-chunk warning remains.

AI generation is independent of scheduling and these teacher-led edits. Neither an AI API key nor Ollama is required to study. The separate OpenAI generation endpoint requires provider quota and deployment; that is not a prerequisite for this release.

References: [FSRS implementation](https://github.com/open-spaced-repetition/ts-fsrs), [Anki's FSRS options](https://docs.ankiweb.net/deck-options#fsrs).
