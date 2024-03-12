import { useQuery } from '@tanstack/react-query';
import { getItemsInShop } from '../services/apiItems';

export function useItemByShop(shopId) {
  const {
    isLoading,
    data: item,
    error,
  } = useQuery({
    queryKey: ['item', shopId],
    queryFn: () => getItemsInShop(shopId),
  });
  return { isLoading, item, error };
}
