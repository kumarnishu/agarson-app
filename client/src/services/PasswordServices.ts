import { apiClient } from "./utils/AxiosInterceptor";


export const CreatePassword = async (body: { state: string, username: string, password: string, ids: string[] }) => {
    return await apiClient.post(`passwords`, body);
};
export const UpdatePassword = async ({ body, id }: { body: { state: string, username: string, password: string, ids: string[] }, id: string }) => {
    return await apiClient.put(`passwords/${id}`, body);
};

export const DeletePassword = async (id: string) => {
    return await apiClient.delete(`passwords/${id}`);
};

export const GetMyPasswords = async () => {
    return await apiClient.get(`passwords/me`);
};

export const GetPasswords = async ({ limit, page, id }: { limit: number | undefined, page: number | undefined, id?: string }) => {
    if (id)
        return await apiClient.get(`passwords/?id=${id}&limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`passwords/?limit=${limit}&page=${page}`)
}

export const FuzzySearchPasswords = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/passwords/?key=${searchString}&limit=${limit}&page=${page}`)
}

