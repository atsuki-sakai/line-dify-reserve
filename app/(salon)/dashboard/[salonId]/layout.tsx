import React from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { salonId: string };
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard: {params.salonId}</h1>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
