"use client";
import React from "react";
import { URLItemComponent } from "./url-item";
import { useUrls } from "../../hooks/use-urls";
import URLNotFound from "./url-not-found";
import URLError from "./url-error";
import URLLoading from "./url-loading";
import { usePaginationStore } from "../../store/use-pagination-store";
import { useSearchParams } from "next/navigation";

export default function URLList() {
  const debouncedTerm = usePaginationStore((state) => state.searchTerm);
  const currentPage = usePaginationStore((state) => state.page);
  const limit = usePaginationStore((state) => state.limit);
  const status = (useSearchParams().get("status") ?? "all") as
    "all" | "active" | "no_clicks";

  const {
    data: urls,
    isLoading,
    error,
    refetch,
  } = useUrls({ searchTerm: debouncedTerm, page: currentPage, limit, status });

  if (isLoading) {
    return <URLLoading />;
  }

  if (error) {
    return <URLError error={error as Error} onRetry={() => void refetch()} />;
  }

  if (!urls?.data || urls.data.length === 0) {
    return <URLNotFound debouncedTerm={debouncedTerm} />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
      {urls.data.map((url: ShortLink) => (
        <URLItemComponent key={url.id} url={url} />
      ))}
    </div>
  );
}
