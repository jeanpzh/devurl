import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import { NextRequest } from "next/server";

export const slugRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:slug",
});

export const redirectRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:redirect",
});

export function getClientIdentifier(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for");
  if (!ip) return "anonymous";
  return ip.split(",")[0].trim();
}

export async function checkRateLimit(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { success, limit, reset, remaining } = await slugRateLimit.limit(
    identifier
  );

  return {
    rateLimited: !success,
    limit,
    reset,
    remaining,
    identifier,
  };
}
