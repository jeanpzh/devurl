import { z } from "zod";

import env from "@next/env";

const environmentVariables = z.object({
  SUPABASE_URL: z.url(),
  PUBLISHABLE_KEY: z.string(),
  DOMAIN_URL: z.url(),
  NEXT_PUBLIC_DOMAIN_URL: z.url(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

type EnvironmentVariables = z.infer<typeof environmentVariables>;

const projectDir = process.cwd();

env.loadEnvConfig(projectDir);

environmentVariables.parse(process.env);
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
