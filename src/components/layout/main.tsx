import React from "react";
import CreateOfflineLink from "../links/create-offline-link";

export default function Main() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-16 mt-10">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            Acorta tus enlaces con{" "}
            <span className="font-mono bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              deVRL
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            La forma más sencilla y rápida de acortar tus URLs.
          </p>
        </div>

        <CreateOfflineLink />
      </div>
    </main>
  );
}
