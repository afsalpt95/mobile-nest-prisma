// hooks/useBranches.ts
import { getUserBranch } from "@/service/API/orgnization.api";
import { useQuery } from "@tanstack/react-query";

export const useBranches = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["branches-all"],
    queryFn: getUserBranch,
  });

  const branches = data?.data ?? [];
  const isBranchRequired = branches.length > 1;

  return {
    branches,
    isBranchRequired,
    isLoading,
    error,
  };
};
