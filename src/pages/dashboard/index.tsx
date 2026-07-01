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
import { useAuth } from '@/hooks/use-auth';
import { useDashboard } from '@/hooks/api/dashboard/use-dashboard';
import { ErrorState } from '@/components/shared/error-state';
import { Loader } from '@/components/ui/loader';

const getWelcomeMessage = (projects: number, blogs: number) => {
  const total = projects + blogs;

  if (total === 0) {
    return (
      <p className="text-muted-foreground mt-1 max-w-[400px] text-sm leading-relaxed">
        Welcome to your portfolio! Start by adding some projects or writing a blog post to showcase your skills.
      </p>
    );
  }

  if (projects > 0 && blogs === 0) {
    return (
      <p className="text-muted-foreground mt-1 max-w-[400px] text-sm leading-relaxed">
        Great start! You have{' '}
        <strong className="text-foreground font-semibold">
          {projects} published {projects === 1 ? 'project' : 'projects'}
        </strong>
        . Consider writing a blog post to share your knowledge!
      </p>
    );
  }

  if (projects === 0 && blogs > 0) {
    return (
      <p className="text-muted-foreground mt-1 max-w-[400px] text-sm leading-relaxed">
        You're a great writer! You have{' '}
        <strong className="text-foreground font-semibold">
          {blogs} published {blogs === 1 ? 'blog' : 'blogs'}
        </strong>
        . Time to showcase some of your projects?
      </p>
    );
  }

  if (total > 0 && total <= 5) {
    return (
      <p className="text-muted-foreground mt-1 max-w-[400px] text-sm leading-relaxed">
        You're building momentum! You have{' '}
        <strong className="text-foreground font-semibold">
          {projects} {projects === 1 ? 'project' : 'projects'}
        </strong>{' '}
        and{' '}
        <strong className="text-foreground font-semibold">
          {blogs} {blogs === 1 ? 'blog' : 'blogs'}
        </strong>
        . Keep adding more to stand out!
      </p>
    );
  }

  return (
    <p className="text-muted-foreground mt-1 max-w-[400px] text-sm leading-relaxed">
      Incredible work! You have an impressive portfolio with{' '}
      <strong className="text-foreground font-semibold">
        {projects} {projects === 1 ? 'project' : 'projects'}
      </strong>{' '}
      and{' '}
      <strong className="text-foreground font-semibold">
        {blogs} {blogs === 1 ? 'blog' : 'blogs'}
      </strong>
      . Keep up the great work!
    </p>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: response, isLoading, isError, error, refetch } = useDashboard();

  const data = response?.data;

  const statCards = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Total Projects',
        value: data.stats.projects,
        icon: FolderKanban,
        color: 'text-primary',
        bgColor: 'bg-primary/8',
      },
      {
        label: 'Published Blogs',
        value: data.stats.publishedBlogs,
        icon: BookOpen,
        color: 'text-success',
        bgColor: 'bg-success/8',
      },
      {
        label: 'Skills',
        value: data.stats.skills,
        icon: Zap,
        color: 'text-warning',
        bgColor: 'bg-warning/8',
      },
      {
        label: 'Experience',
        value: data.stats.experience,
        icon: Briefcase,
        color: 'text-info',
        bgColor: 'bg-info/8',
      },
      {
        label: 'Certifications',
        value: data.stats.certifications,
        changeUp: false,
        icon: Award,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/8',
      },
    ];
  }, [data]);

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

  if (isLoading) {
    return <Loader variant="section" text="Loading dashboard..." />;
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load dashboard"
          description={
            error?.message || 'An unexpected error occurred while fetching dashboard data.'
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6">
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
                <h2 className="text-3xl font-bold tracking-tight">{user?.fullName || 'User'}!</h2>
                {getWelcomeMessage(data.stats.publishedProjects, data.stats.publishedBlogs)}
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
        <Card className="border-border/60 flex h-[420px] flex-col overflow-hidden p-0">
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
              {data.recentActivity.map((activity, index) => {
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
                    key={`${activity.type}-${index}`}
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

              {data.recentActivity.length === 0 && (
                <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Content */}
        <Card className="border-border/60 from-background via-background to-muted/10 flex h-[420px] flex-col overflow-hidden bg-gradient-to-br p-0">
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
              {data.featuredContent.featuredProject ? (
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
                        {data.featuredContent.featuredProject}
                      </span>
                    </div>
                    <div className="bg-primary/5 text-primary group-hover:bg-primary/10 flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {data.featuredContent.latestBlog ? (
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
                        {data.featuredContent.latestBlog}
                      </span>
                    </div>
                    <div className="bg-success/5 text-success group-hover:bg-success/10 flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {data.featuredContent.latestCertification ? (
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
                        {data.featuredContent.latestCertification.name}
                      </span>
                    </div>
                    <div className="flex size-7 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-violet-500/5 text-violet-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-violet-500/10 group-hover:opacity-100">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </div>
                </div>
              ) : null}

              {!data.featuredContent.featuredProject &&
                !data.featuredContent.latestBlog &&
                !data.featuredContent.latestCertification && (
                  <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                    No featured content found.
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
