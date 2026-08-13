import { NextResponse } from "next/server";
import { createLinkSchema } from "@/schemas/link.schema";
import { createClient } from "@/lib/supabase/server";

const blockedPaths = ["api", "dashboard"];

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ linkId: string }> },
) => {
  const { linkId: rawLinkId } = await params;
  const linkId = Number(rawLinkId);
  if (!Number.isInteger(linkId)) {
    return NextResponse.json({ message: "Invalid link id" }, { status: 400 });
  }
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
        { status: 400 },
      );
    }

    if (blockedPaths.includes(validated.data.slug ?? "")) {
      return NextResponse.json({ error: "Slug bloqueado" }, { status: 409 });
    }

    const urlHost = new URL(validated.data.url).host;
    const domainHost = new URL(process.env.NEXT_PUBLIC_DOMAIN_URL).host;
    if (urlHost === domainHost) {
      return NextResponse.json(
        { error: "No puedes acortar una URL de este dominio" },
        { status: 400 },
      );
    }

    const { url, slug } = validated.data;
    const { data: oldData } = await supabase
      .from("urls")
      .select("slug")
      .eq("id", linkId)
      .single();

    const oldSlug = oldData?.slug;

    const { data: updatedLink, error } = await supabase
      .from("urls")
      .update({
        original_url: url,
        slug: slug || oldSlug,
      })
      .eq("id", linkId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Slug ya existe" },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          message: "Inténtalo de nuevo más tarde.",
        },
        { status: 500 },
      );
    }

    if (!updatedLink) {
      return NextResponse.json(
        { message: "Link no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Link ha sido actualizado!" });
  } catch {
    return NextResponse.json(
      { message: "Error al actualizar el link" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ linkId: string }> },
) => {
  const { linkId: rawLinkId } = await params;
  if (!rawLinkId) {
    return NextResponse.json({ message: "Invalid link id" }, { status: 400 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const numericLinkId = Number(rawLinkId);
  let deleteQuery = supabase.from("urls").delete().eq("user_id", user.id);

  // Accept the legacy slug identifier while clients transition to numeric IDs.
  deleteQuery = Number.isInteger(numericLinkId)
    ? deleteQuery.eq("id", numericLinkId)
    : deleteQuery.eq("slug", rawLinkId);

  const { data, error } = await deleteQuery.select("id").maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Unable to delete link" },
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json(
      { message: "Link no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Link deleted successfully" });
};
