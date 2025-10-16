"use server";
import React from "react";
import { GithubIcon } from "@/components/icons";
import Link from "next/link";
import Logo from "../logo";
import AuthButtonsContainer from "../auth/auth-buttons-container";

export default async function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border">
      <Logo />
      <nav className="flex items-center gap-3 md:gap-4 px-4">
        <Link href="https://github.com/jeanpzh">
          <GithubIcon className="size-6" />
        </Link>
        <AuthButtonsContainer />
      </nav>
    </header>
  );
}
