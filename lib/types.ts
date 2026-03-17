export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: 'customer' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          role?: 'customer' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'customer' | 'admin'
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          id: string
          title: string
          description: string
          price_per_person: number
          duration_minutes: number
          max_capacity: number
          images: string[]
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price_per_person: number
          duration_minutes: number
          max_capacity: number
          images?: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          price_per_person?: number
          duration_minutes?: number
          max_capacity?: number
          images?: string[]
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          id: string
          experience_id: string
          date: string
          start_time: string
          end_time: string
          spots_remaining: number
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          date: string
          start_time: string
          end_time: string
          spots_remaining: number
          created_at?: string
        }
        Update: {
          experience_id?: string
          date?: string
          start_time?: string
          end_time?: string
          spots_remaining?: number
        }
        Relationships: [
          {
            foreignKeyName: 'availability_slots_experience_id_fkey'
            columns: ['experience_id']
            isOneToOne: false
            referencedRelation: 'experiences'
            referencedColumns: ['id']
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          slot_id: string
          guest_count: number
          status: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slot_id: string
          guest_count: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          slot_id?: string
          guest_count?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_slot_id_fkey'
            columns: ['slot_id']
            isOneToOne: false
            referencedRelation: 'availability_slots'
            referencedColumns: ['id']
          }
        ]
      }
      party_packages: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          max_guests: number
          duration_minutes: number
          includes: string[]
          images: string[]
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          max_guests: number
          duration_minutes: number
          includes?: string[]
          images?: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          name?: string
          description?: string
          price?: number
          max_guests?: number
          duration_minutes?: number
          includes?: string[]
          images?: string[]
          is_active?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      party_inquiries: {
        Row: {
          id: string
          user_id: string | null
          package_id: string | null
          contact_name: string
          contact_email: string
          contact_phone: string | null
          preferred_date: string
          guest_count: number
          age_range: string
          message: string
          status: 'new' | 'contacted' | 'confirmed' | 'completed'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          package_id?: string | null
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          preferred_date: string
          guest_count: number
          age_range: string
          message: string
          status?: 'new' | 'contacted' | 'confirmed' | 'completed'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string | null
          package_id?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          preferred_date?: string
          guest_count?: number
          age_range?: string
          message?: string
          status?: 'new' | 'contacted' | 'confirmed' | 'completed'
          admin_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'party_inquiries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'party_inquiries_package_id_fkey'
            columns: ['package_id']
            isOneToOne: false
            referencedRelation: 'party_packages'
            referencedColumns: ['id']
          }
        ]
      }
      slime_inventory: {
        Row: {
          id: string
          name: string
          description: string
          texture_type: string
          color: string
          image_url: string
          is_available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          texture_type: string
          color: string
          image_url: string
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          texture_type?: string
          color?: string
          image_url?: string
          is_available?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image_url: string
          published_at: string | null
          author_id: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          cover_image_url: string
          published_at?: string | null
          author_id: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          cover_image_url?: string
          published_at?: string | null
          author_id?: string
          is_published?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      site_settings: {
        Row: {
          key: string
          value: Record<string, unknown>
          updated_at: string
        }
        Insert: {
          key: string
          value: Record<string, unknown>
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Record<string, unknown>
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
