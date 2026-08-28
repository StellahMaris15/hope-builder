export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string;
          category: string;
          content: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          published: boolean;
          published_at: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_name?: string;
          category?: string;
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_name?: string;
          category?: string;
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          donated_at: string;
          donor_email: string | null;
          donor_name: string;
          id: string;
          method: string;
          purpose: string;
          status: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency?: string;
          donated_at?: string;
          donor_email?: string | null;
          donor_name: string;
          id?: string;
          method?: string;
          purpose?: string;
          status?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          donated_at?: string;
          donor_email?: string | null;
          donor_name?: string;
          id?: string;
          method?: string;
          purpose?: string;
          status?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          created_at: string;
          email: string;
          event_id: string | null;
          full_name: string;
          id: string;
          phone: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          event_id?: string | null;
          full_name: string;
          id?: string;
          phone?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          event_id?: string | null;
          full_name?: string;
          id?: string;
          phone?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          capacity: number | null;
          created_at: string;
          description: string;
          ends_at: string | null;
          id: string;
          image_url: string | null;
          location: string;
          published: boolean;
          slug: string;
          starts_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          capacity?: number | null;
          created_at?: string;
          description?: string;
          ends_at?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string;
          published?: boolean;
          slug: string;
          starts_at: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          capacity?: number | null;
          created_at?: string;
          description?: string;
          ends_at?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string;
          published?: boolean;
          slug?: string;
          starts_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media: {
        Row: {
          created_at: string;
          file_name: string;
          id: string;
          mime_type: string | null;
          size_bytes: number | null;
          url: string;
        };
        Insert: {
          created_at?: string;
          file_name: string;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          url: string;
        };
        Update: {
          created_at?: string;
          file_name?: string;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          url?: string;
        };
        Relationships: [];
      };
      mentors: {
        Row: {
          created_at: string;
          email: string;
          expertise: string;
          full_name: string;
          id: string;
          message: string | null;
          phone: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          expertise?: string;
          full_name: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          expertise?: string;
          full_name?: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          is_read: boolean;
          message: string;
          phone: string | null;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          is_read?: boolean;
          message: string;
          phone?: string | null;
          subject?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          phone?: string | null;
          subject?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_active: boolean;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          is_active?: boolean;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      prayer_requests: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_private: boolean;
          request: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          is_private?: boolean;
          request: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_private?: boolean;
          request?: string;
          status?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          created_at: string;
          description: string;
          icon: string;
          id: string;
          image_url: string | null;
          published: boolean;
          slug: string;
          sort_order: number;
          summary: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          image_url?: string | null;
          published?: boolean;
          slug: string;
          sort_order?: number;
          summary?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          image_url?: string | null;
          published?: boolean;
          slug?: string;
          sort_order?: number;
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          is_public: boolean;
          key: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          is_public?: boolean;
          key: string;
          updated_at?: string;
          value?: string;
        };
        Update: {
          is_public?: boolean;
          key?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      volunteers: {
        Row: {
          area_of_interest: string;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          message: string | null;
          phone: string | null;
          status: string;
        };
        Insert: {
          area_of_interest?: string;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          status?: string;
        };
        Update: {
          area_of_interest?: string;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "editor" | "viewer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const;
