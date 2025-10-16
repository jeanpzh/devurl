import { NextRequest, NextResponse } from "next/server";
import { SlugService } from "@/app/api/slug/services/slug.service";
import { SlugRepository } from "@/app/api/slug/repository/slug.repository.impl";
import { redirectRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { object, string } from "zod";

const getLinkSchema = object({
  slug: string().min(1, "Slug is required"),
});

export const GET = async (
  req: NextRequest,
  context: Promise<{ params: { slug: string } }>
) => {
  const identifier = getClientIdentifier(req);
  const { success, reset, remaining } = await redirectRateLimit.limit(
    identifier
  );

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

  const { params } = await context;
  const { slug } = params;
  if (!slug) return new NextResponse("Slug es requerido", { status: 400 });
  const parsed = getLinkSchema.safeParse({ slug });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Slug inválido", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const supabase = await createClient();
  const slugRepo = new SlugRepository(supabase);
  const slugService = new SlugService(slugRepo);

  const { originalUrl } = await slugService.findBySlug(slug);
  if (!originalUrl) {
    return new NextResponse("Slug no encontrado", { status: 404 });
  }
  await slugService.incrementClickCount(slug);
  return NextResponse.redirect(originalUrl);
};
