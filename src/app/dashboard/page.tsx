"use client";
import AddShortUrlButton from "./components/add-short-url-button";
import React from "react";
import URLContainer from "./components/urls/url-container";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 border-b border-terminal-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-terminal-accent">
            01 // registry
          </p>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-terminal-text sm:text-3xl">
            Registro de links
          </h1>
          <p className="mt-2 text-xs text-terminal-muted">
            Administra, comparte y mide tus enlaces cortos.
          </p>
        </div>
        <AddShortUrlButton>[ Nuevo link ]</AddShortUrlButton>
      </div>
      <section className="flex flex-col gap-4">
        <URLContainer />
      </section>
    </div>
  );
}
