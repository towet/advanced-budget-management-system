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
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          spent: number
          category: string
          period: 'monthly' | 'yearly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          spent?: number
          category: string
          period: 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          spent?: number
          category?: string
          period?: 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string
          date: string
          receipt_url: string | null
          budget_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description: string
          date?: string
          receipt_url?: string | null
          budget_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string
          date?: string
          receipt_url?: string | null
          budget_id?: string | null
          created_at?: string
        }
      }
      incomes: {
        Row: {
          id: string
          user_id: string
          amount: number
          source: string
          date: string
          recurring: boolean
          budget_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          source: string
          date?: string
          recurring?: boolean
          budget_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          source?: string
          date?: string
          recurring?: boolean
          budget_id?: string | null
          created_at?: string
        }
      }
    }
  }
}