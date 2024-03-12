import { useQuery } from '@tanstack/react-query';
import { getShopById, getShops } from '../services/apiShops';

export function useShop(shopId) {
  const {
    isLoading,
    data: shop,
    error,
  } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => getShopById(shopId),
  });
  return { isLoading, shop, error };
}
