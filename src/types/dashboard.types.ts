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
import type { Certification } from './certification.types';

export interface DashboardFeaturedContent {
  featuredProject: string | null;
  latestBlog: string | null;
  latestCertification: Certification | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  featuredContent: DashboardFeaturedContent;
}
