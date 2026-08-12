"use server";
import { Footer, Header, Main } from "@/components/layout";

export default async function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-terminal-canvas bg-[var(--terminal-page-glow)] text-terminal-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.025] [background:var(--terminal-scanlines)]"
      />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
