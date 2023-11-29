"use client";

import { CandlestickChart, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sidebar, SidebarSection, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function SideNav() {
  const router = useRouter();

  return (
    <Sidebar className="w-52 h-full">
      <div className="flex items-center px-7 mb-2">
        <Image src="/fehu-logo.svg" alt="" width={16} height={26} />
        <span>Financial</span>
      </div>
      <SidebarSection title="Investimentos">
        <SidebarMenu>
          <SidebarMenuItem
            title="Renda Variável"
            icon={CandlestickChart}
            onClick={() => router.push("/investments/variable-income")}
          />
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem
            title="Renda Fixa"
            icon={Landmark}
            onClick={() => router.push("/investments/fixed-income")}
          />
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
  );
}
