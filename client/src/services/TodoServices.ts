import { apiClient } from "./utils/AxiosInterceptor";

export const GetTodos = async ({ hidden, mobile }: { hidden: boolean, mobile?: string }) => {
    if (mobile)
        return await apiClient.get(`todos/?hidden=${hidden}&mobile=${mobile}`)
    else
        return await apiClient.get(`todos/?hidden=${hidden}`)
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
        is_completed: false
    }[],
    run_once: boolean,
    frequency_type: string,
    frequency_value: string,
    start_date: string,
    connected_user: string
}) => {
    return await apiClient.post(`todos`, body);
};

export const UpdateTodo = async ({ id, body }: { id: string, body: {
    serial_no: number,
    title: string,
    subtitle: string,
    category: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        is_completed: false
    }[],
    run_once: boolean,
    frequency_type: string,
    frequency_value: string,
    start_date: string,
    connected_user: string
} }) => {
    return await apiClient.put(`todos/${id}`, body);
};

export const StopTodo = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`todos/stop/${id}`, body);
};

export const StartTodo = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`todos/start/${id}`, body);
};

export const ToogleHideTodo = async (id: string) => {
    return await apiClient.patch(`hide/todos/${id}`);
};









