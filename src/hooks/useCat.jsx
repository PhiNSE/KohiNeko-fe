import { useQuery } from "@tanstack/react-query";
import { getCats } from "../services/apiCat";

export const useCat = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: ["cats"],
    queryFn: () => getCats(),
  });

  console.log(data);
  return {data, isLoading, error};
}
