-- 1. Drop existing table (Data Reset!)
DROP TABLE IF EXISTS cards;

-- 2. Re-create with new columns
create table cards (
  id uuid default uuid_generate_v4() primary key,
  front text not null, -- Persian
  back text not null,  -- English
  pronunciation text,
  tone text,           -- 'Neutral', 'Formal'
  synonyms text,       -- CSV or String
  examples jsonb,      -- Array of strings
  
  -- Anki Stats
  state text default 'NEW', 
  next_review timestamptz default now(),
  interval int default 0,
  ease_factor float default 2.5,
  created_at timestamptz default now(),
  
  -- Enforce Uniqueness to prevent duplicates
  constraint unique_front unique (front)
);

-- 3. Enable RLS (Optional but good practice)
alter table cards enable row level security;
create policy "Public Access" on cards for all using (true) with check (true);
