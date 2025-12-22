-- V17 Migration: Queue & Word Forms

-- 1. Create a Persistent Queue for Book Mode
-- This table will store words you look up in Book Mode for manual processing later.
create table if not exists book_queue (
  id uuid default gen_random_uuid() primary key,
  word text not null,
  context text, -- Optional: sentence where found
  status text default 'PENDING', -- PENDING, PROCESSED
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add 'word_forms' column to Cards table
-- This will store Noun, Verb, Adjective, Adverb, etc.
alter table cards 
add column if not exists word_forms jsonb;

-- Example Data Structure for word_forms:
-- {
--   "noun": "creation",
--   "verb": "create",
--   "adj": "creative",
--   "adv": "creatively",
--   "past": "created",
--   "pp": "created"
-- }
