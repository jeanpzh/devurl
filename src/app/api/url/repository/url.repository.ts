export interface UrlRepository {
  create(data: { originalUrl: string }): Promise<{ data: number; error: any }>;
  findbyShortUrl(code: string): Promise<{ originalUrl: string }>;
  update(id: number, data: { code: string }): Promise<{ error: any }>;
  findAll(
    id: string,
    offset: number,
    limit: number,
    searchTerm?: string
  ): Promise<{ data: ShortLink[]; count: number }>;
}
