"use client";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "../../hooks/use-debounce";

export default function SearchLinks() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { push } = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const urlSearchTerm = searchParams.get("q");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    setIsInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams(window.location.search);

    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
      params.set("page", "1");
    } else {
      params.delete("q");
    }

    if (!params.has("page")) {
      params.set("page", "1");
    }
    if (!params.has("limit")) {
      params.set("limit", "10");
    }
    if (!params.has("status")) {
      params.set("status", "all");
    }

    push(`/dashboard?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, push, isInitialized]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-muted" />
      <Input
        type="text"
        placeholder="Buscar por alias o destino..."
        aria-label="Buscar links"
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
        className="h-11 rounded-none border-terminal-border bg-terminal-input pl-10 pr-10 text-xs text-terminal-text placeholder:text-terminal-muted"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm?.("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-muted transition-colors hover:text-terminal-text"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
