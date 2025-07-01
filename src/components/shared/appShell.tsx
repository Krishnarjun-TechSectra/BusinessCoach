"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Rocket, LayoutDashboard, Users, LogOut,ChartBarIncreasingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  role: "admin" | "client";
  children: ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();

  const clientLinks = [
    { href: "/client-dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const adminLinks = [
    { href: "/admin-dashboard/dashboard", label: "Admin Panel", icon: Users },
    { href: "/admin-dashboard/leaderboard", label: "Leader Board", icon:  ChartBarIncreasingIcon},
  ];

  const links = role === "admin" ? adminLinks : clientLinks;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          {/* <div className="flex items-center gap-2 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Rocket className="h-5 w-5" />
                </div>
                <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Business Coach</span>
            </div> */}
           <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={80}
            className="w-full p-4"
          />
          <br />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(link.href)}
                  tooltip={link.label}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Logout">
                        <Link href="/auth">
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter> */}
      </Sidebar>
      <SidebarInset className="p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between md:hidden">
          {/* <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg">Progression</span>
          </div> */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={80}
            className="ml-2 sm:ml-4"
          />
          <br />
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
