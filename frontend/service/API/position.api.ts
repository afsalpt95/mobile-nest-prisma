import { apiFetch } from "../api";




export const createPosition = async (data: any) => {
    return apiFetch.post("/position", data);
};

export const getPositions = async ({
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
    return apiFetch.get("/position", {
        params: { page, limit, search ,branchId},
    });
};


export const updatePosition = async (id: number, data: any) => {
    return apiFetch.put(`/position/${id}`, data);
};  


export const deletePosition = async (id: number) => {
    return apiFetch.delete(`/position/${id}`);
};