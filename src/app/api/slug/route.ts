import { createLinkSchema } from "@/schemas/link.schema";
import { NextRequest, NextResponse } from "next/server";
import { SlugRepository } from "./repository/slug.repository.impl";
import { SlugService } from "./services/slug.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "node:crypto";

const blockedPaths = ["api", "dashboard"];

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
      },
    );
  }

  const { url, slug: requestedSlug } = await request.json();
  const parsed = createLinkSchema.safeParse({ url, slug: requestedSlug });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Introdusca una URL válida", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const slug = parsed.data.slug || randomBytes(5).toString("hex");

  if (blockedPaths.includes(slug)) {
    return NextResponse.json({ error: "Slug bloqueado" }, { status: 409 });
  }

  const urlHost = new URL(parsed.data.url).host;
  const domainHost = new URL(process.env.NEXT_PUBLIC_DOMAIN_URL).host;
  if (urlHost === domainHost) {
    return NextResponse.json(
      { error: "No puedes acortar una URL de este dominio" },
      { status: 400 },
    );
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slugService = new SlugService(new SlugRepository(supabase));

  const exists = await slugService.exists(slug);
  if (exists) {
    return NextResponse.json(
      { error: "Slug no se puede usar" },
      { status: 409 },
    );
  }
  await slugService.createSlug({ ...parsed.data, slug }, user.id);

  return NextResponse.json(
    { url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${slug}`, slug },
    { status: 201 },
  );
}
