import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/functions";
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
  // Vercel sanitizes the forwarded IP header before it reaches functions.
  // Keep requests without a detectable address in one bounded bucket rather
  // than allowing callers to choose an arbitrary rate-limit key.
  return `ip:${ipAddress(request) ?? "unknown"}`;
}

export async function checkRateLimit(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { success, limit, reset, remaining } =
    await slugRateLimit.limit(identifier);

  return {
    rateLimited: !success,
    limit,
    reset,
    remaining,
    identifier,
  };
}
