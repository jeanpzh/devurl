import { SupabaseClient } from "@supabase/supabase-js";
import type { LinkRepository } from "@/backend/application/ports/link-repository";
import type {
  LinkStatus,
  ListLinksQuery,
  PaginatedLinks,
} from "@/backend/domain/link";
import { UrlRepository } from "./url.repository";

export class UrlRepositoryImpl implements UrlRepository, LinkRepository {
  private readonly supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async findAll(
    id: string,
    offset: number,
    limit: number,
    searchTerm?: string,
    status: LinkStatus = "all",
  ): Promise<{ data: ShortLink[]; count: number }> {
    let query = this.supabaseClient
      .from("urls")
      .select(
        "id,user_id,original_url,slug,created_at,updated_at,clicks_count,is_active",
        { count: "exact" },
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (searchTerm) {
      query = query.or(
        `slug.ilike.%${searchTerm}%,original_url.ilike.%${searchTerm}%`,
      );
    }
    if (status === "active") query = query.eq("is_active", true);
    if (status === "no_clicks") query = query.eq("clicks_count", 0);

    const { data, count, error } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (error) throw new Error("Error consiguiendo las URLs");

    return { data: data ?? [], count: count || 0 };
  }

  async listOwned(query: ListLinksQuery): Promise<PaginatedLinks> {
    const { data, count } = await this.findAll(
      query.userId,
      (query.page - 1) * query.limit,
      query.limit,
      query.searchTerm,
      query.status,
    );
    return {
      data: (data as ShortLink[]).map((link) => ({
        id: link.id,
        userId: link.user_id,
        slug: link.slug,
        originalUrl: link.original_url,
        isActive: link.is_active,
        clicksCount: link.clicks_count,
        createdAt: link.created_at,
        updatedAt: link.updated_at,
      })) as PaginatedLinks["data"],
      metadata: {
        total: count,
        totalPages: Math.ceil(count / query.limit),
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async findActiveBySlug(
    slug: string,
  ): Promise<{ id: number; originalUrl: string } | null> {
    const { data, error } = await this.supabaseClient.rpc(
      "resolve_active_link",
      {
        slug_input: slug,
      },
    );
    if (error) throw new Error("Unable to resolve link");
    const link = data?.[0];
    return link ? { id: link.link_id, originalUrl: link.original_url } : null;
  }
}
