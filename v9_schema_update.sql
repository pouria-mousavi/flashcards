-- Run this in your Supabase SQL Editor
ALTER TABLE cards ADD COLUMN IF NOT EXISTS user_notes TEXT;
