import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  return createClientComponentClient()
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          region: string | null
          dialects: string[] | null
          avatar_url: string | null
          role: 'contributor' | 'learner' | 'linguist' | 'researcher' | 'admin'
          points: number
          level: number
          badges: string[]
          streak_days: number
          last_activity: string
          accepted_terms: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          region?: string | null
          dialects?: string[] | null
          avatar_url?: string | null
          role?: 'contributor' | 'learner' | 'linguist' | 'researcher' | 'admin'
          points?: number
          level?: number
          badges?: string[]
          streak_days?: number
          last_activity?: string
          accepted_terms?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          region?: string | null
          dialects?: string[] | null
          avatar_url?: string | null
          role?: 'contributor' | 'learner' | 'linguist' | 'researcher' | 'admin'
          points?: number
          level?: number
          badges?: string[]
          streak_days?: number
          last_activity?: string
          accepted_terms?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content_type: 'audio' | 'video' | 'text' | 'image'
          file_url: string | null
          file_size: number | null
          duration: number | null
          dialect: string
          region: string | null
          tags: string[]
          privacy_setting: 'public' | 'community' | 'research' | 'private'
          verification_status: 'pending' | 'verified' | 'flagged' | 'rejected'
          verified_by: string | null
          verified_at: string | null
          transcript: string | null
          translation: string | null
          phonetic_notation: string | null
          grammar_notes: string | null
          likes_count: number
          comments_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          content_type: 'audio' | 'video' | 'text' | 'image'
          file_url?: string | null
          file_size?: number | null
          duration?: number | null
          dialect: string
          region?: string | null
          tags?: string[]
          privacy_setting?: 'public' | 'community' | 'research' | 'private'
          verification_status?: 'pending' | 'verified' | 'flagged' | 'rejected'
          verified_by?: string | null
          verified_at?: string | null
          transcript?: string | null
          translation?: string | null
          phonetic_notation?: string | null
          grammar_notes?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          content_type?: 'audio' | 'video' | 'text' | 'image'
          file_url?: string | null
          file_size?: number | null
          duration?: number | null
          dialect?: string
          region?: string | null
          tags?: string[]
          privacy_setting?: 'public' | 'community' | 'research' | 'private'
          verification_status?: 'pending' | 'verified' | 'flagged' | 'rejected'
          verified_by?: string | null
          verified_at?: string | null
          transcript?: string | null
          translation?: string | null
          phonetic_notation?: string | null
          grammar_notes?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          contribution_id: string
          user_id: string
          content: string
          parent_id: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contribution_id: string
          user_id: string
          content: string
          parent_id?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contribution_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          contribution_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          contribution_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          contribution_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
