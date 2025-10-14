"use server";
import React from "react";
import { Footer, Header, Main } from "@/components/layout";

export default async function Home() {
  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-4 flex flex-col">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
