export type Json =
  string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: number;
          original_url: string;
          slug: string;
          code: string | null;
          created_at: string | null;
          updated_at: string;
          clicks_count: number;
          is_active: boolean;
          user_id: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["urls"]["Row"]> & {
          original_url: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["urls"]["Row"]>;
      };
      link_click_events: {
        Row: {
          id: number;
          event_id: string;
          link_id: number;
          clicked_at: string;
          referrer_host: string | null;
          country_code: string | null;
          visitor_hash: string | null;
        };
      };
      analytics_coverage: {
        Row: { singleton: boolean; started_at: string | null };
      };
    };
    Functions: {
      get_user_analytics: {
        Args: {
          p_from: string;
          p_to: string;
          p_previous_from: string;
        };
        Returns: Json;
      };
      resolve_active_link: {
        Args: { slug_input: string };
        Returns: { link_id: number; original_url: string }[];
      };
      record_link_click: {
        Args: {
          p_event_id: string;
          p_link_id: number;
          p_clicked_at: string;
          p_referrer_host?: string | null;
          p_country_code?: string | null;
          p_visitor_hash?: string | null;
        };
        Returns: number;
      };
    };
  };
};
