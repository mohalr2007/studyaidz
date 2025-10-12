
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
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          username: string | null
          gender: string | null
          field_of_study: string | null
          birthdate: string | null
          created_at: string | null
          avatar_url: string | null;
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          username?: string | null
          gender?: string | null
          field_of_study?: string | null
          birthdate?: string | null
          created_at?: string | null
          avatar_url?: string | null;
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          gender?: string | null
          field_of_study?: string | null
          birthdate?: string | null
          created_at?: string | null
          avatar_url?: string | null;
        }
      }
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
