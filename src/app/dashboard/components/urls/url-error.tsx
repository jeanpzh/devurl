import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export default function URLError({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-3 border border-terminal-error/50 bg-terminal-error/5 p-8 text-center"
    >
      <AlertCircle className="size-8 text-terminal-error" />
      <p className="max-w-md text-xs text-terminal-error">
        No se pudo cargar el registro. {error.message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="h-9 rounded-none border-terminal-error text-[10px] uppercase text-terminal-error hover:bg-terminal-error hover:text-white"
        >
          <RefreshCw className="size-3" /> Reintentar
        </Button>
      )}
    </div>
  );
}
