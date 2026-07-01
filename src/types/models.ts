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



export interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  logo: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa: string;
  location: string;
  activities: string[];
  description: string;
  logo: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string;
  credentialUrl: string;
  status: string;
  logo: string;
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
