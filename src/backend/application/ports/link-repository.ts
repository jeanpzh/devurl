import type { Link, ListLinksQuery, PaginatedLinks } from "../../domain/link";

export interface LinkRepository {
  listOwned(query: ListLinksQuery): Promise<PaginatedLinks>;
  findActiveBySlug(
    slug: string,
  ): Promise<Pick<Link, "id" | "originalUrl"> | null>;
}
