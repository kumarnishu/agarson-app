import { apiClient } from "./utils/AxiosInterceptor";

export const CreateTemplate = async (body: FormData) => {
    return await apiClient.post(`watemplates`, body);
};

export const UpdateTemplate = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`watemplates/${id}`, body);
};

export const DeleteTemplate = async (id: string) => {
    return await apiClient.delete(`watemplates/${id}`);
};

export const GetTemplates = async ({ category, limit }: { limit?: number, category?: string }) => {
    return await apiClient.get(`watemplates/?category=${category}&limit=${limit}`)
}

export const UpdateCategories = async ({ body }: { body: { categories?: string[] } }) => {
    return await apiClient.post(`categories`, body)
}
export const GetCategories = async () => {
    return await apiClient.get(`categories`)
}


