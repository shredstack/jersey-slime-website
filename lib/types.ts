export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string
          date: string
          end_time: string
          experience_id: string
          id: string
          spots_remaining: number
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          experience_id: string
          id?: string
          spots_remaining: number
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          experience_id?: string
          id?: string
          spots_remaining?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          content_format: string
          content_markdown_source: string | null
          cover_image_url: string
          created_at: string
          excerpt: string
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          content_format?: string
          content_markdown_source?: string | null
          cover_image_url: string
          created_at?: string
          excerpt: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          content_format?: string
          content_markdown_source?: string | null
          cover_image_url?: string
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string | null
          created_at: string
          end_time: string | null
          experience_id: string | null
          guest_count: number
          id: string
          notes: string | null
          slot_id: string | null
          start_time: string | null
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date?: string | null
          created_at?: string
          end_time?: string | null
          experience_id?: string | null
          guest_count: number
          id?: string
          notes?: string | null
          slot_id?: string | null
          start_time?: string | null
          status?: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string | null
          created_at?: string
          end_time?: string | null
          experience_id?: string | null
          guest_count?: number
          id?: string
          notes?: string | null
          slot_id?: string | null
          start_time?: string | null
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          event_date: string | null
          event_end_time: string | null
          event_start_time: string | null
          id: string
          images: string[]
          is_active: boolean
          is_special: boolean
          max_bookings: number | null
          max_capacity: number
          price_per_person: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes: number
          event_date?: string | null
          event_end_time?: string | null
          event_start_time?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_special?: boolean
          max_bookings?: number | null
          max_capacity: number
          price_per_person: number
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          event_date?: string | null
          event_end_time?: string | null
          event_start_time?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_special?: boolean
          max_bookings?: number | null
          max_capacity?: number
          price_per_person?: number
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      party_inquiries: {
        Row: {
          admin_notes: string | null
          age_range: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          duration_minutes: number | null
          guest_count: number
          id: string
          message: string
          package_id: string | null
          preferred_date: string
          preferred_time: string | null
          status: string
          total_cost: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          age_range: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          duration_minutes?: number | null
          guest_count: number
          id?: string
          message: string
          package_id?: string | null
          preferred_date: string
          preferred_time?: string | null
          status?: string
          total_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          age_range?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          duration_minutes?: number | null
          guest_count?: number
          id?: string
          message?: string
          package_id?: string | null
          preferred_date?: string
          preferred_time?: string | null
          status?: string
          total_cost?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "party_inquiries_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "party_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      party_packages: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          images: string[]
          includes: string[]
          is_active: boolean
          max_guests: number
          name: string
          price: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes: number
          id?: string
          images?: string[]
          includes?: string[]
          is_active?: boolean
          max_guests: number
          name: string
          price: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          images?: string[]
          includes?: string[]
          is_active?: boolean
          max_guests?: number
          name?: string
          price?: number
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_hour_overrides: {
        Row: {
          close_time: string | null
          created_at: string
          date: string
          id: string
          is_closed: boolean
          note: string | null
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string
          date: string
          id?: string
          is_closed?: boolean
          note?: string | null
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string
          date?: string
          id?: string
          is_closed?: boolean
          note?: string | null
          open_time?: string | null
        }
        Relationships: []
      }
      studio_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string
          updated_at: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time: string
          updated_at?: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          alt_text: string
          category: string
          created_at: string
          id: string
          image_url: string
          is_visible: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string
          category?: string
          created_at?: string
          id?: string
          image_url: string
          is_visible?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          is_visible?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      slime_inventory: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          image_url: string
          is_available: boolean
          name: string
          sort_order: number
          texture_type: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description: string
          id?: string
          image_url: string
          is_available?: boolean
          name: string
          sort_order?: number
          texture_type: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_available?: boolean
          name?: string
          sort_order?: number
          texture_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
