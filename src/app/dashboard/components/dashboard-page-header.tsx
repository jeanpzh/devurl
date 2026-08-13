interface DashboardPageHeaderProps {
  index: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function DashboardPageHeader({
  index,
  title,
  description,
  children,
}: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-terminal-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-terminal-accent">
          {index} {"//"} console
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-[0.04em] text-terminal-text sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-terminal-muted">{description}</p>
      </div>
      {children}
    </header>
  );
}
