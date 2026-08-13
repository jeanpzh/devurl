import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}

export default function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={`flex min-h-64 flex-col items-center justify-center border border-terminal-border bg-terminal-surface/30 px-5 py-10 text-center ${className ?? ""}`}
    >
      <div className="mb-5 flex size-12 items-center justify-center border border-terminal-border bg-terminal-input text-terminal-accent">
        <Icon className="size-6" strokeWidth={1.25} />
      </div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-terminal-text">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-xs leading-6 text-terminal-muted">
        {description}
      </p>
      {action && (
        <Button
          asChild={Boolean(action.href)}
          onClick={action.onClick}
          variant="outline"
          className="mt-5 h-9 rounded-none border-terminal-accent text-[10px] uppercase tracking-[0.08em] text-terminal-accent hover:bg-terminal-accent hover:text-terminal-on-accent"
        >
          {action.href ? (
            <Link href={action.href}>{`[ ${action.label} ]`}</Link>
          ) : (
            `[ ${action.label} ]`
          )}
        </Button>
      )}
    </div>
  );
}
