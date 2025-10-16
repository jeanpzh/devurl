"use client";
import {
  Pagination,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import { usePaginationStore } from "../../store/use-pagination-store";
import { useRouter } from "next/navigation";
import PaginationInfo from "./pagination-info";

export default function URLPagination() {
  const router = useRouter();

  const totalItems = usePaginationStore((state) => state.totalItems);
  const limit = usePaginationStore((state) => state.limit);
  const isLoading = usePaginationStore((state) => state.isLoading);
  const MAX_PAGES = Math.ceil(totalItems / limit) || 1;

  const currentPage = usePaginationStore((state) => state.page);

  const handlePageChange = (newPage: number) => {
    const pageToSet = Math.max(1, Math.min(newPage, MAX_PAGES));

    const params = new URLSearchParams(window.location.search);
    params.set("page", pageToSet.toString());
    params.set("limit", limit.toString());

    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {!isLoading && totalItems > 0 && MAX_PAGES > 1 && (
        <Pagination>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            isActive={currentPage > 1}
            className="cursor-pointer"
          />

          {Array.from({ length: MAX_PAGES }).map((_, index) => (
            <PaginationLink
              key={index}
              onClick={() => handlePageChange(index + 1)}
              isActive={currentPage === index + 1}
              className="cursor-pointer"
            >
              {index + 1}
            </PaginationLink>
          ))}

          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            isActive={currentPage < MAX_PAGES}
            className="cursor-pointer"
          />
        </Pagination>
      )}
      {!isLoading && (
        <PaginationInfo
          currentPage={currentPage}
          totalItems={totalItems}
          limit={limit}
        />
      )}
    </>
  );
}
