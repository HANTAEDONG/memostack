"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/shadcn/sidebar";
import LucideIcon from "@/shared/ui/Icon/LucideIcon";
import { AuthButton } from "@/shared/ui/auth/AuthButton";
import DarkModeToggle from "@/shared/ui/DarkModeToggle";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:flex-shrink-0">
              <LucideIcon
                name="BookText"
                size={20}
                className="group-data-[collapsible=icon]:!w-5 group-data-[collapsible=icon]:!h-5"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">MemoStack</h1>
            </div>
          </div>
          <DarkModeToggle size="sm" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/write"}
                className="bg-foreground text-white dark:text-black rounded-lg hover:bg-foreground/60 hover:text-white dark:hover:text-black"
              >
                <Link href="/write">
                  <Plus />
                  <span>새 메모</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>검색</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarInput placeholder="메모 검색..." />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <FileText />
                    <span>모든 메모</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/trash"}>
                  <Link href="/trash">
                    <Trash2 />
                    <span>휴지통</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-8 pt-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-2">
                <AuthButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
