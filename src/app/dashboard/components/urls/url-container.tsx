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

  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlLimit = searchParams.get("limit");
    const urlSearchTerm = searchParams.get("q");

    if (!urlPage && !urlLimit && !urlSearchTerm) {
      if (isInitialMount.current) {
        reset();
        router.replace("/dashboard?page=1&limit=10", { scroll: false });
        isInitialMount.current = false;
      }
      return;
    }

    isInitialMount.current = false;

    const pageNum = urlPage ? parseInt(urlPage, 10) : 1;
    const limitNum = urlLimit ? parseInt(urlLimit, 10) : 10;
    const searchTermStr = urlSearchTerm || "";

    if (pageNum !== page && pageNum >= 1 && !isNaN(pageNum)) {
      setPage(pageNum);
    }

    if (limitNum !== limit && limitNum >= 1 && !isNaN(limitNum)) {
      setLimit(limitNum);
    }

    if (searchTermStr !== searchTerm) {
      setSearchTerm(searchTermStr);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-10 w-full">
      <SearchLinks />
      <URLList />
      <URLPagination />
    </div>
  );
}
