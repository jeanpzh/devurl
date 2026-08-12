import type { PostgrestError } from "@supabase/supabase-js";

export interface UrlRepository {
  create(data: {
    originalUrl: string;
  }): Promise<{ data: number; error: PostgrestError | null }>;
  findbyShortUrl(code: string): Promise<{ originalUrl: string }>;
  update(id: number, data: { code: string }): Promise<{ error: PostgrestError | null }>;
  findAll(
    id: string,
    offset: number,
    limit: number,
    searchTerm?: string
  ): Promise<{ data: ShortLink[]; count: number }>;
}
