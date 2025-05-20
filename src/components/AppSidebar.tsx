import { useLocation } from "react-router-dom";

import { Ticket, Home, User, Inbox, Plus, Box, LayoutDashboard } from "lucide-react";

import logo from "../assets/img/logo-shipnow.png";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { useAuth } from "@/data/contexts/AuthContext";

// Menu items.
const principal = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Inventário",
    url: "/inventory",
    icon: Box,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  if (user) {
    return (
      <Sidebar variant="sidebar" className="static text-white">
        <SidebarHeader className="w-full py-4">
          <div className="flex flex-col items-center gap-3">
            <a href="/">
              <img src={logo} alt="" width={160} className="p-2" />
            </a>
          </div>
        </SidebarHeader>
        <SidebarContent className="w-full ">
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {principal.map((item) => {
                  if (location.pathname == item.url) {
                    return (
                      <SidebarMenuItem
                        key={item.title}
                        className="flex items-center"
                      >
                        <SidebarMenuButton asChild isActive>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {item.title === "Chamados" && (
                          <SidebarMenuAction className="flex items-center bottom-1">
                            <TooltipProvider>
                              <Tooltip>
                                <a href="/create-ticket">
                                  <TooltipTrigger className="text-gray-500 cursor-pointer p-0">
                                    <Plus className="w-5" />
                                  </TooltipTrigger>
                                </a>
                                <TooltipContent>
                                  <p>Abrir novo chamado</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </SidebarMenuAction>
                        )}
                      </SidebarMenuItem>
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {item.title === "Chamados" && (
                          <SidebarMenuAction className="flex items-center bottom-1">
                            <TooltipProvider>
                              <Tooltip>
                                <a href="/create-ticket">
                                  <TooltipTrigger className="text-gray-500 cursor-pointer p-0">
                                    <Plus className="w-5" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Abrir novo chamado</p>
                                  </TooltipContent>
                                </a>
                              </Tooltip>
                            </TooltipProvider>
                          </SidebarMenuAction>
                        )}
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="w-full">
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    );
  }
}
