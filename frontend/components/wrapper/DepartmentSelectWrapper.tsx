"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserBranch } from "@/service/API/orgnization.api";
import Dropdown from "../UI/Dropdown";
import { useEffect } from "react";
import { getDepartmentList } from "@/service/API/department.api";



type Props = {
  branchId:number | undefined
  value: number | null;
  onChange: (val: any) => void;
  error?: string;
};

const DepartmentSelectWrapper:React.FC<Props> = ({branchId, value, onChange, error , multiple= false }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["departments-by-branch", branchId],
    queryFn: () => getDepartmentList(branchId),
  });

  const departments = data?.data ?? [];

  const options = departments.map((b: any) => ({
    label: b.dept_name,
    value: b.id,
  }));


  return (
    <Dropdown
      label="Select Department"
      options={options}
      value={value}
      onChange={onChange}
      loading={isLoading}
      error={error}
      multiple={false}
    />
  );
};

export default DepartmentSelectWrapper;
