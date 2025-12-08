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
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          license_number: string | null
          billing_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          license_number?: string | null
          billing_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          license_number?: string | null
          billing_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      post_types: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          installation_fee: number | null
          reinstall_fee: number | null
          replacement_fee: number | null
          image_url: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          installation_fee?: number | null
          reinstall_fee?: number | null
          replacement_fee?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          installation_fee?: number | null
          reinstall_fee?: number | null
          replacement_fee?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      rider_types: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number | null
          image_url: string | null
          terms: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price?: number | null
          image_url?: string | null
          terms?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number | null
          image_url?: string | null
          terms?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      lockbox_types: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          rental_fee: number | null
          deposit: number | null
          image_url: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          rental_fee?: number | null
          deposit?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          rental_fee?: number | null
          deposit?: number | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      installations: {
        Row: {
          id: string
          user_id: string | null
          post_type_id: string | null
          address: string
          city: string | null
          state: string
          zip: string | null
          agent_ref: string | null
          mls_number: string | null
          sign_description: string | null
          sign_size: string | null
          qr_code: string | null
          status: string
          installation_date: string | null
          scheduled_removal_date: string | null
          actual_removal_date: string | null
          belongs_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          post_type_id?: string | null
          address: string
          city?: string | null
          state?: string
          zip?: string | null
          agent_ref?: string | null
          mls_number?: string | null
          sign_description?: string | null
          sign_size?: string | null
          qr_code?: string | null
          status?: string
          installation_date?: string | null
          scheduled_removal_date?: string | null
          actual_removal_date?: string | null
          belongs_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          post_type_id?: string | null
          address?: string
          city?: string | null
          state?: string
          zip?: string | null
          agent_ref?: string | null
          mls_number?: string | null
          sign_description?: string | null
          sign_size?: string | null
          qr_code?: string | null
          status?: string
          installation_date?: string | null
          scheduled_removal_date?: string | null
          actual_removal_date?: string | null
          belongs_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_type: string
          status: string
          scheduled_date: string | null
          scheduled_time: string | null
          calendly_event_id: string | null
          address: string
          city: string | null
          state: string
          zip: string | null
          notes: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_type: string
          status?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          calendly_event_id?: string | null
          address: string
          city?: string | null
          state?: string
          zip?: string | null
          notes?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_type?: string
          status?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          calendly_event_id?: string | null
          address?: string
          city?: string | null
          state?: string
          zip?: string | null
          notes?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string | null
          order_id: string | null
          invoice_number: string | null
          status: string
          subtotal: number | null
          discount: number
          fuel_surcharge: number
          tax: number
          total: number | null
          due_date: string | null
          paid_date: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_id?: string | null
          invoice_number?: string | null
          status?: string
          subtotal?: number | null
          discount?: number
          fuel_surcharge?: number
          tax?: number
          total?: number | null
          due_date?: string | null
          paid_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_id?: string | null
          invoice_number?: string | null
          status?: string
          subtotal?: number | null
          discount?: number
          fuel_surcharge?: number
          tax?: number
          total?: number | null
          due_date?: string | null
          paid_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
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
  }
}
