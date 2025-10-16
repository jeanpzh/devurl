export interface URLResponse {
  data: ShortLink[];
  metadata: { total: number; totalPages: number; page: number; limit: number };
}
