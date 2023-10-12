import { apiClient } from "./utils/AxiosInterceptor";

export const CreateAlps = async (body: FormData) => {
    return await apiClient.post(`alps`, body);
};

export const DeleteAlps = async (id: string) => {
    return await apiClient.delete(`alps/${id}`);
};

export const GetAlps = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`alps/?limit=${limit}&page=${page}`)
}

export const FuzzySearchAlps = async ({ searchString }: { searchString?: string }) => {
    return await apiClient.get(`search/alps?key=${searchString}`)
}
