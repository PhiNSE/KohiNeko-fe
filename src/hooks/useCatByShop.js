import { useQuery } from '@tanstack/react-query';
import { getCatByShop } from '../services/apiCat';

export function useCatByShop(shopId) {
  const {
    isLoading,
    data: cat,
    error,
  } = useQuery({
    queryKey: ['cats', shopId],
    queryFn: () => getCatByShop(shopId),
  });
  return { isLoading, cat, error };
}
