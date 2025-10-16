import { object, string, url } from "zod";

export const serverEnvSchema = object({
  SUPABASE_URL: url(),
  SUPABASE_KEY: string(),
  DOMAIN_URL: url(),
});

export const clientEnvSchema = object({
  NEXT_PUBLIC_DOMAIN_URL: url(),
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
});

export const env =
  typeof window === "undefined" ? { ...serverEnv, ...clientEnv } : clientEnv;

export type ServerEnv = typeof serverEnv;
export type ClientEnv = typeof clientEnv;
export type Env = typeof env;
