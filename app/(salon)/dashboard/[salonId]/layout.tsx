// import React from "react";

// type DashboardLayoutProps = {
//   children: React.ReactNode;
//   params: Promise<{ salonId: string }>;
// };

// export default async function DashboardLayout(props: DashboardLayoutProps) {
//   const params = await props.params;

//   const { children } = props;

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="w-full max-w-5xl mx-auto p-8">
//         <h1 className="text-4xl font-bold mb-8">Dashboard: {params.salonId}</h1>
//         <div className="flex-1">{children}</div>
//       </div>
//     </div>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SideBar from "@/components/common/SideBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "予約管理アプリ",
  description: "予約管理アプリ",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ salonId: string }>;
}>) {
  const { salonId } = await params;

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SideBar salonId={salonId}>{children}</SideBar>
        </ThemeProvider>
      </body>
    </html>
  );
}
