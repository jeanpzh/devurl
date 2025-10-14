import { SupabaseClient } from "@supabase/supabase-js";
import { ISlugRepository } from "./slug.repository.interface";

export class SlugRepository implements ISlugRepository {
  constructor(private readonly supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }
  async exists(slug: string): Promise<boolean> {
    const { data, error } = await this.supabaseClient
      .from("offline_links")
      .select("id")
      .eq("slug", slug);
    if (error || !data) {
      console.log(error);
      return false;
    }
    return data.length > 0;
  }

  async create(params: { url: string; slug: string }): Promise<{ error: any }> {
    const { error } = await this.supabaseClient.from("offline_links").insert({
      original_url: params.url,
      slug: params.slug,
    });
    if (error) {
      console.log(error);
      throw new Error("Error creating slug");
    }
    return { error };
  }
  async findBySlug(slug: string): Promise<{ originalUrl: string | null }> {
    const { data, error } = await this.supabaseClient
      .from("offline_links")
      .select("original_url")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      console.log(error);
      return { originalUrl: null };
    }
    return { originalUrl: data.original_url };
  }
}
