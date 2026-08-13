import type { SupabaseClient } from "@supabase/supabase-js";

export interface ClickEvent {
  eventId: string;
  linkId: number;
  occurredAt: string;
  referrerHost: string | null;
  countryCode: string | null;
}

export class SupabaseClickEventPublisher {
  constructor(private readonly supabase: SupabaseClient) {}

  async publish(event: ClickEvent): Promise<void> {
    const { error } = await this.supabase.rpc("record_link_click", {
      p_event_id: event.eventId,
      p_link_id: event.linkId,
      p_clicked_at: event.occurredAt,
      p_referrer_host: event.referrerHost,
      p_country_code: event.countryCode,
      p_visitor_hash: null,
    });
    if (error) throw new Error("Unable to record click event");
  }
}
