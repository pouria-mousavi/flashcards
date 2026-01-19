
-- V18 Standardization: Front Definition & Other Meanings

-- 1. Add Front Definition (Non-spoiler English definition on the front)
alter table cards 
add column if not exists front_definition text;

-- 2. Add Other Meanings (For words with multiple distinct meanings)
-- This will store an array of objects or strings.
-- Example: [{"part_of_speech": "verb", "definition": "To run fast", "translation": "دویدن"}, ...]
alter table cards 
add column if not exists other_meanings jsonb;
