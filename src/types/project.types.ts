export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  status?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  status: ProjectStatus;
  technologies: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  thumbnailMediaId?: string | null;
  views?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProjectsListResponse {
  meta: ProjectsMeta;
  data: Project[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  categoryId: string;
  technologies: string[];
  status?: ProjectStatus;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  thumbnailMediaId?: string | null;
}

export type UpdateProjectRequest = Partial<CreateProjectRequest>;
