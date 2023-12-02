import { apiClient } from "./utils/AxiosInterceptor";


export const CreateTodo = async ({ id, body }: { id: string, body: { work_title: string, work_description: string, category: string } }) => {
    return await apiClient.post(`todos/${id}`, body);
};
export const UpdateTodo = async ({ body, id }: { body: { work_title: string, category: string, work_description: string, user_id: string, status: string }, id: string }) => {
    return await apiClient.put(`todos/${id}`, body);
};

export const DeleteTodo = async (id: string) => {
    return await apiClient.delete(`todos/${id}`);
};
export const HideTodo = async (id: string) => {
    return await apiClient.patch(`todos/${id}`);
};
export const BulkHideTodos = async ({ body }: { body: { ids: string[] } }) => {
    return await apiClient.patch(`todos/bulk/hide`, body);
};

export const UpdateTodoStatus = async ({ id, body }: { id: string, body: { status: string, reply: string } }) => {
    return await apiClient.patch(`todos/status/${id}`, body);
};

export const GetMyTodos = async () => {
    return await apiClient.get(`todos/me`);
};


export const GetTodos = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {

    if (id && !start_date && !end_date)
        return await apiClient.get(`todos/?id=${id}&limit=${limit}&page=${page}`)
    if (id && start_date && end_date)
        return await apiClient.get(`todos/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    if (!id && start_date && end_date)
        return await apiClient.get(`todos/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    if (!id && !start_date && !end_date)
        return await apiClient.get(`todos?limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`todos?limit=${limit}&page=${page}`)
}

export const FuzzySearchTodos = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/todos/?key=${searchString}&limit=${limit}&page=${page}`)
}

