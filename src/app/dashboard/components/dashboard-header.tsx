import Logo from "@/components/logo";
import UserProfile from "./user-profile";
import SignOutButton from "./sign-out-button";

export default function DashboardHeader() {
  return (
    <header className="header flex items-center justify-between w-full px-4 bg-background p-4 border-b border-border backdrop:blur-sm fixed top-0 left-0 right-0 z-50 h-20 max-w-5xl mx-auto">
      <Logo />
      <div className="flex items-center gap-8">
        <UserProfile />
        <SignOutButton />
      </div>
    </header>
  );
}
