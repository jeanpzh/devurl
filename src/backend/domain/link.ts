export interface Link {
  id: number;
  userId: string | null;
  slug: string;
  originalUrl: string;
  isActive: boolean;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
}

export type LinkStatus = "all" | "active" | "no_clicks";

export interface ListLinksQuery {
  userId: string;
  page: number;
  limit: number;
  searchTerm?: string;
  status: LinkStatus;
}

export interface PaginatedLinks {
  data: Link[];
  metadata: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
