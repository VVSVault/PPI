export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrderStatus = 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
export type InstallationStatus = 'active' | 'removal_scheduled' | 'removed'
export type UserRole = 'customer' | 'admin'
export type PropertyType = 'commercial' | 'house' | 'construction' | 'multi_family' | 'bare_land'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          company_name: string | null
          license_number: string | null
          stripe_customer_id: string | null
          default_payment_method_id: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone: string
          company_name?: string | null
          license_number?: string | null
          stripe_customer_id?: string | null
          default_payment_method_id?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          company_name?: string | null
          license_number?: string | null
          stripe_customer_id?: string | null
          default_payment_method_id?: string | null
          role?: UserRole
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
          price: number
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
          price: number
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
          price?: number
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      rider_catalog: {
        Row: {
          id: string
          name: string
          slug: string
          rental_price: number
          install_price: number
          requires_input: boolean
          input_label: string | null
          image_url: string | null
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          rental_price?: number
          install_price?: number
          requires_input?: boolean
          input_label?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          rental_price?: number
          install_price?: number
          requires_input?: boolean
          input_label?: string | null
          image_url?: string | null
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
          install_price: number
          rental_price: number | null
          is_rentable: boolean
          is_active: boolean
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          install_price?: number
          rental_price?: number | null
          is_rentable?: boolean
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          install_price?: number
          rental_price?: number | null
          is_rentable?: boolean
          is_active?: boolean
          display_order?: number | null
          created_at?: string
        }
      }
      customer_signs: {
        Row: {
          id: string
          user_id: string
          description: string
          size: string | null
          quantity: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          size?: string | null
          quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          size?: string | null
          quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_riders: {
        Row: {
          id: string
          user_id: string
          rider_type: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rider_type: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rider_type?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      customer_lockboxes: {
        Row: {
          id: string
          user_id: string
          lockbox_type: string
          lockbox_code: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lockbox_type: string
          lockbox_code?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lockbox_type?: string
          lockbox_code?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      customer_brochure_boxes: {
        Row: {
          id: string
          user_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: OrderStatus
          property_type: PropertyType
          property_address: string
          property_city: string
          property_state: string
          property_zip: string
          installation_location: string | null
          installation_notes: string | null
          requested_date: string | null
          scheduled_date: string | null
          completed_date: string | null
          is_expedited: boolean
          subtotal: number
          fuel_surcharge: number
          expedite_fee: number
          total: number
          stripe_payment_intent_id: string | null
          payment_status: PaymentStatus
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number?: string
          status?: OrderStatus
          property_type: PropertyType
          property_address: string
          property_city: string
          property_state?: string
          property_zip: string
          installation_location?: string | null
          installation_notes?: string | null
          requested_date?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          is_expedited?: boolean
          subtotal: number
          fuel_surcharge?: number
          expedite_fee?: number
          total: number
          stripe_payment_intent_id?: string | null
          payment_status?: PaymentStatus
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: OrderStatus
          property_type?: PropertyType
          property_address?: string
          property_city?: string
          property_state?: string
          property_zip?: string
          installation_location?: string | null
          installation_notes?: string | null
          requested_date?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          is_expedited?: boolean
          subtotal?: number
          fuel_surcharge?: number
          expedite_fee?: number
          total?: number
          stripe_payment_intent_id?: string | null
          payment_status?: PaymentStatus
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_type: string
          item_category: string | null
          description: string
          quantity: number
          unit_price: number
          total_price: number
          customer_sign_id: string | null
          customer_rider_id: string | null
          customer_lockbox_id: string | null
          customer_brochure_box_id: string | null
          custom_value: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          item_type: string
          item_category?: string | null
          description: string
          quantity?: number
          unit_price: number
          total_price: number
          customer_sign_id?: string | null
          customer_rider_id?: string | null
          customer_lockbox_id?: string | null
          customer_brochure_box_id?: string | null
          custom_value?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          item_type?: string
          item_category?: string | null
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          customer_sign_id?: string | null
          customer_rider_id?: string | null
          customer_lockbox_id?: string | null
          customer_brochure_box_id?: string | null
          custom_value?: string | null
          created_at?: string
        }
      }
      installations: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          address: string
          city: string
          state: string
          zip: string
          post_type: string
          sign_description: string | null
          status: InstallationStatus
          installation_date: string
          removal_scheduled_date: string | null
          removal_completed_date: string | null
          mls_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          address: string
          city: string
          state?: string
          zip: string
          post_type: string
          sign_description?: string | null
          status?: InstallationStatus
          installation_date: string
          removal_scheduled_date?: string | null
          removal_completed_date?: string | null
          mls_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          address?: string
          city?: string
          state?: string
          zip?: string
          post_type?: string
          sign_description?: string | null
          status?: InstallationStatus
          installation_date?: string
          removal_scheduled_date?: string | null
          removal_completed_date?: string | null
          mls_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      installation_riders: {
        Row: {
          id: string
          installation_id: string
          rider_type: string
          custom_value: string | null
          is_rental: boolean
          created_at: string
        }
        Insert: {
          id?: string
          installation_id: string
          rider_type: string
          custom_value?: string | null
          is_rental?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          installation_id?: string
          rider_type?: string
          custom_value?: string | null
          is_rental?: boolean
          created_at?: string
        }
      }
      installation_lockboxes: {
        Row: {
          id: string
          installation_id: string
          lockbox_type: string
          lockbox_code: string | null
          is_rental: boolean
          created_at: string
        }
        Insert: {
          id?: string
          installation_id: string
          lockbox_type: string
          lockbox_code?: string | null
          is_rental?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          installation_id?: string
          lockbox_type?: string
          lockbox_code?: string | null
          is_rental?: boolean
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          stripe_payment_method_id: string
          card_brand: string | null
          card_last4: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_method_id: string
          card_brand?: string | null
          card_last4?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_method_id?: string
          card_brand?: string | null
          card_last4?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          is_default?: boolean
          created_at?: string
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
      order_status: OrderStatus
      payment_status: PaymentStatus
      installation_status: InstallationStatus
      user_role: UserRole
      property_type: PropertyType
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type PostType = Database['public']['Tables']['post_types']['Row']
export type RiderCatalog = Database['public']['Tables']['rider_catalog']['Row']
export type LockboxType = Database['public']['Tables']['lockbox_types']['Row']
export type CustomerSign = Database['public']['Tables']['customer_signs']['Row']
export type CustomerRider = Database['public']['Tables']['customer_riders']['Row']
export type CustomerLockbox = Database['public']['Tables']['customer_lockboxes']['Row']
export type CustomerBrochureBox = Database['public']['Tables']['customer_brochure_boxes']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Installation = Database['public']['Tables']['installations']['Row']
export type InstallationRider = Database['public']['Tables']['installation_riders']['Row']
export type InstallationLockbox = Database['public']['Tables']['installation_lockboxes']['Row']
export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

// Order with items
export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

// Installation with riders and lockboxes
export type InstallationWithDetails = Installation & {
  installation_riders: InstallationRider[]
  installation_lockboxes: InstallationLockbox[]
}

// Customer with inventory
export type CustomerWithInventory = Profile & {
  customer_signs: CustomerSign[]
  customer_riders: CustomerRider[]
  customer_lockboxes: CustomerLockbox[]
  customer_brochure_boxes: CustomerBrochureBox[]
}
