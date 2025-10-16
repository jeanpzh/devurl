"use client";
import React from "react";
import { URLItemComponent } from "./url-item";
import { useUrls } from "../../hooks/use-urls";
import URLNotFound from "./url-not-found";
import URLError from "./url-error";
import URLLoading from "./url-loading";
import { usePaginationStore } from "../../store/use-pagination-store";

export default function URLList() {
  const debouncedTerm = usePaginationStore((state) => state.searchTerm);
  const currentPage = usePaginationStore((state) => state.page);
  const limit = usePaginationStore((state) => state.limit);

  const {
    data: urls,
    isLoading,
    error,
  } = useUrls({ searchTerm: debouncedTerm, page: currentPage, limit });

  if (isLoading) {
    return <URLLoading />;
  }

  if (error) {
    return <URLError error={error as Error} />;
  }

  if (!urls?.data || urls.data.length === 0) {
    return <URLNotFound />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4 w-full">
      {urls.data.map((url: ShortLink) => (
        <URLItemComponent key={url.id} url={url} />
      ))}
    </div>
  );
}
