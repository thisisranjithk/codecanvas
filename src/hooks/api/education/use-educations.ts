import { useQuery } from '@tanstack/react-query';
import { educationService } from '@/services/education/education.service';
import { queryKeys } from '@/api/query-keys';

export function useEducations() {
  return useQuery({
    queryKey: queryKeys.educations.lists(),
    queryFn: async () => {
      const response = await educationService.getEducations();
      return response.data;
    },
  });
}
