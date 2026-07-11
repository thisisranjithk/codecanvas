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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface MeResponse {
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}
