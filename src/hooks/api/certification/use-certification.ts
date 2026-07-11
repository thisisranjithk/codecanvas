import { useQuery } from '@tanstack/react-query';
import { certificationService } from '@/services/certification/certification.service';
import { queryKeys } from '@/api/query-keys';

export function useCertification(id: string) {
  return useQuery({
    queryKey: queryKeys.certifications.detail(id),
    queryFn: async () => {
      const response = await certificationService.getCertification(id);
      return response.data;
    },
    enabled: !!id,
  });
}
