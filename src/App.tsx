import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { Dashboard } from "@/pages/dashboard"
import { Projects } from "@/pages/projects"
import { Skills } from "@/pages/skills"
import { Experience } from "@/pages/experience"
import { Education } from "@/pages/education"
import { Certifications } from "@/pages/certifications"
import { Blog } from "@/pages/blog"
import { Settings } from "@/pages/settings"
import { Toaster } from "@/components/ui/sonner"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes: Record<string, { component: React.ComponentType<any>; breadcrumbs: { label: string; path?: string }[] }> = {
  "/": {
    component: Dashboard,
    breadcrumbs: [{ label: "Dashboard" }],
  },
  "/projects": {
    component: Projects,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Projects" }],
  },
  "/skills": {
    component: Skills,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Skills" }],
  },
  "/experience": {
    component: Experience,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Experience" }],
  },
  "/education": {
    component: Education,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Education" }],
  },
  "/certifications": {
    component: Certifications,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Certifications" }],
  },
  "/blog": {
    component: Blog,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Blog" }],
  },
  "/settings": {
    component: Settings,
    breadcrumbs: [{ label: "Dashboard", path: "/" }, { label: "Settings" }],
  },
}

export default function App() {
  const [currentPath, setCurrentPath] = useState("/")

  const route = routes[currentPath] ?? routes["/"]
  const PageComponent = route.component

  return (
    <SidebarProvider>
      <AppSidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      <SidebarInset>
        <TopNav breadcrumbs={route.breadcrumbs} onNavigate={setCurrentPath} />
        <div className="flex-1 overflow-auto">
          <PageComponent onNavigate={setCurrentPath} />
        </div>
      </SidebarInset>
      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  )
}
