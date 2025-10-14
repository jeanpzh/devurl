import { createOfflineLinkSchema } from "@/schemas/create-offline-link.schema";
import { NextRequest, NextResponse } from "next/server";
import { UrlService } from "../url/services/url.service";
import { SlugRepository } from "./repository/slug.repository.impl";
import { SlugService } from "./services/slug.service";
import { supabase } from "@/lib/supabase";
import { env } from "@/lib/config";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { rateLimited, reset, remaining } = await checkRateLimit(request);

  if (rateLimited) {
    return NextResponse.json(
      {
        error: "Demasiadas solicitudes. Por favor, intenta más tarde.",
        reset: new Date(reset).toISOString(),
        remaining,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const { url, slug } = await request.json();
  const parsed = createOfflineLinkSchema.safeParse({ url, slug });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Introdusca una URL válida", details: parsed.error.issues },
      { status: 400 }
    );
  }
  if (url === slug) {
    return NextResponse.json(
      { error: "URL and slug cannot be the same" },
      { status: 400 }
    );
  }
  const slugService = new SlugService(new SlugRepository(supabase));

  const exists = await slugService.exists(slug);
  if (exists) {
    return NextResponse.json(
      { error: "Slug no se puede usar" },
      { status: 409 }
    );
  }

  await slugService.createSlug(parsed.data);

  return NextResponse.json(
    { url: `${env.DOMAIN_URL}/${slug}` },
    { status: 201 }
  );
}
