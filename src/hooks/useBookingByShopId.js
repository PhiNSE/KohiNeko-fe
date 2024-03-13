import { useQuery } from "@tanstack/react-query";
import { managerGetBookingHistory } from "../services/apiBooking";

export function useBookingByShopId(
  page = 1,
  perPage = 5,
  status,
  sort = "desc",
  search = ""
) {
  const {
    isLoading,
    data: bookingByShop,
    error,
    refetch: refetchBookingByShop,
  } = useQuery({
    queryKey: ["bookingByShop", page, perPage, status, sort, search],
    queryFn: () =>
      managerGetBookingHistory(page, perPage, status, sort, search),
  });

  return { isLoading, bookingByShop, error, refetchBookingByShop };
}
