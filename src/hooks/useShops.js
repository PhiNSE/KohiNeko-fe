import { useQuery } from "@tanstack/react-query";
import { getShops } from "../services/apiShops";

export function useShops(page, perPage, keyGet) {
  const key = keyGet || "";
  console.log(keyGet, key, "key");
  const { isLoading, data, error } = useQuery({
    queryKey: ["shops", page, perPage, keyGet],
    queryFn: () => getShops(page, perPage, key),
  });
  console.log(data, "data");
  const shops = data?.shops;
  const total = data?.total;
  console.log(shops, "shops");
  return { isLoading, shops, total, error };
}
