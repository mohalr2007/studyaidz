
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
      },
      posts: {
        Row: {
            id: number
            created_at: string
            title: string
            content: string
            author_id: string // Foreign key to students.id
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
