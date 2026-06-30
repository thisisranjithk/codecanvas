import { useMemo } from 'react';
import {
  TrendingUp,
  FolderKanban,
  BookOpen,
  Zap,
  Briefcase,
  Award,
  GraduationCap,
  FileText,
  Code2,
  ExternalLink,
  ArrowUpRight,
  Activity,
  Star,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStats } from '@/data/stats';
import { mockProjects } from '@/data/projects';
import { mockBlogs } from '@/data/blogs';
import { mockExperience } from '@/data/experience';
import { mockCertifications } from '@/data/certifications';
import { useAuth } from '@/hooks/use-auth';

const mockRecentActivity = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i + 1),
  type: [
    'EXPERIENCE_ADDED',
    'PROJECT_PUBLISHED',
    'BLOG_DRAFTED',
    'SKILL_ADDED',
    'CERTIFICATE_ADDED',
  ][i % 5],
  title:
    [
      'Software Engineer at Google',
      mockProjects[0]?.title || 'Portfolio CMS',
      mockBlogs[0]?.title || 'React Patterns',
      'Next.js',
      'AWS Certified Developer',
    ][i % 5] + (i > 4 ? ` (Update ${i})` : ''),
  timestamp: new Date(Date.now() - i * 86400000 - i * 3600000).toISOString(),
}));

const mockFeaturedContent = {
  featuredProject: mockProjects[0] || null,
  latestBlog: mockBlogs[0] || null,
  latestCertification: mockCertifications[0] || null,
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const statCards = useMemo(
    () => [
      {
        label: 'Total Projects',
        value: mockStats.totalProjects,
        change: '+12%',
        changeUp: true,
        icon: FolderKanban,
        color: 'text-primary',
        bgColor: 'bg-primary/8',
      },
      {
        label: 'Published Blogs',
        value: mockStats.publishedBlogs,
        change: '+5%',
        changeUp: true,
        icon: BookOpen,
        color: 'text-success',
        bgColor: 'bg-success/8',
      },
      {
        label: 'Skills',
        value: mockStats.totalSkills,
        change: '+3',
        changeUp: true,
        icon: Zap,
        color: 'text-warning',
        bgColor: 'bg-warning/8',
      },
      {
        label: 'Experience',
        value: mockExperience.length,
        change: '+1',
        changeUp: true,
        icon: Briefcase,
        color: 'text-info',
        bgColor: 'bg-info/8',
      },
      {
        label: 'Certifications',
        value: mockCertifications.length,
        change: '0',
        changeUp: false,
        icon: Award,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/8',
      },
    ],
    []
  );

  const quickActions = [
    {
      label: 'Add Project',
      icon: FolderKanban,
      path: '/projects',
      color: 'bg-primary/8 text-primary',
    },
    { label: 'Write Blog', icon: FileText, path: '/blog', color: 'bg-success/8 text-success' },
    { label: 'Add Skill', icon: Zap, path: '/skills', color: 'bg-warning/8 text-warning' },
    { label: 'Add Experience', icon: Briefcase, path: '/experience', color: 'bg-info/8 text-info' },
    {
      label: 'Add Education',
      icon: GraduationCap,
      path: '/education',
      color: 'bg-pink-500/8 text-pink-500',
    },
    {
      label: 'Add Certificate',
      icon: Award,
      path: '/certifications',
      color: 'bg-violet-500/8 text-violet-500',
    },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6">
      {/* Top Row: Welcome + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Welcome Banner */}
        <Card className="border-border/60 from-primary/10 via-background to-background relative overflow-hidden bg-gradient-to-br">
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="bg-primary/20 blur-20 absolute -top-24 -right-24 size-64 rounded-full" />
            <div className="bg-secondary/20 blur-14 absolute top-20 right-10 size-40 rounded-full" />
            <svg
              className="text-primary absolute top-0 right-0 h-full w-1/2 opacity-[0.03] dark:opacity-[0.05]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="welcome-pattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#welcome-pattern)" />
            </svg>
          </div>

          <CardContent className="relative z-10 flex flex-col gap-5 p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-primary text-3 font-semibold tracking-wider uppercase">
                  Welcome back
                </span>
                <h2 className="text-3xl font-bold tracking-tight">{user?.fullName}!</h2>
                <p className="text-muted-foreground mt-1 max-w-[300px] text-sm leading-relaxed">
                  You have{' '}
                  <strong className="text-foreground font-semibold">
                    {mockStats.publishedProjects} published projects
                  </strong>{' '}
                  and{' '}
                  <strong className="text-foreground font-semibold">
                    {mockStats.publishedBlogs} blog posts
                  </strong>
                  . Keep up the great work!
                </p>
              </div>
              <div className="bg-primary text-primary-foreground shadow-primary/25 flex size-12 shrink-0 rotate-3 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 hover:rotate-0">
                <Code2 className="size-6" />
              </div>
            </div>
            <Button
              className="h-9 w-fit gap-2 rounded-lg text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg"
              asChild
            >
              <Link to="/projects">
                View Portfolio <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/60">
          <CardHeader className="px-5 pt-4 pb-2">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="border-border/40 hover:bg-muted/40 hover:border-border flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all duration-150"
                >
                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ${action.color}`}
                  >
                    <action.icon className="size-4" />
                  </div>
                  <span className="text-3 leading-tight font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label} className="card-hover border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-3 font-medium">{card.label}</span>
                  <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                  <span
                    className={`text-3 flex items-center gap-0.5 font-medium ${card.changeUp ? 'text-success' : 'text-muted-foreground'}`}
                  >
                    {card.changeUp && <TrendingUp className="size-3.5" />}
                    {card.change}
                  </span>
                </div>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}
                >
                  <card.icon className="size-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Row: Recent Activity + Featured Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/60 flex h-[420px] flex-col overflow-hidden">
          <CardHeader className="border-border/40 bg-muted/20 flex shrink-0 flex-row items-center justify-between border-b px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Activity className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Recent Activity</h3>
                <p className="text-muted-foreground text-xs">Your latest updates</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {mockRecentActivity.map((activity) => {
                let badgeColor = 'bg-muted text-muted-foreground';

                if (activity.type.includes('EXPERIENCE')) badgeColor = 'bg-info/10 text-info';
                else if (activity.type.includes('PROJECT'))
                  badgeColor = 'bg-primary/10 text-primary';
                else if (activity.type.includes('BLOG')) badgeColor = 'bg-success/10 text-success';
                else if (activity.type.includes('SKILL')) badgeColor = 'bg-warning/10 text-warning';
                else if (activity.type.includes('CERTIFICATE'))
                  badgeColor = 'bg-violet-500/10 text-violet-500';

                return (
                  <div
                    key={activity.id}
                    className="border-border/50 bg-card hover:bg-muted/40 flex flex-col gap-1.5 rounded-xl border p-3.5 transition-colors"
                  >
                    <span className="text-foreground truncate text-sm font-semibold">
                      {activity.title}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${badgeColor}`}
                      >
                        {activity.type.replace('_', ' ')}
                      </span>
                      <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Featured Content */}
        <Card className="border-border/60 from-background via-background to-muted/10 flex h-[420px] flex-col overflow-hidden bg-gradient-to-br">
          <CardHeader className="border-border/40 flex shrink-0 flex-row items-center justify-between border-b px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-lg">
                <Star className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Featured Content</h3>
                <p className="text-muted-foreground text-xs">Highlighting your best work</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {mockFeaturedContent.featuredProject ? (
                <div
                  className="group flex cursor-pointer flex-col gap-2"
                  onClick={() => navigate({ to: '/projects' })}
                >
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <FolderKanban className="text-primary/70 size-3.5" /> Featured Project
                  </span>
                  <div className="border-border/60 bg-card hover:border-primary/30 flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                      <FolderKanban className="size-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
                        {mockFeaturedContent.featuredProject.title}
                      </span>
                      <p className="text-muted-foreground line-clamp-1 text-xs">
                        {mockFeaturedContent.featuredProject.description ||
                          'A showcase of my recent work.'}
                      </p>
                    </div>
                    <div className="bg-primary/5 text-primary group-hover:bg-primary/10 flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {mockFeaturedContent.latestBlog ? (
                <div
                  className="group flex cursor-pointer flex-col gap-2"
                  onClick={() => navigate({ to: '/blog' })}
                >
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <FileText className="text-success/70 size-3.5" /> Latest Post
                  </span>
                  <div className="border-border/60 bg-card hover:border-success/30 flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="bg-success/10 text-success flex size-9 shrink-0 items-center justify-center rounded-lg">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="group-hover:text-success truncate text-sm font-semibold transition-colors">
                        {mockFeaturedContent.latestBlog.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-semibold tracking-wider uppercase">
                          {mockFeaturedContent.latestBlog.category}
                        </span>
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                          <Clock className="size-3" /> {mockFeaturedContent.latestBlog.readTime} min
                          read
                        </span>
                      </div>
                    </div>
                    <div className="bg-success/5 text-success group-hover:bg-success/10 flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {mockFeaturedContent.latestCertification ? (
                <div
                  className="group flex cursor-pointer flex-col gap-2"
                  onClick={() => navigate({ to: '/certifications' })}
                >
                  <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <Award className="size-3.5 text-violet-500/70" /> Latest Certification
                  </span>
                  <div className="border-border/60 bg-card flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-md">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                      <Award className="size-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-semibold transition-colors group-hover:text-violet-500">
                        {mockFeaturedContent.latestCertification.name}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {mockFeaturedContent.latestCertification.issuer}
                      </span>
                    </div>
                    <div className="flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-violet-500/5 text-violet-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-violet-500/10 group-hover:opacity-100">
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
  );
}
