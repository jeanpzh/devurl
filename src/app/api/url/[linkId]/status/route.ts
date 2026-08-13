import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({ isActive: z.boolean() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId: rawLinkId } = await params;
  const linkId = Number(rawLinkId);
  if (!Number.isInteger(linkId)) {
    return NextResponse.json({ message: "Invalid link id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.issues },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("urls")
    .update({ is_active: parsed.data.isActive })
    .eq("id", linkId)
    .eq("user_id", authData.user.id)
    .select("id,is_active")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: "Unable to update link status" },
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json(
      { message: "Link no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: data.id, isActive: data.is_active });
}
