import { useQuery } from '@tanstack/react-query';
import { getCatDetails } from '../services/apiCat';

export function useCatDetail(shopId, catId) {
  const {
    isLoading,
    data: cat,
    error,
  } = useQuery({
    queryKey: ['catDetail', shopId, catId],
    queryFn: () => getCatDetails(shopId, catId),
  });
  return { isLoading, cat, error };
}
