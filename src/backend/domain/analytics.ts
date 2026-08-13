export type AnalyticsPeriod = "7d" | "30d" | "90d";

export interface AnalyticsOverview {
  period: {
    key: AnalyticsPeriod;
    from: string;
    to: string;
    coverageStartedAt: string | null;
  };
  summary: {
    clicks: number;
    totalLinks: number;
    activeLinks: number;
    approximateVisitors: number | null;
    previousPeriodChangePercent: number | null;
  };
  timeline: Array<{ bucketStart: string; clicks: number }>;
  topLinks: Array<{ linkId: number; slug: string; clicks: number }>;
  referrers: Array<{ host: string; clicks: number }>;
  recentActivity: Array<{
    eventId: string;
    linkId: number;
    slug: string;
    clickedAt: string;
    referrerHost: string | null;
    countryCode: string | null;
  }>;
}
