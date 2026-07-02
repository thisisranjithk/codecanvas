export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  location?: string;
  description?: string;
  activities: string[];
  displayOrder: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // ISO date string
  endDate?: string | null;
  gpa?: string;
  location?: string;
  description?: string;
  activities?: string[];
  displayOrder?: number;
}

export type UpdateEducationRequest = Partial<CreateEducationRequest>;
