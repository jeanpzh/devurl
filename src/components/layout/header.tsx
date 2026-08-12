"use server";
import { GithubIcon } from "@/components/icons";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import AuthButtonsContainer from "../auth/auth-buttons-container";

export default async function Header() {
  return (
    <header className="relative z-10 grid min-h-[58px] grid-cols-[minmax(0,1fr)_auto] border-b border-terminal-border-strong bg-terminal-canvas/85">
      <Link
        className="flex min-h-[58px] min-w-0 items-center truncate border-l-0 px-5 text-base text-terminal-accent max-md:px-3"
        href="/"
      >
        deVRL://shortener
      </Link>
      <nav
        className="flex min-h-[58px] shrink-0 items-center gap-1 border-l border-terminal-border-strong px-1 text-[11px] uppercase tracking-[0.1em] text-terminal-accent sm:gap-3 sm:px-5"
        aria-label="Primary navigation"
      >
        <Link
          className="flex min-h-9 items-center gap-2 rounded-none px-2 text-terminal-accent transition-colors hover:bg-terminal-hover hover:text-terminal-text"
          href="https://github.com/jeanpzh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open deVRL on GitHub"
        >
          <GithubIcon className="size-4" />
          <span className="text-[10px] sm:text-[11px]">[ GITHUB ]</span>
        </Link>
        <ModeToggle />
        <AuthButtonsContainer />
      </nav>
    </header>
  );
}
