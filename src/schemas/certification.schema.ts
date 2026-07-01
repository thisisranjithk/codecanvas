import { z } from 'zod';

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(200),
  issuer: z.string().min(1, 'Issuing organization is required').max(200),
  issueDate: z.date({ error: 'Issue date is required' }),
  expiryDate: z.date({ error: 'Invalid date' }).nullable(),
  credentialId: z.string().min(1, 'Credential ID is required').max(100),
  verificationUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;
