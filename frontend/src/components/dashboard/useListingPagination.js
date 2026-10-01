import { useEffect, useState } from "react";

export default function useListingPagination(items) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  // Keep the selected page valid when search or filters reduce the results.
  const currentPage = Math.min(page, pageCount);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: currentPage,
    pageCount,
    pageSize,
    setPage,
    setPageSize: (value) => {
      setPageSize(Number(value));
      // Start from the first page after changing how many rows are shown.
      setPage(1);
    },
    total: items.length,
  };
}