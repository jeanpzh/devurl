import { CreateLinkInput } from "@/schemas/link.schema";

import { ISlugRepository } from "../repository/slug.repository.interface";

export class SlugService {
  private readonly slugRepository: ISlugRepository;
  constructor(slugRepository: ISlugRepository) {
    this.slugRepository = slugRepository;
  }
  async createSlug(
    params: CreateLinkInput & { slug: string },
    id?: string,
  ): Promise<void> {
    await this.slugRepository.create(
      {
        url: params.url,
        slug: params.slug,
      },
      id,
    );

    return;
  }
  async exists(slug: string): Promise<boolean> {
    return this.slugRepository.exists(slug);
  }
  async findBySlug(
    slug: string,
  ): Promise<{ linkId: number | null; originalUrl: string | null }> {
    return this.slugRepository.findBySlug(slug);
  }
}
