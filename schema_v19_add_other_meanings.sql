-- Migration: Add other_meanings to cards table
-- Description: Stores other meanings of the word as JSONB array of objects { english: string, persian: string } or similar.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'cards'
        AND column_name = 'other_meanings'
    ) THEN
        ALTER TABLE cards ADD COLUMN other_meanings JSONB;
    END IF;
END $$;
