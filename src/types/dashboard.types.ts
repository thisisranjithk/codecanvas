export interface DashboardStats {
  projects: number;
  publishedProjects: number;
  draftProjects: number;
  blogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  skills: number;
  experience: number;
  education: number;
  certifications: number;
}

export interface DashboardActivity {
  type: string;
  title: string;
  timestamp: string;
}

export interface DashboardFeaturedContent {
  featuredProject: string | null;
  latestBlog: string | null;
  latestCertification: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  featuredContent: DashboardFeaturedContent;
}
