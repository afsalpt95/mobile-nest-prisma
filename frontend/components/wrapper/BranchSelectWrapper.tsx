"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserBranch } from "@/service/API/orgnization.api";
import Dropdown from "../UI/Dropdown";
import { useEffect } from "react";



type Props = {
  value: number | number[] | null;
  onChange: (val: any) => void;
  error?: string;
  multiple?: boolean; // 
};

const BranchSelectWrapper:React.FC<Props> = ({ value, onChange, error , multiple= false }: any) => {
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
  // only auto select for MULTI select (form usage)
  if (!multiple) return;

  if (branches.length === 1) {
    onChange([branches[0].id]);
  }
}, [branches, multiple]);


 if (multiple && branches.length <= 1) return null

  return (
    <Dropdown
      label="Select Branch"
      options={options}
      value={value}
      onChange={onChange}
      loading={isLoading}
      error={error}
      multiple={multiple}
    />
  );
};

export default BranchSelectWrapper;
