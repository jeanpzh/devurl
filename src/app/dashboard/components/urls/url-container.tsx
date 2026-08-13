"use client";
import React, { useEffect, useRef } from "react";
import SearchLinks from "./search-links";
import URLList from "./url-list";
import URLPagination from "./url-pagination";
import { usePaginationStore } from "../../store/use-pagination-store";
import { useSearchParams, useRouter } from "next/navigation";

export default function URLContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = usePaginationStore((state) => state.page);
  const limit = usePaginationStore((state) => state.limit);
  const searchTerm = usePaginationStore((state) => state.searchTerm);
  const setPage = usePaginationStore((state) => state.setPage);
  const setLimit = usePaginationStore((state) => state.setLimit);
  const setSearchTerm = usePaginationStore((state) => state.setSearchTerm);
  const reset = usePaginationStore((state) => state.reset);
  const isInitialMount = useRef(true);
  const status = searchParams.get("status") ?? "all";

  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlLimit = searchParams.get("limit");
    const urlSearchTerm = searchParams.get("q");

    if (
      !urlPage &&
      !urlLimit &&
      !urlSearchTerm &&
      !searchParams.get("status")
    ) {
      if (isInitialMount.current) {
        reset();
        router.replace("/dashboard?page=1&limit=10&status=all", {
          scroll: false,
        });
        isInitialMount.current = false;
      }
      return;
    }

    isInitialMount.current = false;

    const pageNum = urlPage ? parseInt(urlPage, 10) : 1;
    const limitNum = urlLimit ? parseInt(urlLimit, 10) : 10;
    const searchTermStr = urlSearchTerm || "";

    if (limitNum !== limit && limitNum >= 1 && !isNaN(limitNum)) {
      setLimit(limitNum);
    }

    if (searchTermStr !== searchTerm) {
      setSearchTerm(searchTermStr);
    }

    if (pageNum !== page && pageNum >= 1 && !isNaN(pageNum)) {
      setPage(pageNum);
    }
  }, [searchParams]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3 border-b border-terminal-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchLinks />
        <div className="flex gap-5 px-1 text-[10px] uppercase tracking-[0.08em] text-terminal-muted">
          {[
            { key: "all", label: "Todos" },
            { key: "active", label: "Activos" },
            { key: "no_clicks", label: "Sin clics" },
          ].map((filter) => {
            const active = status === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("status", filter.key);
                  params.set("page", "1");
                  router.push(`/dashboard?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                className={
                  active
                    ? "border-b-2 border-terminal-accent pb-2 text-terminal-accent"
                    : "pb-2 transition-colors hover:text-terminal-text"
                }
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <URLList />
      <URLPagination />
    </div>
  );
}
