import { useMemo } from "react"
import {
  TrendingUp, FolderKanban, BookOpen, Zap, Briefcase, Award, GraduationCap,
  FileText, Code2, Pencil, ExternalLink, ArrowUpRight,
} from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockStats } from "@/data/stats"
import { mockProjects } from "@/data/projects"
import { mockBlogs } from "@/data/blogs"
import { mockExperience } from "@/data/experience"
import { mockCertifications } from "@/data/certifications"
import { mockUser } from "@/data/user"

export function Dashboard() {
  const navigate = useNavigate()

  const statCards = useMemo(() => [
    {
      label: "Total Projects",
      value: mockStats.totalProjects,
      change: "+12%",
      changeUp: true,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/8",
    },
    {
      label: "Published Blogs",
      value: mockStats.publishedBlogs,
      change: "+5%",
      changeUp: true,
      icon: BookOpen,
      color: "text-success",
      bgColor: "bg-success/8",
    },
    {
      label: "Skills",
      value: mockStats.totalSkills,
      change: "+3",
      changeUp: true,
      icon: Zap,
      color: "text-warning",
      bgColor: "bg-warning/8",
    },
    {
      label: "Experience",
      value: mockExperience.length,
      change: "+1",
      changeUp: true,
      icon: Briefcase,
      color: "text-info",
      bgColor: "bg-info/8",
    },
    {
      label: "Certifications",
      value: mockCertifications.length,
      change: "0",
      changeUp: false,
      icon: Award,
      color: "text-violet-500",
      bgColor: "bg-violet-500/8",
    },
  ], [])

  const quickActions = [
    { label: "Add Project", icon: FolderKanban, path: "/projects", color: "bg-primary/8 text-primary" },
    { label: "Write Blog", icon: FileText, path: "/blog", color: "bg-success/8 text-success" },
    { label: "Add Skill", icon: Zap, path: "/skills", color: "bg-warning/8 text-warning" },
    { label: "Add Experience", icon: Briefcase, path: "/experience", color: "bg-info/8 text-info" },
    { label: "Add Education", icon: GraduationCap, path: "/education", color: "bg-pink-500/8 text-pink-500" },
    { label: "Add Certificate", icon: Award, path: "/certifications", color: "bg-violet-500/8 text-violet-500" },
  ]



  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      {/* Top Row: Welcome + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Welcome Banner */}
        <Card className="border-border/60 overflow-hidden relative">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] text-muted-foreground font-medium">Welcome back,</span>
                <h2 className="text-2xl font-bold tracking-tight">{mockUser.name}!</h2>
                <p className="text-[13px] text-muted-foreground max-w-[280px]">
                  You have {mockStats.publishedProjects} published projects and {mockStats.publishedBlogs} blog posts.
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="size-6" />
              </div>
            </div>
            <Button size="sm" className="h-9 w-fit gap-1.5 text-[15px]" asChild>
              <Link to="/projects">
                <ExternalLink className="size-4" />
                View Portfolio
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-5">
            <h3 className="text-[17px] font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border/40 p-3 hover:bg-muted/40 hover:border-border transition-all duration-150 text-center"
                >
                  <div className={`flex size-9 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="size-4" />
                  </div>
                  <span className="text-[13px] font-medium leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <Card key={card.label} className="card-hover border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-muted-foreground font-medium">{card.label}</span>
                  <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                  <span className={`text-[13px] font-medium flex items-center gap-0.5 ${card.changeUp ? "text-success" : "text-muted-foreground"}`}>
                    {card.changeUp && <TrendingUp className="size-3.5" />}{card.change}
                  </span>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}>
                  <card.icon className="size-[18px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Row: Recent Projects + Recent Blog Posts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold">Recent Projects</h3>
              <p className="text-[13px] text-muted-foreground">Latest updates</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-[13px] gap-1" asChild>
              <Link to="/projects">
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex flex-col gap-2">
              {mockProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors duration-150 group"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <FolderKanban className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-[15px] font-medium truncate">{project.title}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs h-5 px-1.5 font-normal bg-secondary/60">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-xs h-5 px-1.5 ${
                        project.status === "published" ? "border-success/30 text-success bg-success/5" :
                        project.status === "draft" ? "border-warning/30 text-warning bg-warning/5" :
                        "border-border text-muted-foreground"
                      }`}
                    >
                      {project.status}
                    </Badge>
                    <span className="text-[13px] text-muted-foreground/60 hidden sm:inline">{project.updatedAt}</span>
                    <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate({ to: "/projects" })}>
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold">Recent Blog Posts</h3>
              <p className="text-[13px] text-muted-foreground">Latest updates</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-[13px] gap-1" asChild>
              <Link to="/blog">
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex flex-col gap-2">
              {mockBlogs.slice(0, 4).map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors duration-150 group"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/8 text-success">
                    <FileText className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-[15px] font-medium truncate">{blog.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-muted-foreground">{blog.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-xs h-5 px-1.5 ${
                        blog.status === "published" ? "border-success/30 text-success bg-success/5" :
                        "border-warning/30 text-warning bg-warning/5"
                      }`}
                    >
                      {blog.status}
                    </Badge>
                    <span className="text-[13px] text-muted-foreground/60 hidden sm:inline">{blog.updatedAt}</span>
                    <span className="text-[13px] text-muted-foreground/60">{blog.readTime} min</span>
                    <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate({ to: "/blog" })}>
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
