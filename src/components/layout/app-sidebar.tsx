import { useEffect } from 'react';
import { Settings, Layers } from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';
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
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { navItems } from '@/config/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AppSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();

  useEffect(() => {
    setOpenMobile(false);
  }, [currentPath, setOpenMobile]);

  const userInitials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    : 'U';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border h-16 justify-center border-b px-2.5 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent/50" asChild>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="bg-primary text-primary-foreground shadow-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm">
                  <Layers className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-semibold tracking-tight">Portfolio CMS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/15 [&>svg]:text-primary'
                          : 'hover:bg-sidebar-accent/50'
                      }
                    >
                      <Link to={item.path} className="relative flex items-center">
                        <item.icon className="size-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-1 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === '/settings'}
              tooltip="Settings"
              className={
                currentPath === '/settings'
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 [&>svg]:text-primary'
                  : 'hover:bg-sidebar-accent/50'
              }
            >
              <Link to="/settings" className="flex items-center">
                <Settings className="size-4" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Logout"
              className="hover:bg-sidebar-accent/50 justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="ring-sidebar-border size-7 shrink-0 ring-2">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 text-left leading-none group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{user?.fullName || 'User'}</span>
                  <span className="text-sidebar-foreground/60 truncate text-xs">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>
              </div>
              {/* <LogOut className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" /> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
