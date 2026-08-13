import type { AnalyticsReader } from "./ports/analytics-reader";
import type { AnalyticsOverview, AnalyticsPeriod } from "../domain/analytics";

export class GetAnalytics {
  constructor(private readonly reader: AnalyticsReader) {}

  execute(input: {
    userId: string;
    period: AnalyticsPeriod;
    now?: Date;
  }): Promise<AnalyticsOverview> {
    return this.reader.getOverview(input);
  }
}
