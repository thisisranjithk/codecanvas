import { useMutation } from '@tanstack/react-query';
import { certificationService } from '@/services/certification/certification.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';

export function useDeleteCertification() {
  return useMutation({
    mutationFn: (id: string) => certificationService.deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certifications.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
