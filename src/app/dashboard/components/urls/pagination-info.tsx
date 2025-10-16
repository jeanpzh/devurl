"use client";

import React from "react";

export default function PaginationInfo({
  currentPage,
  totalItems,
  limit,
}: {
  currentPage: number;
  totalItems: number;
  limit: number;
}) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  return (
    <div className="text-sm text-muted-foreground text-center">
      Mostrando {start} - {end} de {totalItems} enlaces
    </div>
  );
}
