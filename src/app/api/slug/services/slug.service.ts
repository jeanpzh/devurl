import { CreateLinkInput } from "@/schemas/link.schema";

import { ISlugRepository } from "../repository/slug.repository.interface";
import { redis } from "@/lib/redis";

export class SlugService {
  private readonly slugRepository: ISlugRepository;
  constructor(slugRepository: ISlugRepository) {
    this.slugRepository = slugRepository;
  }
  async createSlug(params: CreateLinkInput, id?: string): Promise<void> {
    console.log("Creating slug with params:", { params });
    await this.slugRepository.create(
      {
        url: params.url,
        slug: params.slug,
      },
      id!
    );

    const pattern = `url_list:${id}:*`;
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del(`short_url:${params.slug}`);
    return;
  }
  async exists(slug: string): Promise<boolean> {
    return this.slugRepository.exists(slug);
  }
  async findBySlug(slug: string): Promise<{ originalUrl: string | null }> {
    return this.slugRepository.findBySlug(slug);
  }
  async incrementClickCount(slug: string): Promise<void> {
    return this.slugRepository.incrementClickCount(slug);
  }
}
