export interface User {
  name: string
  email: string
  avatar: string
  role: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: string
  featured: boolean
  technologies: string[]
  category: string
  imageUrl: string
  liveUrl: string
  githubUrl: string
  createdAt: string
  updatedAt: string
  views: number
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  yearsOfExperience: number
  icon: string
}

export interface Experience {
  id: string
  company: string
  role: string
  type: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  responsibilities: string[]
  technologies: string[]
  logo: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  gpa: string
  location: string
  activities: string[]
  description: string
  logo: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialId: string
  credentialUrl: string
  status: string
  logo: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  featured: boolean
  tags: string[]
  category: string
  readTime: number
  views: number
  publishedAt: string | null
  updatedAt: string
  coverImage: string
}

export interface Stats {
  totalProjects: number
  publishedProjects: number
  totalBlogs: number
  publishedBlogs: number
  totalSkills: number
  totalViews: number
  thisMonthViews: number
  viewsGrowth: number
}

export interface ProfileChecklistItem {
  label: string
  done: boolean
}

export interface ProfileCompletion {
  percentage: number
  checklist: ProfileChecklistItem[]
}

export interface ActivityFeedItem {
  id: string
  type: string
  text: string
  time: string
  icon: string
}

export interface MonthlyView {
  month: string
  views: number
  visitors: number
}

export interface CategoryCount {
  name: string
  count: number
}

export interface ChartData {
  monthlyViews: MonthlyView[]
  projectCategories: CategoryCount[]
  blogTags: CategoryCount[]
}
