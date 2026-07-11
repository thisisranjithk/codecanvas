export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  proficiency: number;
  yearsOfExperience: number;
  displayOrder: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillRequest {
  name: string;
  categoryId: string;
  proficiency: number;
  yearsOfExperience: number;
  displayOrder?: number;
}

export type UpdateSkillRequest = Partial<CreateSkillRequest>;
