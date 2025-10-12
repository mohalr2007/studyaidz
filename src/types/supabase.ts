
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
      profiles: { // added by AI — Supabase profile connection
        Row: { // added by AI — Supabase profile connection
          id: string // added by AI — Supabase profile connection
          user_id: string // added by AI — Supabase profile connection
          email: string // added by AI — Supabase profile connection
          full_name: string | null // added by AI — Supabase profile connection
          username: string | null // added by AI — Supabase profile connection
          gender: string | null // added by AI — Supabase profile connection
          field_of_study: string | null // added by AI — Supabase profile connection
          birthdate: string | null // added by AI — Supabase profile connection
          created_at: string | null // added by AI — Supabase profile connection
        } // added by AI — Supabase profile connection
        Insert: { // added by AI — Supabase profile connection
          id?: string // added by AI — Supabase profile connection
          user_id: string // added by AI — Supabase profile connection
          email: string // added by AI — Supabase profile connection
          full_name?: string | null // added by AI — Supabase profile connection
          username?: string | null // added by AI — Supabase profile connection
          gender?: string | null // added by AI — Supabase profile connection
          field_of_study?: string | null // added by AI — Supabase profile connection
          birthdate?: string | null // added by AI — Supabase profile connection
          created_at?: string | null // added by AI — Supabase profile connection
        } // added by AI — Supabase profile connection
        Update: { // added by AI — Supabase profile connection
          id?: string // added by AI — Supabase profile connection
          user_id?: string // added by AI — Supabase profile connection
          email?: string // added by AI — Supabase profile connection
          full_name?: string | null // added by AI — Supabase profile connection
          username?: string | null // added by AI — Supabase profile connection
          gender?: string | null // added by AI — Supabase profile connection
          field_of_study?: string | null // added by AI — Supabase profile connection
          birthdate?: string | null // added by AI — Supabase profile connection
          created_at?: string | null // added by AI — Supabase profile connection
        } // added by AI — Supabase profile connection
      } // added by AI — Supabase profile connection
      students: {
        Row: {
          id: string
          username: string
          full_name: string
          gender: "male" | "female"
          field_of_study: string
          date_of_birth: string
          created_at: string
          is_profile_complete: boolean
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
        }
      },
      posts: {
        Row: {
            id: number
            created_at: string
            title: string
            content: string
            author_id: string
            upvotes: number
            downvotes: number
        }
        Insert: {
            id?: number
            created_at?: string
            title: string
            content: string
            author_id: string
            upvotes?: number
            downvotes?: number
        }
        Update: {
            id?: number
            created_at?: string
            title?: string
            content?: string
            author_id?: string
            upvotes?: number
            downvotes?: number
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
