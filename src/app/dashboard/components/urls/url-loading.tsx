import { Loader2 } from "lucide-react";
import React from "react";

export default function URLLoading() {
  return (
    <div className="flex items-center justify-center w-full h-full col-span-full min-h-[400px]">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
}
