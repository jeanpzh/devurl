import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { serverEnv } from "../config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(serverEnv.SUPABASE_URL!, serverEnv.SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {

        }
      },
    },
  });
}
