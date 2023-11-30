import { apiClient } from "./utils/AxiosInterceptor";


export const CreateTodo = async (body: { work_title: string, work_description: string }) => {
    return await apiClient.post(`todos`, body);
};
export const UpdateTodo = async ({ body, id }: { body: { name: string, mobile: string }, id: string }) => {
    return await apiClient.put(`todos/${id}`, body);
};

export const DeleteTodo = async (id: string) => {
    return await apiClient.delete(`todos/${id}`);
};

export const GetMyTodos = async () => {
    return await apiClient.get(`todos/me`);
};

