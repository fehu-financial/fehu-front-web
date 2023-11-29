import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children }, ref) => (
  <aside className={cn("pb-12 border-r", className)} ref={ref}>
    <div className="space-y-4 py-4">{children}</div>
  </aside>
));

Sidebar.displayName = "Sidebar";

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ title, children }, ref) => (
  <div className="px-3 py-2">
    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
    <div className="space-y-1" ref={ref}>
      {children}
    </div>
  </div>
));

SidebarSection.displayName = "SidebarSection";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => (
  <div className="space-y-1" ref={ref}>
    {children}
  </div>
));

SidebarMenu.displayName = "SidebarMenu";

export interface SidebarMenuItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  icon?: LucideIcon;
}

const SidebarMenuItem = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuItemProps
>(({ title, icon: Icon, variant, ...props }, ref) => (
  <Button
    variant={variant || "ghost"}
    className="w-full justify-start"
    ref={ref}
    {...props}
  >
    {Icon && <Icon className="mr-2 h-4 w-4" />}
    {title}
  </Button>
));

SidebarMenuItem.displayName = "SidebarMenuItem";

export { Sidebar, SidebarSection, SidebarMenu, SidebarMenuItem };
