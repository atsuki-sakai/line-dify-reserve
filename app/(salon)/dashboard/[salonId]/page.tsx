"use client";

import React, { use } from "react";
import { ThemeToggleBtn } from "@/components/common/ThemeToggleBtn";
export default function DashboardPage(
  props: {
    params: Promise<{ salonId: string }>;
  }
) {
  const params = use(props.params);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 bg-background">Dashboard</h1>
      <p>Salon ID: {params.salonId}</p>
      <ThemeToggleBtn />
    </div>
  );
}
