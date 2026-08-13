import type { LinkRepository } from "./ports/link-repository";
import type { ListLinksQuery, PaginatedLinks } from "../domain/link";

export class ListUserLinks {
  constructor(private readonly repository: LinkRepository) {}

  execute(query: ListLinksQuery): Promise<PaginatedLinks> {
    return this.repository.listOwned(query);
  }
}
