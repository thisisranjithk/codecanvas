export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string;
  verificationUrl: string;
  certificateMediaId: string | null;
  displayOrder: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
import type { PaginatedResponse } from './api';

export interface CreateCertificationRequest {
  name: string;
  issuer: string;
  issueDate: string; // ISO date string
  expiryDate?: string | null; // ISO date string
  credentialId?: string;
  verificationUrl?: string;
  certificateMediaId?: string | null;
  displayOrder?: number;
}

export type UpdateCertificationRequest = Partial<CreateCertificationRequest>;

export interface CertificationResponse extends Certification { }

export type CertificationsListResponse = PaginatedResponse<CertificationResponse>;
