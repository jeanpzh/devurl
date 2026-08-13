import type {
  AnalyticsOverview,
  AnalyticsPeriod,
} from "../../domain/analytics";

export interface AnalyticsReader {
  getOverview(input: {
    userId: string;
    period: AnalyticsPeriod;
    now?: Date;
  }): Promise<AnalyticsOverview>;
}
