import { useMemo } from "react"
import {
  TrendingUp, FolderKanban, BookOpen, Zap, Briefcase, Award, GraduationCap,
  FileText, Code2, Pencil, ExternalLink, Check, Circle, ArrowUpRight,
} from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import {
  mockStats,
  mockChartData,
  mockProjects,
  mockBlogs,
  mockSkills,
  mockProfileCompletion,
  mockExperience,
  mockCertifications,
  mockUser,
} from "@/data/mock"

const barChartConfig = {
  count: { label: "Projects", color: "var(--chart-1)" },
} satisfies ChartConfig

function CircularProgress({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  )
}

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

  const doneCount = mockProfileCompletion.checklist.filter((c) => c.done).length
  const totalCount = mockProfileCompletion.checklist.length

  // Top skills for the tech stack summary
  const topSkills = mockSkills.slice(0, 6)

  return (
    <div className="flex flex-col gap-5 p-5 animate-fade-in">
      {/* Top Row: Welcome + Quick Actions + Profile Completion */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-4 border-border/60 overflow-hidden relative">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium">Welcome back,</span>
                <h2 className="text-lg font-bold tracking-tight">{mockUser.name}!</h2>
                <p className="text-[11px] text-muted-foreground max-w-[200px]">
                  You have {mockStats.publishedProjects} published projects and {mockStats.publishedBlogs} blog posts.
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Code2 className="size-6" />
              </div>
            </div>
            <Button size="sm" className="h-8 w-fit gap-1.5 text-xs" asChild>
              <Link to="/projects">
                <ExternalLink className="size-3.5" />
                View Portfolio
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-4 border-border/60">
          <CardHeader className="pb-2 pt-4 px-4">
            <h3 className="text-sm font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border/40 p-2.5 hover:bg-muted/40 hover:border-border transition-all duration-150 text-center"
                >
                  <div className={`flex size-8 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-medium leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className="lg:col-span-4 border-border/60">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <h3 className="text-sm font-semibold">Profile Completion</h3>
            <span className="text-xs text-muted-foreground">{doneCount}/{totalCount}</span>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-4">
              <CircularProgress percentage={mockProfileCompletion.percentage} size={80} />
              <div className="flex-1 flex flex-col gap-1.5">
                {mockProfileCompletion.checklist.slice(0, 5).map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done ? (
                      <Check className="size-3.5 text-success shrink-0" />
                    ) : (
                      <Circle className="size-3.5 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={`text-[11px] ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <Card key={card.label} className="card-hover border-border/60">
            <CardContent className="p-3.5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground font-medium">{card.label}</span>
                  <span className="text-xl font-bold tracking-tight">{card.value}</span>
                  <span className={`text-[10px] font-medium flex items-center gap-0.5 ${card.changeUp ? "text-success" : "text-muted-foreground"}`}>
                    {card.changeUp && <TrendingUp className="size-2.5" />}{card.change}
                  </span>
                </div>
                <div className={`flex size-8 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}>
                  <card.icon className="size-4" />
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
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent Projects</h3>
              <p className="text-[11px] text-muted-foreground">Latest updates</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" asChild>
              <Link to="/projects">
                View all <ArrowUpRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {mockProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors duration-150 group"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <FolderKanban className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-xs font-medium truncate">{project.title}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-[9px] h-4 px-1.5 font-normal bg-secondary/60">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-[9px] h-4 px-1 ${
                        project.status === "published" ? "border-success/30 text-success bg-success/5" :
                        project.status === "draft" ? "border-warning/30 text-warning bg-warning/5" :
                        "border-border text-muted-foreground"
                      }`}
                    >
                      {project.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">{project.updatedAt}</span>
                    <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate({ to: "/projects" })}>
                      <Pencil className="size-3 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent Blog Posts</h3>
              <p className="text-[11px] text-muted-foreground">Latest updates</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" asChild>
              <Link to="/blog">
                View all <ArrowUpRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {mockBlogs.slice(0, 4).map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors duration-150 group"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/8 text-success">
                    <FileText className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-xs font-medium truncate">{blog.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{blog.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-[9px] h-4 px-1 ${
                        blog.status === "published" ? "border-success/30 text-success bg-success/5" :
                        "border-warning/30 text-warning bg-warning/5"
                      }`}
                    >
                      {blog.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">{blog.updatedAt}</span>
                    <span className="text-[10px] text-muted-foreground/60">{blog.readTime} min</span>
                    <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate({ to: "/blog" })}>
                      <Pencil className="size-3 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Project Categories + Technology Stack */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Project Categories */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-4">
            <h3 className="text-sm font-semibold">Project Categories</h3>
            <p className="text-[11px] text-muted-foreground">Distribution by category</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ChartContainer config={barChartConfig} className="min-h-[220px] w-full">
              <BarChart data={mockChartData.projectCategories} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--foreground)", fontWeight: 500 }}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={24}>
                  {mockChartData.projectCategories.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Technology Stack Summary */}
        <Card className="border-border/60">
          <CardHeader className="pb-2 pt-4 px-4">
            <h3 className="text-sm font-semibold">Technology Stack Summary</h3>
            <p className="text-[11px] text-muted-foreground">Top skills by proficiency</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {topSkills.map((skill) => (
                <div key={skill.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{skill.name}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
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
