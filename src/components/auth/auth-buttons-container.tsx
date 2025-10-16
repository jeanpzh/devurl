"use server";
import { createClient } from "@/lib/supabase/server";
import React from "react";

import { AuthButtons } from "./auth-buttons";

export default async function AuthButtonsContainer() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return <AuthButtons isLoggedIn={!!data.user} />;
}
