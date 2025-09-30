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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          accuracy_rate: number | null
          created_at: string
          id: string
          novel_species_count: number | null
          processing_time_seconds: number | null
          project_id: string
          sequences_processed: number | null
          summary: Json | null
          taxa_count: number | null
          user_id: string
        }
        Insert: {
          accuracy_rate?: number | null
          created_at?: string
          id?: string
          novel_species_count?: number | null
          processing_time_seconds?: number | null
          project_id: string
          sequences_processed?: number | null
          summary?: Json | null
          taxa_count?: number | null
          user_id: string
        }
        Update: {
          accuracy_rate?: number | null
          created_at?: string
          id?: string
          novel_species_count?: number | null
          processing_time_seconds?: number | null
          project_id?: string
          sequences_processed?: number | null
          summary?: Json | null
          taxa_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          organization: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          organization?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
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
      sequences: {
        Row: {
          analysis_id: string | null
          created_at: string
          file_id: string
          id: string
          length: number | null
          metadata: Json | null
          quality_score: number | null
          sequence_data: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          file_id: string
          id?: string
          length?: number | null
          metadata?: Json | null
          quality_score?: number | null
          sequence_data: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          file_id?: string
          id?: string
          length?: number | null
          metadata?: Json | null
          quality_score?: number | null
          sequence_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequences_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequences_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
        ]
      }
      taxa_identified: {
        Row: {
          analysis_id: string
          class: string | null
          confidence_score: number | null
          created_at: string
          family: string | null
          genus: string | null
          id: string
          is_novel: boolean | null
          kingdom: string
          order_name: string | null
          phylum: string | null
          sequence_count: number | null
          species: string | null
        }
        Insert: {
          analysis_id: string
          class?: string | null
          confidence_score?: number | null
          created_at?: string
          family?: string | null
          genus?: string | null
          id?: string
          is_novel?: boolean | null
          kingdom: string
          order_name?: string | null
          phylum?: string | null
          sequence_count?: number | null
          species?: string | null
        }
        Update: {
          analysis_id?: string
          class?: string | null
          confidence_score?: number | null
          created_at?: string
          family?: string | null
          genus?: string | null
          id?: string
          is_novel?: boolean | null
          kingdom?: string
          order_name?: string | null
          phylum?: string | null
          sequence_count?: number | null
          species?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxa_identified_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_results"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_files: {
        Row: {
          file_name: string
          file_size: number
          file_type: string
          id: string
          project_id: string
          storage_path: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          file_name: string
          file_size: number
          file_type: string
          id?: string
          project_id: string
          storage_path: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          project_id?: string
          storage_path?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
