import { useQuery } from '@tanstack/react-query';
import { getProvinces } from '../services/apiLocation';
export function useProvinces() {
  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => getProvinces(),
  });
  const allProvinces = provinces?.results || [];
  return { allProvinces };
}
