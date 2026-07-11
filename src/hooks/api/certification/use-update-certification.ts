import { useMutation } from '@tanstack/react-query';
import { certificationService } from '@/services/certification/certification.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { UpdateCertificationRequest } from '@/types/certification.types';

export function useUpdateCertification() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCertificationRequest }) =>
      certificationService.updateCertification(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(queryKeys.certifications.detail(variables.id), response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.lists() });
    },
  });
}
