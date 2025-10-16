import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="rounded-full bg-(--background-m) hover:bg-(--background-s) transition shadow-(--shadow-m) hover:shadow-(--shadow-s) cursor-pointer"
      onClick={signOut}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <LogOut className="size-4" />
    </Button>
  );
}
