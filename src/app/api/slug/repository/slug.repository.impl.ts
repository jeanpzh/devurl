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
    if (error) throw new Error("Error comprobando el slug");
    return data.length > 0;
  }

  async create(
    params: {
      url: string;
      slug: string;
    },
    userId?: string,
  ): Promise<void> {
    const { error } = await this.supabaseClient.from("urls").insert({
      user_id: userId ?? null,
      original_url: params.url,
      slug: params.slug,
    });
    if (error) {
      if (error.code === "23505") throw new Error("Slug ya existe");
      throw new Error("Error creando el slug");
    }
  }
  async findBySlug(
    slug: string,
  ): Promise<{ linkId: number | null; originalUrl: string | null }> {
    const { data, error } = await this.supabaseClient.rpc(
      "resolve_active_link",
      {
        slug_input: slug,
      },
    );
    if (error) throw new Error("Unable to resolve link");
    return {
      linkId: data?.[0]?.link_id ?? null,
      originalUrl: data?.[0]?.original_url ?? null,
    };
  }
}
