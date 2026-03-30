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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      alpha_signals: {
        Row: {
          card_api_id: string
          card_image: string | null
          card_name: string
          card_set: string
          description: string | null
          detected_at: string
          expires_at: string
          id: string
          price_change_pct: number
          signal_type: string
          strength: string
          volume_change_pct: number
        }
        Insert: {
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_set: string
          description?: string | null
          detected_at?: string
          expires_at?: string
          id?: string
          price_change_pct?: number
          signal_type?: string
          strength?: string
          volume_change_pct?: number
        }
        Update: {
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_set?: string
          description?: string | null
          detected_at?: string
          expires_at?: string
          id?: string
          price_change_pct?: number
          signal_type?: string
          strength?: string
          volume_change_pct?: number
        }
        Relationships: []
      }
      audit_actions: {
        Row: {
          audit_id: string
          category: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          effort: string | null
          id: string
          impact: string | null
          notes: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          audit_id: string
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: string
          impact?: string | null
          notes?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          audit_id?: string
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          effort?: string | null
          id?: string
          impact?: string | null
          notes?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_actions_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "site_audits"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contest_entries: {
        Row: {
          contest_id: string
          final_value: number | null
          id: string
          joined_at: string
          pnl_pct: number | null
          portfolio_id: string
          rank: number | null
          user_id: string
        }
        Insert: {
          contest_id: string
          final_value?: number | null
          id?: string
          joined_at?: string
          pnl_pct?: number | null
          portfolio_id: string
          rank?: number | null
          user_id: string
        }
        Update: {
          contest_id?: string
          final_value?: number | null
          id?: string
          joined_at?: string
          pnl_pct?: number | null
          portfolio_id?: string
          rank?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_entries_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "trading_contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contest_entries_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trader_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      delta_alerts: {
        Row: {
          card_api_id: string
          card_image: string | null
          card_name: string
          card_number: string
          card_set: string
          created_at: string
          deviation_threshold: number
          id: string
          is_active: boolean
          last_deviation: number | null
          last_triggered_at: string | null
          user_id: string
        }
        Insert: {
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_number: string
          card_set: string
          created_at?: string
          deviation_threshold?: number
          id?: string
          is_active?: boolean
          last_deviation?: number | null
          last_triggered_at?: string | null
          user_id: string
        }
        Update: {
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_number?: string
          card_set?: string
          created_at?: string
          deviation_threshold?: number
          id?: string
          is_active?: boolean
          last_deviation?: number | null
          last_triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      index_cache: {
        Row: {
          cache_key: string
          created_at: string
          data: Json
          expires_at: string
          id: string
          updated_at: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          data?: Json
          expires_at: string
          id?: string
          updated_at?: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          data?: Json
          expires_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          alert_threshold: number
          created_at: string
          email_portfolio_alerts: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold?: number
          created_at?: string
          email_portfolio_alerts?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold?: number
          created_at?: string
          email_portfolio_alerts?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_cards: {
        Row: {
          added_at: string
          card_api_id: string
          card_image: string | null
          card_name: string
          card_number: string
          card_set: string
          id: string
          purchase_price: number | null
          quantity: number
          user_id: string
        }
        Insert: {
          added_at?: string
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_number: string
          card_set: string
          id?: string
          purchase_price?: number | null
          quantity?: number
          user_id: string
        }
        Update: {
          added_at?: string
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_number?: string
          card_set?: string
          id?: string
          purchase_price?: number | null
          quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          card_count: number
          created_at: string
          id: string
          snapshot_date: string
          total_cost: number
          total_value: number
          user_id: string
        }
        Insert: {
          card_count?: number
          created_at?: string
          id?: string
          snapshot_date?: string
          total_cost?: number
          total_value: number
          user_id: string
        }
        Update: {
          card_count?: number
          created_at?: string
          id?: string
          snapshot_date?: string
          total_cost?: number
          total_value?: number
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          card_api_id: string
          card_image: string | null
          card_name: string
          card_number: string
          card_set: string
          created_at: string
          direction: string
          id: string
          is_triggered: boolean
          target_price: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_number: string
          card_set: string
          created_at?: string
          direction?: string
          id?: string
          is_triggered?: boolean
          target_price: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_number?: string
          card_set?: string
          created_at?: string
          direction?: string
          id?: string
          is_triggered?: boolean
          target_price?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_public: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_public?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      sentiment_votes: {
        Row: {
          card_api_id: string
          created_at: string
          direction: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_api_id: string
          created_at?: string
          direction?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_api_id?: string
          created_at?: string
          direction?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_audits: {
        Row: {
          categories: Json
          competitive_intel: Json | null
          completed_at: string | null
          created_at: string
          id: string
          legal_compliance: Json | null
          overall_score: number | null
          recommendations: Json | null
          status: string
          summary: string | null
          trigger_type: string
          user_id: string
        }
        Insert: {
          categories?: Json
          competitive_intel?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          legal_compliance?: Json | null
          overall_score?: number | null
          recommendations?: Json | null
          status?: string
          summary?: string | null
          trigger_type?: string
          user_id: string
        }
        Update: {
          categories?: Json
          competitive_intel?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          legal_compliance?: Json | null
          overall_score?: number | null
          recommendations?: Json | null
          status?: string
          summary?: string | null
          trigger_type?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      trade_orders: {
        Row: {
          card_api_id: string
          card_image: string | null
          card_name: string
          card_set: string
          created_at: string
          expires_at: string | null
          filled_at: string | null
          id: string
          limit_price: number | null
          order_type: string
          portfolio_id: string
          price: number
          quantity: number
          side: string
          status: string
          stop_price: number | null
          user_id: string
        }
        Insert: {
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_set: string
          created_at?: string
          expires_at?: string | null
          filled_at?: string | null
          id?: string
          limit_price?: number | null
          order_type?: string
          portfolio_id: string
          price: number
          quantity: number
          side?: string
          status?: string
          stop_price?: number | null
          user_id: string
        }
        Update: {
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_set?: string
          created_at?: string
          expires_at?: string | null
          filled_at?: string | null
          id?: string
          limit_price?: number | null
          order_type?: string
          portfolio_id?: string
          price?: number
          quantity?: number
          side?: string
          status?: string
          stop_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_orders_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trader_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trader_holdings: {
        Row: {
          avg_cost: number
          card_api_id: string
          card_image: string | null
          card_name: string
          card_set: string
          created_at: string
          id: string
          portfolio_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_cost?: number
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_set: string
          created_at?: string
          id?: string
          portfolio_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_cost?: number
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_set?: string
          created_at?: string
          id?: string
          portfolio_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trader_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trader_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trader_portfolios: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          season_id: string
          starting_balance: number
          total_portfolio_value: number
          updated_at: string
          user_id: string
          virtual_balance: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          season_id?: string
          starting_balance?: number
          total_portfolio_value?: number
          updated_at?: string
          user_id: string
          virtual_balance?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          season_id?: string
          starting_balance?: number
          total_portfolio_value?: number
          updated_at?: string
          user_id?: string
          virtual_balance?: number
        }
        Relationships: []
      }
      trading_contests: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string
          entry_balance: number
          id: string
          name: string
          prize_description: string | null
          starts_at: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at: string
          entry_balance?: number
          id?: string
          name: string
          prize_description?: string | null
          starts_at: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string
          entry_balance?: number
          id?: string
          name?: string
          prize_description?: string | null
          starts_at?: string
          status?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          added_at: string
          card_api_id: string
          card_image: string | null
          card_name: string
          card_number: string
          card_set: string
          id: string
          target_price: number | null
          user_id: string
        }
        Insert: {
          added_at?: string
          card_api_id: string
          card_image?: string | null
          card_name: string
          card_number: string
          card_set: string
          id?: string
          target_price?: number | null
          user_id: string
        }
        Update: {
          added_at?: string
          card_api_id?: string
          card_image?: string | null
          card_name?: string
          card_number?: string
          card_set?: string
          id?: string
          target_price?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
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
