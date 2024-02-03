import { apiClient } from "./utils/AxiosInterceptor";

export const GetTodos = async ({ type, mobile, stopped }: { type: string, stopped: boolean, mobile?: string }) => {
    if (mobile)
        return await apiClient.get(`todos/?type=${type}&mobile=${mobile}&stopped=${stopped}`)
    else
        return await apiClient.get(`todos/?type=${type}&stopped=${stopped}`)

}
export const GetMyTodos = async () => {
    return await apiClient.get(`todos/me`)
}



export const StopAllTodos = async ({ ids }: { ids: string[] }) => {
    return await apiClient.patch(`todos/bulk/stop`, { ids: ids });
};

export const StartAllTodos = async ({ ids }: { ids: string[] }) => {
    return await apiClient.patch(`todos/bulk/start`, { ids: ids });
};


export const DeleteTodos = async ({ ids }: { ids: string[] }) => {
    return await apiClient.patch(`todos/bulk/delete`, { ids: ids });
};


export const UpdateTodoStatus = async ({ id, body }: { id: string, body: { status: string, reply: string } }) => {
    return await apiClient.patch(`todos/status/${id}`, body);
};

export const BulkTodoUpdateFromExcel = async (body: FormData) => {
    return await apiClient.put(`todos/bulk/new`, body)
}


