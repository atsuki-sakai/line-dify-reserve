import React from "react";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { salonId: string };
}) {
  return (
    <div>
      {/* ここにダッシュボードの共通レイアウトを追加 */}
      <main>
        {children}: {params.salonId}
      </main>
    </div>
  );
}
