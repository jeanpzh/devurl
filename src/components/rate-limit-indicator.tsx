"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface RateLimitIndicatorProps {
  error: Error | null;
}

export function RateLimitIndicator({ error }: RateLimitIndicatorProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!error || !error.message.includes("Intenta en")) return;

    const match = error.message.match(/Intenta en (\d+) segundos/);
    if (!match) return;

    const seconds = parseInt(match[1], 10);
    setCountdown(seconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [error]);

  if (!error || !error.message.includes("solicitudes")) return null;

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 text-sm">
        <p className="font-medium">Rate Limit Excedido</p>
        <p className="text-xs opacity-80">
          {countdown !== null
            ? `Podrás intentar de nuevo en ${countdown} segundos`
            : "Por favor, espera un momento antes de intentar nuevamente"}
        </p>
      </div>
    </div>
  );
}
