"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Authenticated } from "convex/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen antialiased">
        <Authenticated>
          <Sidebar />
        </Authenticated>

        <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
