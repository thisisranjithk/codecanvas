export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  featured: boolean;
  technologies: string[];
  category: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  link?: string;
  status: string;
  featured: boolean;
  tags: string[];
  category: string;
  readTime: number;
  views: number;
  publishedAt: string | null;
  updatedAt: string;
  coverImage: string;
}
