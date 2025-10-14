import { CreateOfflineLinkInput } from "@/schemas/create-offline-link.schema";
import { ISlugRepository } from "../repository/slug.repository.interface";

export class SlugService {
  private readonly slugRepository: ISlugRepository;
  constructor(slugRepository: ISlugRepository) {
    this.slugRepository = slugRepository;
  }
  async createSlug(params: CreateOfflineLinkInput) {
    const { error } = await this.slugRepository.create(params);
    if (error) throw new Error("Error creating slug");
  }
  async exists(slug: string): Promise<boolean> {
    return this.slugRepository.exists(slug);
  }
  async findBySlug(slug: string): Promise<{ originalUrl: string | null }> {
    return this.slugRepository.findBySlug(slug);
  }
}
