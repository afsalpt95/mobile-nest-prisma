"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserBranch } from "@/service/API/orgnization.api";
import Dropdown from "../UI/Dropdown";
import { useEffect } from "react";

const BranchSelectWrapper = ({ value, onChange, error }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["branches-all"],
    queryFn: getUserBranch,
  });

  const branches = data?.data ?? [];

  const options = branches.map((b: any) => ({
    label: b.name,
    value: b.id,
  }));

  useEffect(() => {
  if (branches.length === 1) {
    onChange([branches[0].id]); // auto assign
  }
}, [branches]);


  if (branches.length <= 1) return null;

  return (
    <Dropdown
      label="Select Branch"
      options={options}
      value={value}
      onChange={onChange}
      loading={isLoading}
      error={error}
      multiple={true}
    />
  );
};

export default BranchSelectWrapper;
