"use client";

import { useQuery } from "@tanstack/react-query";

interface LinksResponse {
  data: ShortLink[];
  metadata: { total: number; totalPages: number; page: number; limit: number };
}

async function fetchDashboardLinks(
  signal?: AbortSignal,
): Promise<LinksResponse> {
  const response = await fetch("/api/url?page=1&limit=100&status=all", {
    signal,
  });
  if (!response.ok) throw new Error("No se pudieron cargar tus links");
  return response.json();
}

export function useDashboardLinks() {
  return useQuery({
    queryKey: ["urls", "dashboard-overview"],
    queryFn: ({ signal }) => fetchDashboardLinks(signal),
    staleTime: 30_000,
  });
}
