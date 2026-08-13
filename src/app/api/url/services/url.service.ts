import { UrlRepository } from "../repository/url.repository";
import { URLResponse } from "../interface/url-response";
import type { LinkStatus } from "@/backend/domain/link";

export class UrlService {
  private readonly urlRepository: UrlRepository;

  constructor(urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async findAll(
    id: string,
    offset: number,
    limit: number,
    page: number,
    searchTerm?: string,
    status: LinkStatus = "all",
  ): Promise<URLResponse> {
    const { data, count } = await this.urlRepository.findAll(
      id,
      offset,
      limit,
      searchTerm,
      status,
    );
    return this.formatData(data, limit, page, count);
  }

  private formatData(
    data: ShortLink[],
    limit: number,
    page: number,
    count: number,
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
