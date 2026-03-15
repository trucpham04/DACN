"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navGroups } from "@/config/navigation";
import { usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/types/navigation";
import { filterNavGroups } from "@/types/navigation";

export function AppSidebar() {
  const pathname = usePathname() || "";

  // Pass a role here when auth context is available, e.g. filterNavGroups(navGroups, role)
  // Currently null means all items are shown (no role-gating).
  const visibleGroups = filterNavGroups(navGroups, null);

  const renderItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={item.href}>
            <Icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-semibold uppercase">
              AP
            </div>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium">Academic Portal</span>
              <span className="text-muted-foreground text-xs">
                Quản lý đào tạo
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
