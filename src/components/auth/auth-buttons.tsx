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
          className="h-auto min-h-9 rounded-none border-0 bg-transparent! px-2 text-terminal-accent shadow-none hover:bg-terminal-hover! hover:text-terminal-text max-sm:px-1 max-sm:text-[10px]"
        >
          <LogInIcon className="size-4" />
          <span>[ LOGIN ]</span>
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
          className="h-auto rounded-none border-0 bg-transparent! p-0 text-terminal-accent shadow-none hover:bg-terminal-hover! hover:text-terminal-text"
        >
          <LayoutDashboard className="size-4" />
          {!isMobile && <span className="ml-2">[ DASHBOARD ]</span>}
        </Button>
      </Link>
      <SignOutButton />
    </div>
  );
}
