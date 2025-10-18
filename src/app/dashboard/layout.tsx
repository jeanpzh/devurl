import React from "react";
import DashboardHeader from "./components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard w-full mx-auto min-h-screen p-4 max-w-5xl ">
      <DashboardHeader />
      <main className="main flex-1 mt-25">{children}</main>
    </div>
  );
}
