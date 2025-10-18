import { SupabaseClient } from "@supabase/supabase-js";
import { ISlugRepository } from "./slug.repository.interface";

export class SlugRepository implements ISlugRepository {
  constructor(private readonly supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }
  async exists(slug: string): Promise<boolean> {
    const { data, error } = await this.supabaseClient
      .from("urls")
      .select("id")
      .eq("slug", slug);
    if (error || !data) {
      console.log(error);
      return false;
    }
    return data.length > 0;
  }

  async create(
    params: {
      url: string;
      slug: string;
    },
    id?: string
  ): Promise<void> {
    const { error } = await this.supabaseClient.from("urls").insert({
      user_id: id!,
      original_url: params.url,
      slug: params.slug,
    });
    if (error) {
      console.log(error);
      throw new Error("Error creando el slug");
    }
  }
  async findBySlug(slug: string): Promise<{ originalUrl: string | null }> {
    const { data, error } = await this.supabaseClient
      .from("urls")
      .select("original_url")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      console.log(error);
      return { originalUrl: null };
    }
    return { originalUrl: data.original_url };
  }
  async incrementClickCount(slug: string): Promise<void> {
    const { error } = await this.supabaseClient.rpc("increment_clicks", {
      slug_input: slug,
    });
    if (error) {
      console.log(error);
    }
    console.log("Incremented click count for slug:", slug);
    return;
  }
}
