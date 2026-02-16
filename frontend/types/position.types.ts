

export interface Position {
  id: number;
  pos_name: string;
  createdAt: string;
  branch?: {
    id: number;
    name: string;
  };

  department?: {
    id: number;
    dept_name: string;
  };
}


export interface PositionFormValues {
  positions: string[]; 
  branchId?: number;
  departmentId: number
}