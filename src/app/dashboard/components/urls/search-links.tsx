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

    push(`/dashboard?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, push, isInitialized]);

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Busca el link!"
        aria-label="Buscar links"
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
        className="pl-10 pr-10 h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm?.("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
