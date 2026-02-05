import { apiFetch } from "../api";
import { OrganizationResponse } from "@/types/organization.types";

export const getOrganizations = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<OrganizationResponse> => {
   return apiFetch.get("/branch", {
    params: { page, limit, search },
  });
};

export const createOrganization = async (data: any) => {
   return apiFetch.post("/branch", data);
};


export const updateOrganization = async (id:number, data:any)=>{
   return apiFetch.put(`/branch/${id}`, data);
}