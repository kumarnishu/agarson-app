import { IFlow } from "../types/bot.types";
import { apiClient } from "./utils/AxiosInterceptor";



export const CreateFlow = async (body: IFlow) => {
    return await apiClient.post(`flows`, body);
};

export const UpdateFlow = async ({ id, body }: { id: string, body: IFlow }) => {
    return await apiClient.put(`flows/${id}`, body);
};
export const GetFlows = async () => {
    return await apiClient.get(`flows`);
};
export const GetChats = async ({ id, limit }: { id?: string, limit?: number }) => {
    return await apiClient.get(`chats?id=${id}&limit=${limit}`);
};
export const GetConnectedUsers = async () => {
    return await apiClient.get(`connected/users`);
};

export const AssignFlow = async ({ id, body }: { id: string, body: { user_ids: string[] } }) => {
    return await apiClient.patch(`flows/asign/${id}`, body);
};
export const ToogleFlowStatus = async (id: string) => {
    return await apiClient.patch(`flows/toogle/${id}`);
};
export const ResetTrackers = async () => {
    return await apiClient.post(`trackers`);
};

export const DestroyFlow = async (id: string) => {
    return await apiClient.delete(`flows/${id}`);
};


export const GetTrackers = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`trackers?limit=${limit}&page=${page}`)
}

export const FuzzySearchTrackers = async (searchString?: string) => {
    return await apiClient.get(`search/trackers?key=${searchString}`)
}

export const UpdateCustomerName = async ({ id, body }: { id: string, body: { customer_name: string } }) => {
    return await apiClient.put(`trackers/${id}`, body)
}
export const ToogleBotStatus = async ({ body }: { body: { phone_number: string, bot_number: string } }) => {
    return await apiClient.post(`toogle`, body);
}

export const DeleteTracker = async ({ body }: { body: { phone_number: string, bot_number: string } }) => {
    return await apiClient.post(`trackers/delete`, body);
}