import { Outlet, useRouterState, Navigate } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { TopNav } from './top-nav';
import { Toaster } from '@/components/ui/sonner';
import { GlobalSearch } from '@/components/shared/global-search';
import { useAuth } from '@/hooks/use-auth';

import { AuthProvider } from '@/providers/auth-context';

function RootLayoutInner() {
  const { isAuthenticated, isLoading } = useAuth();
  const routerState = useRouterState();
  const isAuthPage =
    routerState.location.pathname === '/login' || routerState.location.pathname === '/register';

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" />;
  }

  if (isAuthPage) {
    return (
      <>
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster position="bottom-right" richColors />
      <GlobalSearch />
    </SidebarProvider>
  );
}

export function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
