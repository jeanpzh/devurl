import { AlertCircle } from "lucide-react";
import React from "react";

export default function URLError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-8 w-full col-span-full">
      <AlertCircle className="size-12 text-red-500" />
      <p className="text-sm text-red-500 font-medium">Error: {error.message}</p>
    </div>
  );
}
