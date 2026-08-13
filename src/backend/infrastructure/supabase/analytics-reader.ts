import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AnalyticsOverview,
  AnalyticsPeriod,
} from "@/backend/domain/analytics";
import type { AnalyticsReader } from "@/backend/application/ports/analytics-reader";

const PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export class SupabaseAnalyticsReader implements AnalyticsReader {
  constructor(private readonly supabase: SupabaseClient) {}

  async getOverview({
    period,
    now = new Date(),
  }: {
    userId: string;
    period: AnalyticsPeriod;
    now?: Date;
  }): Promise<AnalyticsOverview> {
    const to = new Date(now);
    const from = new Date(to);
    from.setUTCDate(from.getUTCDate() - PERIOD_DAYS[period]);
    const previousFrom = new Date(from);
    previousFrom.setUTCDate(previousFrom.getUTCDate() - PERIOD_DAYS[period]);

    const [{ data, error }, { count: totalLinks, error: linksError }] =
      await Promise.all([
        this.supabase.rpc("get_user_analytics", {
          p_from: from.toISOString(),
          p_to: to.toISOString(),
          p_previous_from: previousFrom.toISOString(),
        }),
        this.supabase.from("urls").select("id", { count: "exact", head: true }),
      ]);
    if (error || linksError) throw new Error("Unable to load analytics");

    const overview = data as Omit<AnalyticsOverview, "period">;

    return {
      ...overview,
      summary: {
        ...overview.summary,
        totalLinks: totalLinks ?? 0,
      },
      period: {
        key: period,
        from: from.toISOString(),
        to: to.toISOString(),
        coverageStartedAt: data?.coverageStartedAt ?? null,
      },
    };
  }
}
