import type { LinkStatus } from "@/backend/domain/link";

export interface UrlRepository {
  findAll(
    id: string,
    offset: number,
    limit: number,
    searchTerm?: string,
    status?: LinkStatus,
  ): Promise<{ data: ShortLink[]; count: number }>;
}
