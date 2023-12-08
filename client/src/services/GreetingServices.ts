import { apiClient } from "./utils/AxiosInterceptor";


export const CreateGreeting = async (body: {
    name: string, party: string, category: string, mobile: string, dob_time: string, anniversary_time: string
}) => {
    return await apiClient.post(`greetings`, body);
};

export const UpdateGreeting = async ({ id, body }: { id: string, body: { name: string, party: string, category: string, mobile: string, dob_time: string, anniversary_time: string } }) => {
    return await apiClient.put(`greetings/${id}`, body);
};

export const StartAllGreetings = async ({  body }: {  body: { client_id: string } }) => {
    return await apiClient.patch(`greetings/start/bulk`, body);
};

export const StopAllGreetings = async () => {
    return await apiClient.patch(`greetings/stop/bulk`);
};

export const DeleteGreeting = async (id: string) => {
    return await apiClient.delete(`greetings/${id}`);
};
export const StartGreeting = async (id: string) => {
    return await apiClient.patch(`greetings/start${id}`);
};
export const StopGreeting = async (id: string) => {
    return await apiClient.patch(`greetings/stop/${id}`);
};

export const GetGreetings = async () => {
    return await apiClient.get(`greetings`)
}
