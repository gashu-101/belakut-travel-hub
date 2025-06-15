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
      experiences: {
        Row: {
          category: string | null
          created_at: string
          duration: string | null
          id: string
          image: string | null
          location: string | null
          name: string
          price_per_guest: number | null
          provider: string | null
          rating: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name: string
          price_per_guest?: number | null
          provider?: string | null
          rating?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          price_per_guest?: number | null
          provider?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      hotel_halls: {
        Row: {
          accommodation_limit: string | null
          additional_services: string[] | null
          created_at: string
          hall_type: Database["public"]["Enums"]["hall_type"]
          hotel_id: string | null
          id: string
          price: number | null
        }
        Insert: {
          accommodation_limit?: string | null
          additional_services?: string[] | null
          created_at?: string
          hall_type: Database["public"]["Enums"]["hall_type"]
          hotel_id?: string | null
          id?: string
          price?: number | null
        }
        Update: {
          accommodation_limit?: string | null
          additional_services?: string[] | null
          created_at?: string
          hall_type?: Database["public"]["Enums"]["hall_type"]
          hotel_id?: string | null
          id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_halls_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_images: {
        Row: {
          caption: string | null
          created_at: string
          hotel_id: string | null
          id: string
          image_type: string | null
          image_url: string
          sort_order: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          hotel_id?: string | null
          id?: string
          image_type?: string | null
          image_url: string
          sort_order?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          hotel_id?: string | null
          id?: string
          image_type?: string | null
          image_url?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_images_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          additional_services: string[] | null
          created_at: string
          features: string[] | null
          hotel_id: string | null
          id: string
          price: number | null
          room_type: Database["public"]["Enums"]["room_type"]
          total_numbers: number
        }
        Insert: {
          additional_services?: string[] | null
          created_at?: string
          features?: string[] | null
          hotel_id?: string | null
          id?: string
          price?: number | null
          room_type: Database["public"]["Enums"]["room_type"]
          total_numbers?: number
        }
        Update: {
          additional_services?: string[] | null
          created_at?: string
          features?: string[] | null
          hotel_id?: string | null
          id?: string
          price?: number | null
          room_type?: Database["public"]["Enums"]["room_type"]
          total_numbers?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_services: {
        Row: {
          created_at: string
          description: string | null
          features: string[] | null
          hotel_id: string | null
          id: string
          price: number | null
          service_category: Database["public"]["Enums"]["service_category"]
          service_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          hotel_id?: string | null
          id?: string
          price?: number | null
          service_category: Database["public"]["Enums"]["service_category"]
          service_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          hotel_id?: string | null
          id?: string
          price?: number | null
          service_category?: Database["public"]["Enums"]["service_category"]
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_services_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          amenities: string[] | null
          created_at: string
          description: string | null
          gallery: string[] | null
          id: string
          image: string | null
          location: string
          name: string
          owner_id: string | null
          price_range: Database["public"]["Enums"]["price_range"] | null
          rating: number | null
          type: Database["public"]["Enums"]["hotel_type"] | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          location: string
          name: string
          owner_id?: string | null
          price_range?: Database["public"]["Enums"]["price_range"] | null
          rating?: number | null
          type?: Database["public"]["Enums"]["hotel_type"] | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          location?: string
          name?: string
          owner_id?: string | null
          price_range?: Database["public"]["Enums"]["price_range"] | null
          rating?: number | null
          type?: Database["public"]["Enums"]["hotel_type"] | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          experience_id: string | null
          hotel_id: string | null
          id: string
          photos: string[] | null
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          experience_id?: string | null
          hotel_id?: string | null
          id?: string
          photos?: string[] | null
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          experience_id?: string | null
          hotel_id?: string | null
          id?: string
          photos?: string[] | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      hall_type: "Meeting Rooms" | "Conference Rooms" | "Banquet Room"
      hotel_type: "Hotel" | "Resort" | "Lodge" | "Guesthouse"
      price_range: "$$" | "$$$" | "$$$$"
      room_type:
        | "Standard Rooms"
        | "Deluxe Rooms"
        | "Suites"
        | "Family Rooms"
        | "Bridal Rooms"
      service_category:
        | "Restaurants"
        | "Spa/Massage"
        | "Swimming Pools"
        | "Game zones"
        | "Shops"
        | "Gym"
        | "Parking"
        | "Boating"
        | "Transportation"
        | "Wifi"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      hall_type: ["Meeting Rooms", "Conference Rooms", "Banquet Room"],
      hotel_type: ["Hotel", "Resort", "Lodge", "Guesthouse"],
      price_range: ["$$", "$$$", "$$$$"],
      room_type: [
        "Standard Rooms",
        "Deluxe Rooms",
        "Suites",
        "Family Rooms",
        "Bridal Rooms",
      ],
      service_category: [
        "Restaurants",
        "Spa/Massage",
        "Swimming Pools",
        "Game zones",
        "Shops",
        "Gym",
        "Parking",
        "Boating",
        "Transportation",
        "Wifi",
      ],
    },
  },
} as const
