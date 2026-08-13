import { NextRequest, NextResponse } from "next/server";
import { UrlRepositoryImpl } from "./repository/url.repository.impl";
import { UrlService } from "./services/url.service";
import { createClient } from "@/lib/supabase/server";
import { urlQuerySchema } from "@/schemas/url-query.schema";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.nextUrl);

  const parsedQuery = urlQuerySchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  if (!parsedQuery.success) {
    return NextResponse.json(
      { message: "Invalid query parameters", errors: parsedQuery.error.issues },
      { status: 400 },
    );
  }
  const { page, limit, q: searchTerm, status } = parsedQuery.data;
  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (!data?.user || userError)
    return new NextResponse("Unauthorized", { status: 401 });
  const offset = (page - 1) * limit;

  const urlService = new UrlService(new UrlRepositoryImpl(supabase));
  const urls = await urlService.findAll(
    data.user.id,
    offset,
    limit,
    page,
    searchTerm,
    status,
  );
  return NextResponse.json(urls);
};
