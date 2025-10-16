import { NextResponse } from "next/server";
import { createLinkSchema } from "@/schemas/link.schema";
import { UrlService } from "../services/url.service";
import { UrlRepositoryImpl } from "../repository/url.repository.impl";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";

const blockedPaths = ["api", "dashboard"];

export const PATCH = async (
  request: Request,
  { params }: { params: { linkId: number } }
) => {
  const { linkId } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createLinkSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validated.error.issues },
        { status: 400 }
      );
    }

    if (blockedPaths.includes(validated.data.slug)) {
      return NextResponse.json({ error: "Slug bloqueado" }, { status: 409 });
    }

    const urlHost = new URL(validated.data.url).host;
    const domainHost = new URL(env.NEXT_PUBLIC_DOMAIN_URL).host;
    if (urlHost === domainHost) {
      return NextResponse.json(
        { error: "No puedes acortar una URL de este dominio" },
        { status: 400 }
      );
    }

    const { url, slug } = validated.data;
    const { data: oldData } = await supabase
      .from("urls")
      .select("slug")
      .eq("id", linkId)
      .single();

    const oldSlug = oldData?.slug;

    const { data, error } = await supabase
      .from("urls")
      .update({
        original_url: url,
        slug: slug,
      })
      .eq("id", linkId);
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Slug ya existe" },
          { status: 400 }
        );
      }
      console.log("Error updating URL:", error);
      return NextResponse.json(
        {
          message: "Inténtalo de nuevo más tarde.",
        },
        { status: 500 }
      );
    }

    const urlRepository = new UrlRepositoryImpl(supabase);
    const urlService = new UrlService(urlRepository);
    await urlService.updateUrl(user.id, oldSlug);

    return NextResponse.json({ message: "Link ha sido actualizado!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar el link" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { linkId: string } }
) => {
  const { linkId } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("urls")
    .delete()
    .eq("slug", linkId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const urlRepository = new UrlRepositoryImpl(supabase);
  const urlService = new UrlService(urlRepository);
  await urlService.deleteUrl(linkId, user.id);

  return NextResponse.json({ message: "Link deleted successfully" });
};
