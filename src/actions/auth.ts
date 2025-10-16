"use server";

import { serverEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${serverEnv.DOMAIN_URL}/auth/callback`,
    },
  });
  if (error) {
    throw new Error(
      "Error durante la autenticación con Google, por favor intenta de nuevo."
    );
  }
  if (data.url) {
    redirect(data.url);
  }
};
export const signInWithGitHub = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${serverEnv.DOMAIN_URL}/auth/callback`,
    },
  });
  if (error) {
    throw new Error(
      "Error durante la autenticación con GitHub, por favor intenta de nuevo."
    );
  }
  if (data.url) {
    console.log("Redirecting to:", data.url);
    redirect(data.url);
  }
};
export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(
      "Error durante la desconexión, por favor intenta de nuevo."
    );
  }
  redirect("/");
};
