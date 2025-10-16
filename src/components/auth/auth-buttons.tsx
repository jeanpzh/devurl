"use client";

import { useEffect, useState } from "react"; 
import { SignInModal } from "./sign-in";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogInIcon } from "lucide-react";
import SignOutButton from "@/app/dashboard/components/sign-out-button";
import Link from "next/link";

export function AuthButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkSize();
    window.addEventListener("resize", checkSize);
    
    return () => window.removeEventListener("resize", checkSize);
  }, []); 


  if (!isLoggedIn) {
    return (
      <>
        <Button
          onClick={() => setShowSignIn(true)}
          variant="outline"
          className="rounded-full bg-(--background-m) hover:bg-(--background-s) transition shadow-(--shadow-m) hover:shadow-(--shadow-s) cursor-pointer"
        >
          <LogInIcon className="size-4 mr-2" />
          Iniciar sesión
        </Button>
        <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={"/dashboard"}>
        <Button
          variant="outline"
          className="rounded-full bg-(--background-m) hover:bg-(--background-s) transition shadow-(--shadow-m) hover:shadow-(--shadow-s) cursor-pointer"
        >
          <LayoutDashboard className="size-4" />
          {!isMobile && <span className="ml-2">Dashboard</span>}
        </Button>
      </Link>
      <SignOutButton />
    </div>
  );
}