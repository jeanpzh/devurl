import { NextRequest, NextResponse } from "next/server";
import { UrlRepositoryImpl } from "./repository/url.repository.impl";
import { UrlService } from "./services/url.service";
import { createClient } from "@/lib/supabase/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.nextUrl);

  const term = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = parseInt(searchParams.get("limit") || "10", 10) || 10;
  const searchTerm = term ? term.trim() : undefined;
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (!data || userError)
    return new NextResponse("Unauthorized", { status: 401 });
  const offset = (page - 1) * limit;

  const urlService = new UrlService(new UrlRepositoryImpl(supabase));
  const urls = await urlService.findAll(
    data.user?.id!,
    offset,
    limit,
    page,
    searchTerm
  );
  return NextResponse.json(urls);
};
