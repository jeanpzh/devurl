import React from "react";

export default function URLLoading() {
  return (
    <div className="grid w-full gap-0 border border-terminal-border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.1fr_1.4fr_0.5fr_0.5fr] gap-4 border-b border-terminal-border px-4 py-5 last:border-b-0"
        >
          <div className="h-4 animate-pulse bg-terminal-hover" />
          <div className="h-4 animate-pulse bg-terminal-hover" />
          <div className="h-4 animate-pulse bg-terminal-hover" />
          <div className="h-4 animate-pulse bg-terminal-hover" />
        </div>
      ))}
    </div>
  );
}
