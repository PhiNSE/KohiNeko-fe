import { useQuery } from "@tanstack/react-query";
import { getShops } from "../services/apiShops";

export function useShops(page, perPage, keyGet, city, district, trigger) {
  const key = keyGet || "";
  // console.log(keyGet, key, "key");
  const { isLoading, data, error } = useQuery({
    queryKey: ["shops", page, perPage, keyGet, trigger],
    queryFn: () => getShops(page, perPage, key, city, district),
  });
  // console.log(data, 'data');
  const shops = data?.shops;
  const total = data ? data.total : 0;
  // console.log(shops, 'shops');
  return { isLoading, shops, total, error };
}
