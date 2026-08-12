import { z } from "zod";

import env from "@next/env";

const environmentVariables = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_DOMAIN_URL: z.url(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

type EnvironmentVariables = z.infer<typeof environmentVariables>;

const projectDir = process.cwd();
env.loadEnvConfig(projectDir);

environmentVariables.parse(process.env);
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
