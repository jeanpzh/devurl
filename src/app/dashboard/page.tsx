"use client";
import AddShortUrlButton from "./components/add-short-url-button";
import React from "react";
import URLContainer from "./components/urls/url-container";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-mono text-foreground">Links</h1>
        <AddShortUrlButton>Create un link!</AddShortUrlButton>
      </div>
      <section className="flex flex-col gap-4">
        <URLContainer />
      </section>
    </div>
  );
}
