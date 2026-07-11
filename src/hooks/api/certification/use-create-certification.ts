import { useMutation } from '@tanstack/react-query';
import { certificationService } from '@/services/certification/certification.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { CreateCertificationRequest } from '@/types/certification.types';

export function useCreateCertification() {
  return useMutation({
    mutationFn: (data: CreateCertificationRequest) =>
      certificationService.createCertification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
