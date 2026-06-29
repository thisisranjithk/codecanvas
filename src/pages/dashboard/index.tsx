import { useMemo } from "react"
import {
  TrendingUp, FolderKanban, BookOpen, Zap, Briefcase, Award, GraduationCap,
  FileText, Code2, ExternalLink, ArrowUpRight, Activity, Star, Clock
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Link, useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockStats } from "@/data/stats"
import { mockProjects } from "@/data/projects"
import { mockBlogs } from "@/data/blogs"
import { mockExperience } from "@/data/experience"
import { mockCertifications } from "@/data/certifications"
import { mockUser } from "@/data/user"

const mockRecentActivity = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i + 1),
  type: ["EXPERIENCE_ADDED", "PROJECT_PUBLISHED", "BLOG_DRAFTED", "SKILL_ADDED", "CERTIFICATE_ADDED"][i % 5],
  title: [
    "Software Engineer at Google",
    mockProjects[0]?.title || "Portfolio CMS",
    mockBlogs[0]?.title || "React Patterns",
    "Next.js",
    "AWS Certified Developer"
  ][i % 5] + (i > 4 ? ` (Update ${i})` : ""),
  timestamp: new Date(Date.now() - i * 86400000 - i * 3600000).toISOString(),
}));

const mockFeaturedContent = {
  featuredProject: mockProjects[0] || null,
  latestBlog: mockBlogs[0] || null,
  latestCertification: mockCertifications[0] || null
};

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
        <Card className="border-border/60 overflow-hidden relative bg-gradient-to-br from-primary/10 via-background to-background">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 size-64 bg-primary/20 blur-[80px] rounded-full" />
            <div className="absolute top-20 right-10 size-40 bg-secondary/20 blur-[60px] rounded-full" />
            <svg
              className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] text-primary dark:opacity-[0.05]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="welcome-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#welcome-pattern)" />
            </svg>
          </div>

          <CardContent className="p-6 flex flex-col gap-5 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] text-primary font-semibold tracking-wider uppercase">Welcome back</span>
                <h2 className="text-3xl font-bold tracking-tight">{mockUser.name}!</h2>
                <p className="text-[14px] text-muted-foreground max-w-[300px] mt-1 leading-relaxed">
                  You have <strong className="text-foreground font-semibold">{mockStats.publishedProjects} published projects</strong> and <strong className="text-foreground font-semibold">{mockStats.publishedBlogs} blog posts</strong>. Keep up the great work!
                </p>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Code2 className="size-6" />
              </div>
            </div>
            <Button className="h-9 w-fit gap-2 text-[14px] font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg" asChild>
              <Link to="/projects">
                View Portfolio <ExternalLink className="size-3.5" />
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

      {/* Bottom Row: Recent Activity + Featured Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/60 flex flex-col h-[420px] overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight">Recent Activity</h3>
                <p className="text-[12px] text-muted-foreground">Your latest updates</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-3">
              {mockRecentActivity.map((activity) => {
                let badgeColor = "bg-muted text-muted-foreground";

                if (activity.type.includes("EXPERIENCE")) badgeColor = "bg-info/10 text-info";
                else if (activity.type.includes("PROJECT")) badgeColor = "bg-primary/10 text-primary";
                else if (activity.type.includes("BLOG")) badgeColor = "bg-success/10 text-success";
                else if (activity.type.includes("SKILL")) badgeColor = "bg-warning/10 text-warning";
                else if (activity.type.includes("CERTIFICATE")) badgeColor = "bg-violet-500/10 text-violet-500";

                return (
                  <div key={activity.id} className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card p-3.5 hover:bg-muted/40 transition-colors">
                    <span className="text-[14px] font-semibold text-foreground truncate">{activity.title}</span>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
                        {activity.type.replace("_", " ")}
                      </span>
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Featured Content */}
        <Card className="border-border/60 flex flex-col h-[420px] bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-5 flex flex-row items-center justify-between border-b border-border/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Star className="size-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight">Featured Content</h3>
                <p className="text-[12px] text-muted-foreground">Highlighting your best work</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto overflow-x-hidden">

            <div className="flex flex-col gap-4">
              {mockFeaturedContent.featuredProject ? (
                <div className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate({ to: "/projects" })}>
                  <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <FolderKanban className="size-3.5 text-primary/70" /> Featured Project
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderKanban className="size-4" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                      <span className="text-[14px] font-semibold truncate group-hover:text-primary transition-colors">{mockFeaturedContent.featuredProject.title}</span>
                      <p className="text-[12px] text-muted-foreground line-clamp-1">{mockFeaturedContent.featuredProject.description || "A showcase of my recent work."}</p>
                    </div>
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {mockFeaturedContent.latestBlog ? (
                <div className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate({ to: "/blog" })}>
                  <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <FileText className="size-3.5 text-success/70" /> Latest Post
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm hover:shadow-md hover:border-success/30 transition-all duration-300">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                      <span className="text-[14px] font-semibold truncate group-hover:text-success transition-colors">{mockFeaturedContent.latestBlog.title}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-muted px-2 py-0.5 rounded-md text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{mockFeaturedContent.latestBlog.category}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0"><Clock className="size-3" /> {mockFeaturedContent.latestBlog.readTime} min read</span>
                      </div>
                    </div>
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/5 text-success opacity-0 group-hover:opacity-100 group-hover:bg-success/10 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {mockFeaturedContent.latestCertification ? (
                <div className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate({ to: "/certifications" })}>
                  <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <Award className="size-3.5 text-violet-500/70" /> Latest Certification
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all duration-300">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                      <Award className="size-4" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                      <span className="text-[14px] font-semibold truncate group-hover:text-violet-500 transition-colors">{mockFeaturedContent.latestCertification.name}</span>
                      <span className="text-[12px] text-muted-foreground truncate">{mockFeaturedContent.latestCertification.issuer}</span>
                    </div>
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/5 text-violet-500 opacity-0 group-hover:opacity-100 group-hover:bg-violet-500/10 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
