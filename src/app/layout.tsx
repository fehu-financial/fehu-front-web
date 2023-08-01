import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSection,
} from "@/components/ui/sidebar";
import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { CandlestickChart, Landmark } from "lucide-react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fehu Finances",
  description: "Gerencie investimentos, despesas e tudo mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("flex h-full antialiased", inter.className)}>
        <Sidebar className="w-52 h-full">
          <div className="flex items-center px-7 mb-2">
            <Image src="/fehu-logo.svg" alt="" width={16} height={26} />
            <span>Financial</span>
          </div>
          <SidebarSection title="Investimentos">
            <SidebarMenu>
              <SidebarMenuItem title="Renda Variável" icon={CandlestickChart} />
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem title="Renda Fixa" icon={Landmark} />
            </SidebarMenu>
          </SidebarSection>
          <SidebarSection title="Despesas">
            <SidebarMenu>
              <SidebarMenuItem title="Teste 1" icon={CandlestickChart} />
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem title="Teste 2" icon={Landmark} />
            </SidebarMenu>
          </SidebarSection>
        </Sidebar>
        <main className="flex flex-col flex-1 h-full px-4 py-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
