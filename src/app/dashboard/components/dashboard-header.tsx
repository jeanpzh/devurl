import Logo from "@/components/logo";
import UserProfile from "./user-profile";
import SignOutButton from "./sign-out-button";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-toggle";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex min-h-14 items-center justify-between border-b border-terminal-border-strong bg-terminal-canvas/95 px-4 backdrop-blur sm:px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-semibold tracking-wide text-terminal-text sm:text-base"
      >
        <Logo />
        <span className="hidden text-terminal-muted sm:inline">
          ://registry
        </span>
      </Link>
      <div className="flex items-center gap-3 sm:gap-6">
        <ModeToggle />
        <UserProfile />
        <SignOutButton />
      </div>
    </header>
  );
}
