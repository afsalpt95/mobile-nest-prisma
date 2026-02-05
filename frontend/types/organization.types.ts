
export interface Organization {
  id: number;
  name: string;
  email: string;
  address:string;
  contact: string;
  city: string;
  state: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}


export interface OrganizationResponse {
  success: boolean;
  statusCode: number;

  data: Organization[];

  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}


export type FormValues = {
  name: string;
  email: string;
  address: string;
  contact: string;
  city: string;
  state: string;
 logo?: string | null;
}