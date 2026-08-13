import { NextRequest, NextResponse } from "next/server";
import { SlugService } from "@/app/api/slug/services/slug.service";
import { SlugRepository } from "@/app/api/slug/repository/slug.repository.impl";
import { redirectRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { object, string } from "zod";
import { after } from "next/server";
import { createAdminClient } from "@/backend/infrastructure/supabase/admin-client";
import { SupabaseClickEventPublisher } from "@/backend/infrastructure/supabase/click-event-publisher";

const getLinkSchema = object({
  slug: string().min(1, "Slug is required"),
});

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) => {
  const identifier = getClientIdentifier(req);
  const { success, reset, remaining } =
    await redirectRateLimit.limit(identifier);

  if (!success) {
    return new NextResponse("Demasiadas redirecciones. Intenta más tarde.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": "20",
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }

  const { slug } = await context.params;
  if (!slug) return new NextResponse("Slug es requerido", { status: 400 });
  const parsed = getLinkSchema.safeParse({ slug });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Slug inválido", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const supabase = await createClient();
  const slugRepo = new SlugRepository(supabase);
  const slugService = new SlugService(slugRepo);

  const { linkId, originalUrl } = await slugService.findBySlug(slug);
  if (!originalUrl) {
    return new NextResponse("Slug no encontrado", { status: 404 });
  }
  const eventId = crypto.randomUUID();
  const adminClient = createAdminClient();
  if (adminClient && linkId !== null) {
    const publisher = new SupabaseClickEventPublisher(adminClient);
    let referrerHost: string | null = null;
    const referrer = req.headers.get("referer");
    if (referrer) {
      try {
        referrerHost = new URL(referrer).host || null;
      } catch {
        referrerHost = null;
      }
    }
    after(() =>
      publisher
        .publish({
          eventId,
          linkId,
          occurredAt: new Date().toISOString(),
          referrerHost,
          countryCode: req.headers.get("cf-ipcountry"),
        })
        .catch(() => console.error("click_event_publish_failed", { eventId })),
    );
  } else if (linkId !== null) {
    console.error("click_event_publish_unavailable", {
      eventId,
      reason: "missing server ingestion credential",
    });
  }
  return NextResponse.redirect(originalUrl);
};
