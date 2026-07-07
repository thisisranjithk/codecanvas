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
