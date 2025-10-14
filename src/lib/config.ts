import { object, string, url } from "zod";

export const envSchema = object({
  SUPABASE_URL: url(),
  SUPABASE_KEY: string(),
  DOMAIN_URL: url(),
});
export const env = envSchema.parse(process.env);
export type Env = typeof env;
