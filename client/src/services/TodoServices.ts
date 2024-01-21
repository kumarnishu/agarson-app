import { apiClient } from "./utils/AxiosInterceptor";

export const GetTodos = async ({ hidden, mobile, visible }: { hidden: boolean, visible: boolean, mobile?: string }) => {
    if (mobile)
        return await apiClient.get(`todos/?hidden=${hidden}&mobile=${mobile}&visible=${visible}`)
    else
        return await apiClient.get(`todos/?hidden=${hidden}&visible=${visible}`)

}
export const GetMyTodos = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`todos/me/?hidden=${hidden}`)
}
export const CreateTodo = async (body: {
    serial_no: number,
    title: string,
    subtitle: string,
    category: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        status: string
    }[],
    run_once: boolean,
    frequency_type: string,
    frequency_value: string,
    start_date: string,
    connected_user: string
}) => {
    return await apiClient.post(`todos`, body);
};

export const UpdateTodo = async ({ id, body }: {
    id: string, body: {
        serial_no: number,
        title: string,
        subtitle: string,
        category: string,
        contacts: {
            mobile: string,
            name: string,
            is_sent: boolean,
            status: string
        }[],
        run_once: boolean,
        frequency_type: string,
        frequency_value: string,
        start_date: string,
        connected_user: string
    }
}) => {
    return await apiClient.put(`todos/${id}`, body);
};

export const StopTodo = async (id: string) => {
    return await apiClient.patch(`todos/stop/${id}`);
};
export const StopAllTodos = async ({ ids }: { ids: string[] }) => {
    return await apiClient.patch(`todos/bulk/stop`, { ids: ids });
};
export const StartTodo = async (id: string) => {
    return await apiClient.patch(`todos/start/${id}`);
};
export const StartAllTodos = async ({ ids }: { ids: string[] }) => {
    return await apiClient.patch(`todos/bulk/start`, { ids: ids });
};
export const DeleteTodo = async (id: string) => {
    return await apiClient.delete(`todos/${id}`);
};


export const ToogleHideTodo = async (id: string) => {
    return await apiClient.patch(`todos/hide/${id}`);
};


export const UpdateTodoStatus = async ({ id, body }: { id: string, body: { status: string, reply: string } }) => {
    return await apiClient.patch(`todos/status/${id}`, body);
};

export const BulkTodoUpdateFromExcel = async (body: FormData) => {
    return await apiClient.put(`todos/bulk/new`, body)
}


