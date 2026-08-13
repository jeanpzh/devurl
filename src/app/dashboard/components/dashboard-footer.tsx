export default function DashboardFooter() {
  return (
    <footer className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-t border-terminal-border-strong px-4 py-3 text-[9px] uppercase tracking-[0.1em] text-terminal-muted sm:px-6">
      <span>deVRL Link Registry v1.0.0</span>
      <span className="hidden sm:inline">
        Sistema operativo: deVRL OS 1.0.0
      </span>
      <span>Node: srv-01&nbsp; // &nbsp;sa-east-1</span>
    </footer>
  );
}
