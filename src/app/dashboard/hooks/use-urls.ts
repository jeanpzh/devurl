import { useQuery } from "@tanstack/react-query";
import { usePaginationStore } from "../store/use-pagination-store";
import { useEffect } from "react";

interface FetchURLsParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

const fetchURLs = async (params: FetchURLsParams, signal?: AbortSignal) => {
  const { searchTerm, page, limit } = params;
  const url = `/api/url?q=${encodeURIComponent(
    searchTerm || ""
  )}&page=${encodeURIComponent(page ?? 1)}&limit=${encodeURIComponent(
    limit ?? 10
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener las URLs");
  }

  const result = await response.json();

  return result;
};

export const useUrls = ({ searchTerm, page, limit }: FetchURLsParams) => {
  const setTotalItems = usePaginationStore((state) => state.setTotalItems);
  const setIsLoading = usePaginationStore((state) => state.setIsLoading);

  const query = useQuery({
    queryKey: ["urls", searchTerm || "", page || 1, limit || 10],
    queryFn: ({ signal }) => fetchURLs({ searchTerm, page, limit }, signal),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data?.metadata?.total !== undefined) {
      setTotalItems(query.data.metadata.total);
    }
  }, [query.data?.metadata?.total, setTotalItems]);

  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading, setIsLoading]);

  return query;
};
