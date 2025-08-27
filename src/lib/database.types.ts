// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          property_id: string
          type: '勞工舍宿' | '學生宿舍'
          title: string
          subtitle: string | null
          description: string | null
          address: string
          district: string
          price: number
          currency: string
          unit: '床位' | '套房'
          status: 'active' | 'pending' | 'inactive'
          available_at: string
          occupation: string
          images: string[]
          image_url: string | null
          vr: string | null
          rating: number
          review_count: number
          latitude: number
          longitude: number
          nearby_mtr: string[]
          guests: number
          bedrooms: number
          bathrooms: number
          property_type: string
          room_type: 'shared room' | 'private room'
          amenities: string[]
          host_id: string
          host_name: string
          host_avatar: string | null
          host_is_superhost: boolean
          host_response_time: string
          available: boolean
          min_stay: number
          max_stay: number
          check_in: string
          check_out: string
          cancellation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          type: '勞工舍宿' | '學生宿舍'
          title: string
          subtitle?: string | null
          description?: string | null
          address: string
          district: string
          price: number
          currency?: string
          unit: '床位' | '套房'
          status: 'active' | 'pending' | 'inactive'
          available_at: string
          occupation: string
          images?: string[]
          image_url?: string | null
          vr?: string | null
          rating?: number
          review_count?: number
          latitude?: number
          longitude?: number
          nearby_mtr?: string[]
          guests?: number
          bedrooms?: number
          bathrooms?: number
          property_type?: string
          room_type: 'shared room' | 'private room'
          amenities?: string[]
          host_id?: string
          host_name?: string
          host_avatar?: string | null
          host_is_superhost?: boolean
          host_response_time?: string
          available?: boolean
          min_stay?: number
          max_stay?: number
          check_in?: string
          check_out?: string
          cancellation?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          type?: '勞工舍宿' | '學生宿舍'
          title?: string
          subtitle?: string | null
          description?: string | null
          address?: string
          district?: string
          price?: number
          currency?: string
          unit?: '床位' | '套房'
          status?: 'active' | 'pending' | 'inactive'
          available_at?: string
          occupation?: string
          images?: string[]
          image_url?: string | null
          vr?: string | null
          rating?: number
          review_count?: number
          latitude?: number
          longitude?: number
          nearby_mtr?: string[]
          guests?: number
          bedrooms?: number
          bathrooms?: number
          property_type?: string
          room_type?: 'shared room' | 'private room'
          amenities?: string[]
          host_id?: string
          host_name?: string
          host_avatar?: string | null
          host_is_superhost?: boolean
          host_response_time?: string
          available?: boolean
          min_stay?: number
          max_stay?: number
          check_in?: string
          check_out?: string
          cancellation?: string
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
      property_type: '勞工舍宿' | '學生宿舍'
      unit_type: '床位' | '套房'
      property_status: 'active' | 'pending' | 'inactive'
      room_type: 'shared room' | 'private room'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}