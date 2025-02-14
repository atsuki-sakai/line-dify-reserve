import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { salonId: string };
}) {
  return (
    <div>
      <main>
        {children}: {params.salonId}
      </main>
    </div>
  );
}
