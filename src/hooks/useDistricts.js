import { useQuery } from "@tanstack/react-query";
import { getDistrict } from "../services/apiLocation";
export function useDistricts(provinceId) {
  console.log(provinceId, "provinceId");
  const { data: provinces } = useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => getDistrict(provinceId.province_id),
  });
  const allDistricts = provinces?.results || [];
  return { allDistricts };
}
