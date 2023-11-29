import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { SideNav } from "@/components/layout/sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fehu Finances",
  description: "Gerencie investimentos, despesas e tudo mais.",
};

type RootLayoutInput = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutInput) {
  return (
    <html lang="en" className="h-full dark">
      <body className={cn("flex h-full antialiased", inter.className)}>
        <SideNav />
        <main className="flex flex-col flex-1 h-full px-4 py-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
