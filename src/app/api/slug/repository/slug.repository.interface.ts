export interface ISlugRepository {
  exists(slug: string): Promise<boolean>;
  create(params: {
    url: string;
    slug: string;
  }): Promise<{ error: any }>;
  findBySlug(slug: string): Promise<{ originalUrl: string | null }>;
  incrementClickCount(slug: string): Promise<void>;
}
