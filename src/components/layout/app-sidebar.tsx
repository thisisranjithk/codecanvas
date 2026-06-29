import { useEffect } from "react"
import { Settings } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Layers } from "lucide-react"
import { mockUser } from "@/data/user"
import { navItems } from "@/config/navigation"

export function AppSidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { setOpenMobile } = useSidebar()

  useEffect(() => {
    setOpenMobile(false)
  }, [currentPath, setOpenMobile])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-2.5 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent/50" asChild>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0 shadow-sm shadow-primary/20">
                  <Layers className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-[15px] tracking-tight">Portfolio CMS</span>
                  <span className="text-xs text-sidebar-foreground/60">alexmorgan.dev</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2 px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15 [&>svg]:text-primary"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <Link to={item.path} className="relative flex items-center">
                        <item.icon className="size-[18px]" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="py-2 px-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/settings"}
              tooltip="Settings"
              className={
                currentPath === "/settings"
                  ? "bg-primary/10 text-primary hover:bg-primary/15 [&>svg]:text-primary"
                  : "hover:bg-sidebar-accent/50"
              }
            >
              <Link to="/settings" className="flex items-center">
                <Settings className="size-[18px]" />
                <span className="font-medium text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={mockUser.name} className="hover:bg-sidebar-accent/50">
              <button className="flex items-center gap-2">
                <Avatar className="size-7 shrink-0 ring-2 ring-sidebar-border">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                    {mockUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none text-left">
                  <span className="font-medium text-sm truncate">{mockUser.name}</span>
                  <span className="text-xs text-sidebar-foreground/60 truncate">{mockUser.email}</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
