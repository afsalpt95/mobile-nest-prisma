import { apiFetch } from "../api";



export const createDepartment = async (data: any) => {
    return apiFetch.post("/department", data);
};


export const getDepartments = async ({
    page,
    limit,
    search,
    branchId,
}: {
    page: number;
    limit: number;
    search: string;
    branchId?: number;
}): Promise<any> => {
    return apiFetch.get("/department", {
        params: { page, limit, search ,branchId},
    });
};


export const updateDepartment = async (id: number, data: any) => {
    return apiFetch.put(`/department/${id}`, data);
};


export const deleteDepartment = async (id: number) => {
    return apiFetch.delete(`/department/${id}`);
};


