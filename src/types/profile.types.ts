export interface Profile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  headline: string;
  bio: string;
  location: string;
  timezone: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  avatar: string | null;
  avatarUrl: string | null;
  username: string;
  portfolioVisibility: string;
  showEmail: boolean;
  openToWork: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSettings {
  id: string;
  userId: string;
  portfolioVisibility: string;
  showEmail: boolean;
  openToWork: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProfileRequest = Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
export type UpdateProfileRequest = Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

export type UpdatePortfolioSettingsRequest = Omit<PortfolioSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
