import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useTableQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const updateParams = useCallback(
    (params: Record<string, any>, caller?: string) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Add this to debug current values
  console.log("Current params:", { page, limit, search });

  return {
    page,
    limit,
    search,
    setPage: (p: number) => updateParams({ page: p }, 'setPage'),
    setLimit: (l: number) => updateParams({ limit: l, page: 1 }, 'setLimit'),
    setSearch: (s: string) => updateParams({ search: s, page: 1 }, 'setSearch'),
  };
};