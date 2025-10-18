export interface ISlugRepository {
  exists(slug: string): Promise<boolean>;
  create(params: { url: string; slug: string }, userId?: string): Promise<void>;
  findBySlug(slug: string): Promise<{ originalUrl: string | null }>;
  incrementClickCount(slug: string): Promise<void>;
}
