import React from "react";
import DashboardHeader from "./components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard max-w-5xl mx-auto min-h-screen p-4">
      <DashboardHeader />
      <main className="main flex-1 mt-20">{children}</main>
    </div>
  );
}
