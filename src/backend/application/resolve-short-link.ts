import type { LinkRepository } from "./ports/link-repository";

export class ResolveShortLink {
  constructor(private readonly repository: LinkRepository) {}

  async execute(slug: string) {
    return this.repository.findActiveBySlug(slug);
  }
}
