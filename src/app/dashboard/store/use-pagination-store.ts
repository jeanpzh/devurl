import { create } from "zustand";

interface PaginationState {
  totalItems: number;
  setTotalItems: (total: number) => void;
  page: number;
  limit: number;
  searchTerm: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
}

const INITIAL_PAGE = 1;
const INITIAL_LIMIT = 10;

export const usePaginationStore = create<PaginationState>((set) => ({
  totalItems: 0,
  isLoading: false,
  page: INITIAL_PAGE,
  limit: INITIAL_LIMIT,
  setTotalItems: (total) => set({ totalItems: total }),
  searchTerm: "",
  setIsLoading: (isLoading) => set({ isLoading }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: INITIAL_PAGE }),
  setSearchTerm: (searchTerm) => set({ searchTerm, page: INITIAL_PAGE }),
  reset: () =>
    set({ page: INITIAL_PAGE, limit: INITIAL_LIMIT, searchTerm: "" }),
}));
