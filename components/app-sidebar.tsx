"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Package,
  Truck,
  PackageCheck,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/shipments", label: "Shipments", icon: PackageCheck },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">BloomOps</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    }
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    tooltip={item.label}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
