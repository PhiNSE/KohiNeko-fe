import { getAllShop } from '../services/apiShops';
import { useQuery } from '@tanstack/react-query';

export function useAllShop() {
  const {
    isLoading,
    data: allShop,
    error,
  } = useQuery({
    queryKey: ['allshop'],
    queryFn: () => getAllShop(),
  });
  return { isLoading, allShop, error };
}
