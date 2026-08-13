import { createLinkSchema } from "@/schemas/link.schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/backend/infrastructure/supabase/admin-client";
import { SlugRepository } from "@/app/api/slug/repository/slug.repository.impl";
import { SlugService } from "@/app/api/slug/services/slug.service";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

const blockedPaths = ["api", "dashboard"];

export async function POST(request: NextRequest) {
  try {
    const { rateLimited, reset, remaining } = await checkRateLimit(request);
    if (rateLimited) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor, intenta más tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    const parsed = createLinkSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Introduzca una URL válida", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const slug = parsed.data.slug || randomBytes(5).toString("hex");
    if (blockedPaths.includes(slug)) {
      return NextResponse.json({ error: "Slug bloqueado" }, { status: 409 });
    }

    const domainUrl = process.env.DOMAIN_URL;
    if (!domainUrl) {
      return NextResponse.json(
        { error: "La creación pública no está disponible" },
        { status: 503 },
      );
    }

    if (new URL(parsed.data.url).host === new URL(domainUrl).host) {
      return NextResponse.json(
        { error: "No puedes acortar una URL de este dominio" },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: "La creación pública no está disponible" },
        { status: 503 },
      );
    }

    const slugService = new SlugService(new SlugRepository(adminClient));
    if (await slugService.exists(slug)) {
      return NextResponse.json(
        { error: "Slug no se puede usar" },
        { status: 409 },
      );
    }

    await slugService.createSlug({ ...parsed.data, slug });

    return NextResponse.json(
      { url: `${domainUrl}/${slug}`, slug },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Slug ya existe") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Solicitud inválida" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "No se pudo crear el link" },
      { status: 503 },
    );
  }
}
