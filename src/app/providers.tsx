"use client";
import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          mobileOffset={60}
          richColors
          duration={3000}
          position="top-right"
          closeButton
          theme="dark"
          className="z-50"
        />

        {children}
      </QueryClientProvider>
    </>
  );
}
