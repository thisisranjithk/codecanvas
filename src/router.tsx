import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { Toaster } from "@/components/ui/sonner"

import { Dashboard } from "@/pages/dashboard"
import { Projects } from "@/pages/projects"
import { Skills } from "@/pages/skills"
import { Experience } from "@/pages/experience"
import { Education } from "@/pages/education"
import { Certifications } from "@/pages/certifications"
import { Blog } from "@/pages/blog"
import { Settings } from "@/pages/settings"

// Type for our route's static data
export type RouteStaticData = {
  breadcrumbs: { label: string; path?: string }[]
}

const rootRoute = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
  staticData: {
    breadcrumbs: [{ label: "Dashboard" }],
  } as RouteStaticData,
})

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Projects,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Projects" }],
  } as RouteStaticData,
})

const skillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/skills",
  component: Skills,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Skills" }],
  } as RouteStaticData,
})

const experienceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/experience",
  component: Experience,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Experience" }],
  } as RouteStaticData,
})

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/education",
  component: Education,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Education" }],
  } as RouteStaticData,
})

const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certifications",
  component: Certifications,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Certifications" }],
  } as RouteStaticData,
})

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Blog" }],
  } as RouteStaticData,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
  staticData: {
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Settings" }],
  } as RouteStaticData,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectsRoute,
  skillsRoute,
  experienceRoute,
  educationRoute,
  certificationsRoute,
  blogRoute,
  settingsRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    breadcrumbs?: { label: string; path?: string }[]
  }
}
