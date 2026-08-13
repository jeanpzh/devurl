"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  AnalyticsOverview,
  AnalyticsPeriod,
} from "@/backend/domain/analytics";

async function fetchAnalytics(
  period: AnalyticsPeriod,
  signal?: AbortSignal,
): Promise<AnalyticsOverview> {
  const response = await fetch(`/api/analytics?period=${period}`, { signal });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.message ?? "No se pudo cargar la analítica");
  return body;
}

export function useAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: ["analytics", period],
    queryFn: ({ signal }) => fetchAnalytics(period, signal),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  });
}
