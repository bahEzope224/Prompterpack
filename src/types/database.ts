// Ce fichier sera généré automatiquement par Supabase CLI
// après avoir créé vos tables. Pour l'instant, on l'initialise manuellement.
// Commande pour le regénérer : npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'admin'
export type ProductStatus = 'draft' | 'published' | 'archived'
export type OrderStatus = 'pending' | 'awaiting_payment' | 'paid' | 'failed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'refunded'
export type AccessStatus = 'active' | 'revoked'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: UserRole
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          is_active?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          long_description: string | null
          price_amount: number
          currency: string
          status: ProductStatus
          category_id: string | null
          preview_content: string | null
          cover_image_url: string | null
          content_file_path: string | null
          prompt_count: number | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          long_description?: string | null
          price_amount: number
          currency?: string
          status?: ProductStatus
          category_id?: string | null
          preview_content?: string | null
          cover_image_url?: string | null
          content_file_path?: string | null
          prompt_count?: number | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          short_description?: string
          long_description?: string | null
          price_amount?: number
          currency?: string
          status?: ProductStatus
          category_id?: string | null
          preview_content?: string | null
          cover_image_url?: string | null
          content_file_path?: string | null
          prompt_count?: number | null
          is_featured?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: OrderStatus
          total_amount: number
          currency: string
          stripe_session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: OrderStatus
          total_amount: number
          currency?: string
          stripe_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: OrderStatus
          stripe_session_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          unit_price: number
          quantity: number
          line_total: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          unit_price: number
          quantity?: number
          line_total: number
        }
        Update: never
      }
      payments: {
        Row: {
          id: string
          order_id: string
          provider: string
          provider_payment_id: string | null
          provider_session_id: string | null
          status: PaymentStatus
          amount: number
          currency: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          status?: PaymentStatus
          amount: number
          currency?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider_payment_id?: string | null
          status?: PaymentStatus
          paid_at?: string | null
          updated_at?: string
        }
      }
      user_product_access: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string
          access_status: AccessStatus
          granted_at: string
          last_accessed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id: string
          access_status?: AccessStatus
          granted_at?: string
          last_accessed_at?: string | null
        }
        Update: {
          access_status?: AccessStatus
          last_accessed_at?: string | null
        }
      }
      webhook_events: {
        Row: {
          id: string
          provider: string
          event_id: string
          event_type: string
          signature_valid: boolean
          processed: boolean
          received_at: string
        }
        Insert: {
          id?: string
          provider: string
          event_id: string
          event_type: string
          signature_valid?: boolean
          processed?: boolean
          received_at?: string
        }
        Update: {
          processed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
