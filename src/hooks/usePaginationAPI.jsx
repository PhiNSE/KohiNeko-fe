import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePaginationAPI(queryKey, queryFn, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data, error } = useQuery({
    queryKey: [...queryKey, currentPage, itemsPerPage],
    queryFn: () => queryFn(currentPage, itemsPerPage),
  });

  const results = data?.results;
  const total = data?.total;

  return { isLoading, results, total, currentPage, setCurrentPage, error };
}
