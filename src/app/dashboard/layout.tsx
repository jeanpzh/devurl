import React from "react";
import DashboardHeader from "./components/dashboard-header";
import DashboardNavigation from "./components/dashboard-navigation";
import DashboardFooter from "./components/dashboard-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard min-h-screen bg-terminal-canvas text-terminal-text">
      <DashboardHeader />
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-[1500px] flex-col md:flex-row">
        <DashboardNavigation />
        <main className="main min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-8 lg:px-7 lg:py-9">
          {children}
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}
