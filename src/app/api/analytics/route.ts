import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SupabaseAnalyticsReader } from "@/backend/infrastructure/supabase/analytics-reader";
import { GetAnalytics } from "@/backend/application/get-analytics";
import { z } from "zod";

const querySchema = z.object({
  period: z.enum(["7d", "30d", "90d"]).default("30d"),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    period: request.nextUrl.searchParams.get("period") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid analytics period", errors: parsed.error.issues },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const analytics = await new GetAnalytics(
      new SupabaseAnalyticsReader(supabase),
    ).execute({
      userId: authData.user.id,
      period: parsed.data.period,
    });
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json(
      { message: "Unable to load analytics" },
      { status: 500 },
    );
  }
}
