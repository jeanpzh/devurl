import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function UserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src={user?.user_metadata?.avatar_url}
        alt="User Avatar"
        className="size-8 shrink-0 rounded-full"
      />
      <span className="hidden max-w-32 truncate font-mono text-xs sm:block">
        {user?.user_metadata?.name}
      </span>
    </div>
  );
}
