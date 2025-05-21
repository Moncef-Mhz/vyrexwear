"use client";
import {
  LayoutGrid,
  Package,
  SettingsIcon,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Header } from "./sidebar/header";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "./sidebar/user";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutGrid,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: ShoppingCart,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Orders",
    url: "#",
    icon: Package,
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  const { data: user, error } = authClient.useSession();

  if (error) {
    console.error("Error fetching user session:", error);
    return null;
  }

  console.log("User session:", user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            firstName: user?.user.firstName ?? "",
            lastName: user?.user.firstName ?? "",
            email: user?.user.email ?? "",
            avatar: user?.user.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
