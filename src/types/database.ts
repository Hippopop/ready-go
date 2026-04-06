export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about: {
        Row: {
          availability_status: string | null
          bio: string | null
          created_at: string | null
          id: string
          location: string | null
          updated_at: string | null
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "about_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          display_order: number | null
          id: string
          issuer: string | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          issuer?: string | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          issuer?: string | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          display_order: number | null
          excerpt: string | null
          id: string
          published_at: string | null
          reading_time_minutes: number | null
          tags: string[] | null
          title: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          tags?: string[] | null
          title: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          tags?: string[] | null
          title?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          badge_image_url: string | null
          created_at: string | null
          credential_url: string | null
          display_order: number | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          name: string
          user_id: string | null
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name: string
          user_id?: string | null
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          portfolio_owner_id: string | null
          sender_email: string
          sender_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          portfolio_owner_id?: string | null
          sender_email: string
          sender_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          portfolio_owner_id?: string | null
          sender_email?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_portfolio_owner_id_fkey"
            columns: ["portfolio_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string | null
          degree: string | null
          description: string | null
          display_order: number | null
          end_year: number | null
          field_of_study: string | null
          gpa: string | null
          honors: string | null
          id: string
          institution: string
          institution_logo_url: string | null
          start_year: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          degree?: string | null
          description?: string | null
          display_order?: number | null
          end_year?: number | null
          field_of_study?: string | null
          gpa?: string | null
          honors?: string | null
          id?: string
          institution: string
          institution_logo_url?: string | null
          start_year?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          degree?: string | null
          description?: string | null
          display_order?: number | null
          end_year?: number | null
          field_of_study?: string | null
          gpa?: string | null
          honors?: string | null
          id?: string
          institution?: string
          institution_logo_url?: string | null
          start_year?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company_logo_url: string | null
          company_name: string
          company_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          role: string
          start_date: string | null
          tech_stack: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_logo_url?: string | null
          company_name: string
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role: string
          start_date?: string | null
          tech_stack?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_logo_url?: string | null
          company_name?: string
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role?: string
          start_date?: string | null
          tech_stack?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hero: {
        Row: {
          created_at: string | null
          cta_primary_text: string | null
          cta_primary_url: string | null
          cta_secondary_text: string | null
          headline: string | null
          id: string
          is_typing_animation: boolean | null
          profile_image_url: string | null
          subheadline: string | null
          tagline: string | null
          typing_texts: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          headline?: string | null
          id?: string
          is_typing_animation?: boolean | null
          profile_image_url?: string | null
          subheadline?: string | null
          tagline?: string | null
          typing_texts?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          headline?: string | null
          id?: string
          is_typing_animation?: boolean | null
          profile_image_url?: string | null
          subheadline?: string | null
          tagline?: string | null
          typing_texts?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      open_source_contributions: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          language: string | null
          repo_name: string
          repo_url: string | null
          role: string | null
          stars: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          language?: string | null
          repo_name: string
          repo_url?: string | null
          role?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          language?: string | null
          repo_name?: string
          repo_url?: string | null
          role?: string | null
          stars?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "open_source_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          live_url: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_settings: {
        Row: {
          ats_mode: boolean | null
          created_at: string | null
          default_template: string | null
          id: string
          include_photo: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ats_mode?: boolean | null
          created_at?: string | null
          default_template?: string | null
          id?: string
          include_photo?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ats_mode?: boolean | null
          created_at?: string | null
          default_template?: string | null
          id?: string
          include_photo?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      section_settings: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          is_visible: boolean | null
          section_key: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          is_visible?: boolean | null
          section_key: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          section_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          icon_url: string | null
          id: string
          name: string
          proficiency: number | null
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          name: string
          proficiency?: number | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          icon_url?: string | null
          id?: string
          name?: string
          proficiency?: number | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          platform: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          platform: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          platform?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_avatar_url: string | null
          author_company: string | null
          author_name: string
          author_title: string | null
          content: string | null
          created_at: string | null
          display_order: number | null
          id: string
          linkedin_url: string | null
          user_id: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_company?: string | null
          author_name: string
          author_title?: string | null
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          linkedin_url?: string | null
          user_id?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_company?: string | null
          author_name?: string
          author_title?: string | null
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          linkedin_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          animation_style: string | null
          border_radius: string | null
          color_accent: string | null
          color_background: string | null
          color_mode: string | null
          color_primary: string | null
          color_surface: string | null
          color_text: string | null
          created_at: string | null
          font_body: string | null
          font_heading: string | null
          id: string
          preset_name: string | null
          spacing: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          animation_style?: string | null
          border_radius?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_mode?: string | null
          color_primary?: string | null
          color_surface?: string | null
          color_text?: string | null
          created_at?: string | null
          font_body?: string | null
          font_heading?: string | null
          id?: string
          preset_name?: string | null
          spacing?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          animation_style?: string | null
          border_radius?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_mode?: string | null
          color_primary?: string | null
          color_surface?: string | null
          color_text?: string | null
          created_at?: string | null
          font_body?: string | null
          font_heading?: string | null
          id?: string
          preset_name?: string | null
          spacing?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
  public: {
    Enums: {},
  },
} as const
