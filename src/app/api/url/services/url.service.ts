import { redis } from "@/lib/redis";
import { UrlRepository } from "../repository/url.repository";
import { URLResponse } from "../interface/url-response";

export class UrlService {
  private readonly urlRepository: UrlRepository;

  constructor(urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async invalidateUserListCache(userId: string): Promise<void> {
    try {
      const pattern = `url_list:${userId}:*`;
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(
          `Invalidated ${keys.length} cache entries for user ${userId}`
        );
      }
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  }

  async invalidateShortUrlCache(code: string): Promise<void> {
    try {
      await redis.del(`short_url:${code}`);
      console.log(`Invalidated cache for short URL: ${code}`);
    } catch (error) {
      console.error("Error invalidating short URL cache:", error);
    }
  }

  async findbyShortUrl(code: string): Promise<{ originalUrl: string }> {
    const cached = await redis.get<{ originalUrl: string }>(
      `short_url:${code}`
    );
    if (cached) {
      console.log("USING CACHE for short URL:", code);
      return cached;
    }

    const shortUrl = await this.urlRepository.findbyShortUrl(code);

    if (shortUrl?.originalUrl) {
      await redis.set(`short_url:${code}`, shortUrl, { ex: 60 * 60 * 24 * 7 });
    }

    return shortUrl;
  }

  async findAll(
    id: string,
    offset: number,
    limit: number,
    page: number,
    searchTerm?: string
  ): Promise<URLResponse> {
    const cacheKey = `url_list:${id}:page:${page}:limit:${limit}:search:${
      searchTerm || "none"
    }`;

    const cached = await redis.get<URLResponse>(cacheKey);
    if (cached) {
      console.log(
        "USING CACHE for page",
        page,
        "search:",
        searchTerm || "none",
        cached
      );
      return cached;
    }
    const { data, count } = await this.urlRepository.findAll(
      id,
      offset,
      limit,
      searchTerm
    );
    if (!data)
      return {
        data: [],
        metadata: { total: 0, totalPages: 0, page: 0, limit: 0 },
      };

    if (data?.length === 0)
      return {
        data: [],
        metadata: { total: 0, totalPages: 0, page: 0, limit: 0 },
      };
    const formattedData = this.formatData(data, limit, page, count);

    await redis.set(cacheKey, formattedData, {
      ex: 60 * 5,
    });
    return formattedData;
  }

  async deleteUrl(slug: string, userId: string): Promise<void> {
    await this.invalidateShortUrlCache(slug);

    await this.invalidateUserListCache(userId);
  }

  async updateUrl(userId: string, oldSlug?: string): Promise<void> {
    if (oldSlug) {
      await this.invalidateShortUrlCache(oldSlug);
    }
    await this.invalidateUserListCache(userId);
  }

  private formatData(
    data: ShortLink[],
    limit: number,
    page: number,
    count: number
  ): URLResponse {
    return {
      data,
      metadata: {
        total: count,
        totalPages: Math.ceil(count / limit),
        page,
        limit,
      },
    };
  }
}
