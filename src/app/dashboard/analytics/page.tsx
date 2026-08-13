"use client";

import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardEmptyState from "../components/dashboard-empty-state";
import DashboardPageHeader from "../components/dashboard-page-header";
import { useAnalytics } from "../hooks/use-analytics";
import type { AnalyticsPeriod } from "@/backend/domain/analytics";
import { useRouter, useSearchParams } from "next/navigation";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const period = (searchParams.get("period") ?? "30d") as AnalyticsPeriod;
  const { data, isLoading, error, refetch } = useAnalytics(period);
  const totalClicks = data?.summary.clicks ?? 0;
  const topLinks = data?.topLinks ?? [];
  const totalLinks = data?.summary.totalLinks ?? 0;
  const activeLinks = data?.summary.activeLinks ?? 0;
  const coverageStartedAt = data?.period.coverageStartedAt ?? null;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        index="02"
        title="Analítica de tráfico"
        description="Resumen del rendimiento de tus enlaces."
      />
      <div className="flex w-full max-w-full overflow-x-auto border border-terminal-border bg-terminal-surface text-[10px] uppercase tracking-[0.08em] text-terminal-text sm:w-fit">
        {[
          ["7d", "7D"],
          ["30d", "30D"],
          ["90d", "90D"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={period === value}
            onClick={() => router.push(`/dashboard/analytics?period=${value}`)}
            className={`shrink-0 border-r border-terminal-border px-4 py-3 last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent sm:px-5 ${period === value ? "bg-terminal-accent text-terminal-on-accent" : "hover:bg-terminal-hover hover:text-terminal-text"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse border border-terminal-border bg-terminal-surface"
            />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-4 border border-terminal-error/50 bg-terminal-error/5 p-10 text-center text-xs text-terminal-error"
        >
          <p>{error.message}</p>
          <Button
            variant="outline"
            onClick={() => void refetch()}
            className="rounded-none border-terminal-error text-terminal-error"
          >
            <RefreshCw className="size-3" /> Reintentar
          </Button>
        </div>
      ) : totalClicks === 0 ? (
        <DashboardEmptyState
          icon={BarChart3}
          title="Sin actividad todavía"
          description="Las métricas aparecerán cuando alguien visite uno de tus enlaces."
          action={
            totalLinks === 0
              ? { label: "Crear un link", href: "/dashboard" }
              : { label: "Ir a mis links", href: "/dashboard" }
          }
        />
      ) : (
        <>
          <section className="grid gap-px border border-terminal-border bg-terminal-border sm:grid-cols-3">
            <Metric
              label="Clics totales"
              value={totalClicks.toLocaleString("es-AR")}
            />
            <Metric label="Links activos" value={activeLinks.toString()} />
            <Metric
              label="Datos temporales"
              value={coverageStartedAt ? "ACTIVO" : "—"}
              detail={
                coverageStartedAt
                  ? "Eventos disponibles"
                  : "Ingestión pendiente"
              }
            />
          </section>
          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="border border-terminal-border bg-terminal-surface/30 p-4 sm:p-5">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.08em]">
                Clics // links actuales
              </h2>
              <div className="flex h-56 min-w-0 items-end gap-1 border-b border-l border-terminal-border px-2 pb-0 pt-5 sm:gap-2 sm:px-4">
                {topLinks.length === 0 ? (
                  <p className="m-auto text-xs text-terminal-muted">
                    Aún sin actividad.
                  </p>
                ) : (
                  topLinks.map((link) => {
                    const height = totalClicks
                      ? Math.max(8, (link.clicks / totalClicks) * 100)
                      : 8;
                    return (
                      <div
                        key={link.linkId}
                        className="group flex h-full flex-1 flex-col justify-end gap-2 text-center text-[9px] text-terminal-muted"
                      >
                        <span>{link.clicks}</span>
                        <div
                          className="bg-terminal-accent transition-colors group-hover:bg-terminal-accent-strong"
                          style={{ height: `${height}%` }}
                        />
                        <span className="truncate">{link.slug}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <p className="mt-4 text-[10px] text-terminal-subtle">
                Cobertura:{" "}
                {coverageStartedAt
                  ? new Date(coverageStartedAt).toLocaleDateString("es-AR")
                  : "pendiente de activar ingestión"}
                .
              </p>
            </div>
            <div className="border border-terminal-border bg-terminal-surface/30 p-4 sm:p-5">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.08em]">
                Top links
              </h2>
              <div className="divide-y divide-terminal-border">
                {topLinks.map((link, index) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between py-3 text-xs"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="text-terminal-accent">{index + 1}</span>
                      <span className="truncate">{link.slug}</span>
                    </span>
                    <span className="text-terminal-accent-strong">
                      {link.clicks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="bg-terminal-surface/50 p-5">
      <p className="text-[10px] uppercase tracking-[0.08em] text-terminal-muted">
        {label}
      </p>
      <p className="mt-3 text-3xl text-terminal-accent-strong">{value}</p>
      {detail && (
        <p className="mt-1 text-[10px] uppercase text-terminal-subtle">
          {detail}
        </p>
      )}
    </div>
  );
}
