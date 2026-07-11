import { useQuery } from '@tanstack/react-query';
import { educationService } from '@/services/education/education.service';
import { queryKeys } from '@/api/query-keys';

export function useEducation(id: string) {
  return useQuery({
    queryKey: queryKeys.educations.detail(id),
    queryFn: async () => {
      const response = await educationService.getEducation(id);
      return response.data;
    },
    enabled: !!id,
  });
}
