export interface DepartmentFormValues {
  departments: string[]; 
  branchIds: number[];
}

export interface Department {
  id: number;
  dept_name: string;
  createdAt: string;
  branches: {
    id: number;
    name: string;
  }[];
}

