import { Outlet } from "@tanstack/react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNav } from "./top-nav"
import { Toaster } from "@/components/ui/sonner"
import { GlobalSearch } from "@/components/shared/global-search"

export function RootLayout() {
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
  )
}
