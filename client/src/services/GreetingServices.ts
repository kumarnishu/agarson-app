import { apiClient } from "./utils/AxiosInterceptor";


export const CreateGreeting = async (body: {
    name: string, party: string, category: string, mobile: string, dob_time: string, anniversary_time: string
}) => {
    return await apiClient.post(`greetings`, body);
};

export const UpdateGreeting = async ({ id, body }: { id: string, body: { name: string, party: string, category: string, mobile: string, dob_time: string, anniversary_time: string } }) => {
    return await apiClient.put(`greetings/${id}`, body);
};

export const StartGreeting = async ({ id, body }: { id: string, body: { client_id: string } }) => {
    return await apiClient.patch(`greetings/${id}`, body);
};

export const DeleteGreeting = async (id: string) => {
    return await apiClient.delete(`greetings/${id}`);
};


export const GetGreetings = async () => {
    return await apiClient.get(`greetings`)
}
