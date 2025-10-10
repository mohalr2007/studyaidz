// This file is a placeholder for your Supabase types.
// You can generate the types for your database by running:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
//
// For more information, see: https://supabase.com/docs/guides/api/generating-types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string // UUID, linked to auth.users.id
          username: string
          full_name: string
          gender: "male" | "female"
          field_of_study: string
          date_of_birth: string // ISO 8601 date string
          created_at: string
          is_profile_complete: boolean
        }
        Insert: {
          id: string
          username: string
          full_name: string
          gender: "male" | "female"
          field_of_study: string
          date_of_birth: string
          created_at?: string
          is_profile_complete?: boolean
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          gender?: "male" | "female"
          field_of_study?: string
          date_of_birth?: string
          created_at?: string
          is_profile_complete?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
