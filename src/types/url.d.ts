interface ShortLink {
  id: number;
  user_id: string | null;
  original_url: string;
  slug: string;
  created_at: string;
  updated_at: string;
  clicks_count: number;
  is_active: boolean;
}
