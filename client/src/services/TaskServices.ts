import { apiClient } from "./utils/AxiosInterceptor";

export const CreateTask = async ({ body, id }: { body: { task_description: string, frequency_type: string, frequency_value?: number, upto_date: string }, id: string }) => {
    return await apiClient.post(`tasks/${id}`, body);
};

export const AddMoreBoxes = async ({ body, id }: { body: { upto_date: string }, id: string }) => {
    return await apiClient.put(`tasks/${id}`, body);
};

export const GetTasks = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {

    if (id && !start_date && !end_date)
        return await apiClient.get(`tasks/?id=${id}&limit=${limit}&page=${page}`)
    if (id && start_date && end_date)
        return await apiClient.get(`tasks/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    if (!id && start_date && end_date)
        return await apiClient.get(`tasks/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    if (!id && !start_date && !end_date)
        return await apiClient.get(`tasks?limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`tasks?limit=${limit}&page=${page}`)
}



export const DeleteTask = async (id: string) => {
    return await apiClient.delete(`tasks/${id}`)
}

export const FuzzySearchTasks = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/tasks?key=${searchString}&limit=${limit}&page=${page}`)
}

