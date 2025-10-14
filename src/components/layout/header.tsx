import React from "react";
import { GithubIcon } from "@/components/icons";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "../ui/button";

interface Link {
  icon?: "github" | "theme";
  href: string;
  name?: string;
  ariaLabel?: string;
}

const links: Link[] = [
  { icon: "github", href: "https://github.com/jeanpzh", ariaLabel: "GitHub" },
  { href: "#", name: "Iniciar sesión" },
  { href: "#", name: "Registrarse" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b">
      <div className="text-2xl md:text-3xl font-bold font-mono">deVRL</div>
      <nav className="flex items-center gap-3 md:gap-4 px-4">
        {links.map((link, index) => {
          const isExternal = link.href.startsWith("http");

          return (
            <a
              key={link.href + index}
              href={link.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={link.ariaLabel}
              className="flex items-center gap-1.5 text-sm md:text-base hover:text-primary"
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-sm md:text-base hover:text-primary text-foreground cursor-pointer hover:scale-100 active:scale-95 duration-300 ease-in-out"
              >
                {link.icon === "github" && <GithubIcon className="size-7" />}
                {link.name}
              </Button>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
