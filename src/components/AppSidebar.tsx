import { useLocation } from "react-router-dom";

import { Ticket, Home, User, Inbox, Plus } from "lucide-react";

import logo from "../assets/img/logo-shipnow-dark.png";

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
    title: "Página Inicial",
    url: "/",
    icon: Home,
  },
  {
    title: "Chamados",
    url: "/tickets",
    icon: Ticket,
  },
];

const tech = [
  {
    title: "Meus Atendimentos",
    url: "/tech/my-tickets",
    icon: Inbox,
  },
];

const admin = [
  {
    title: "Usuários",
    url: "/admin/users",
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  if (user) {
    return (
      <Sidebar variant="sidebar" className="static">
        <SidebarHeader className=" w-full">
          <div className="flex flex-col items-center gap-3">
            <a href="/">
              <img src={logo} alt="" width={160} className="p-2" />
            </a>
          </div>
        </SidebarHeader>
        <SidebarContent>
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
          {user.role !== "user" && (
            <SidebarGroup>
              <SidebarGroupLabel>Técnico</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tech.map((item) => {
                    if (location.pathname == item.url) {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive>
                            <a href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
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
                        </SidebarMenuItem>
                      );
                    }
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {user.role === "admin" && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {admin.map((item) => {
                    if (location.pathname == item.url) {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive>
                            <a href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
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
                        </SidebarMenuItem>
                      );
                    }
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    );
  }
}
