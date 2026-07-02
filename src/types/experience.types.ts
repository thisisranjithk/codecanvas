export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentTypeId: string;
  employmentType?: {
    id: string;
    name: string;
  };
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  displayOrder: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExperienceRequest {
  company: string;
  role: string;
  employmentTypeId: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  displayOrder?: number;
}

export type UpdateExperienceRequest = Partial<CreateExperienceRequest>;
