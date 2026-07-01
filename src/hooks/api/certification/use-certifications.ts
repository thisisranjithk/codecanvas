import { useQuery } from '@tanstack/react-query';
import { certificationService } from '@/services/certification/certification.service';
import { queryKeys } from '@/api/query-keys';

export function useCertifications() {
  return useQuery({
    queryKey: queryKeys.certifications.lists(),
    queryFn: async () => {
      const response = await certificationService.getCertifications();
      return response.data;
    },
  });
}
