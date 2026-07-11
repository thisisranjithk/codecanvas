import type { Certification } from './certification.types';
import type { Project } from './project.types';


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
  featuredProject: Project | null;
  latestBlog: { id: string; title: string } | null;
  latestCertification: Certification | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  featuredContent: DashboardFeaturedContent;
}
