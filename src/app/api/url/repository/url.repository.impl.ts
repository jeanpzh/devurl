import { SupabaseClient } from "@supabase/supabase-js";
import { UrlRepository } from "./url.repository";

export class UrlRepositoryImpl implements UrlRepository {
  private readonly supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async create(params: {
    originalUrl: string;
  }): Promise<{ data: number; error: any }> {
    const { data, error } = await this.supabaseClient
      .from("url")
      .insert({ original_url: params.originalUrl })
      .select("id")
      .single();
    if (error || !data || !data.id) {
      console.log(JSON.stringify(error));
      throw new Error("Error creating URL");
    }
    return { data: data.id, error: null };
  }
  async findbyShortUrl(code: string): Promise<{ originalUrl: string }> {
    const { data, error } = await this.supabaseClient
      .from("url")
      .select("original_url")
      .eq("code", code)
      .single();

    if (error) throw new Error("URL not found");

    return { originalUrl: data.original_url };
  }
  async update(id: number, data: { code: string }): Promise<{ error: any }> {
    const { error } = await this.supabaseClient
      .from("url")
      .update({ code: data.code })
      .eq("id", id);
    return { error };
  }
  async findAll(
    id: string,
    offset: number,
    limit: number,
    searchTerm?: string
  ): Promise<{ data: ShortLink[]; count: number }> {
    const { data, count, error } = await this.supabaseClient
      .from("urls")
      .select("*", { count: "exact" })
      .eq("user_id", id)
      .ilike("slug", `%${searchTerm || ""}%`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    console.log("Fetched URLs:", data, "Count:", count);

    if (error) throw new Error("Error consiguiendo las URLs");

    return { data, count: count || 0 };
  }
}
