import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="h-auto rounded-none border-0 bg-transparent! p-2 text-terminal-accent shadow-none transition-colors hover:bg-terminal-hover! hover:text-terminal-text cursor-pointer"
      onClick={signOut}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <LogOut className="size-4" />
    </Button>
  );
}
