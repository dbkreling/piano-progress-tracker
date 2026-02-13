/**
 * Database types for Supabase.
 *
 * In a real project, these types should be generated automatically using:
 * npx supabase gen types typescript --project-id <project-id> --schema public > src/services/supabase/database.types.ts
 *
 * For now, we provide a placeholder type structure.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          duration_minutes: number;
          rating: number | null;
          notes: string | null;
          is_for_next_lesson: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          duration_minutes: number;
          rating?: number | null;
          notes?: string | null;
          is_for_next_lesson?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          duration_minutes?: number;
          rating?: number | null;
          notes?: string | null;
          is_for_next_lesson?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      practice_items: {
        Row: {
          id: string;
          practice_session_id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          practice_session_id: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          practice_session_id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
      };
      syllabus_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          level: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          level: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          level?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      theory_levels: {
        Row: {
          id: string;
          level_name: string;
          scales_list: Json | null;
          repertoire: Json | null;
          technical_requirements: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          level_name: string;
          scales_list?: Json | null;
          repertoire?: Json | null;
          technical_requirements?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          level_name?: string;
          scales_list?: Json | null;
          repertoire?: Json | null;
          technical_requirements?: Json | null;
          created_at?: string;
        };
      };
      user_theory_progress: {
        Row: {
          id: string;
          user_id: string;
          level: string;
          topic: string;
          score: number | null;
          last_review: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level: string;
          topic: string;
          score?: number | null;
          last_review?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: string;
          topic?: string;
          score?: number | null;
          last_review?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
