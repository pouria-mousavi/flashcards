
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          front: string
          back: string
          pronunciation: string | null
          tone: string | null
          synonyms: string | null
          examples: Json | null
          state: string
          next_review: string
          interval: number
          ease_factor: number
          created_at: string
          user_notes: string | null
          word_forms: Json | null
          other_meanings: Json | null
          native_speaking: boolean | null
          daily_synonym: string | null
          usage_note: string | null
        }
        Insert: {
          id?: string
          front: string
          back: string
          pronunciation?: string | null
          tone?: string | null
          synonyms?: string | null
          examples?: string[] | null
          state?: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING'
          next_review?: string
          interval?: number
          ease_factor?: number
          created_at?: string
          user_notes?: string | null
          word_forms?: Json | null
          other_meanings?: Json | null
          native_speaking?: boolean | null
          daily_synonym?: string | null
          usage_note?: string | null
        }
        Update: {
          id?: string
          front?: string
          back?: string
          pronunciation?: string | null
          tone?: string | null
          synonyms?: string | null
          examples?: string[] | null
          state?: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING'
          next_review?: string
          interval?: number
          ease_factor?: number
          created_at?: string
          user_notes?: string | null
          word_forms?: Json | null
          other_meanings?: Json | null
          native_speaking?: boolean | null
          daily_synonym?: string | null
          usage_note?: string | null
        }
      }
      grammar_cards: {
        Row: {
          id: string
          front: string
          back: string
          state: string
          next_review: string
          interval: number
          ease_factor: number
          created_at: string
        }
        Insert: {
          id?: string
          front: string
          back: string
          state?: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING'
          next_review?: string
          interval?: number
          ease_factor?: number
          created_at?: string
        }
        Update: {
          id?: string
          front?: string
          back?: string
          state?: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING'
          next_review?: string
          interval?: number
          ease_factor?: number
          created_at?: string
        }
      }
    }
  }
}
