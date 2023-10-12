import { apiClient } from "./utils/AxiosInterceptor";


export const CreateBroadCast = async (body: FormData) => {
    return await apiClient.post(`broadcasts`, body);
};
export const CreateBroadCastWithMessage = async (body: FormData) => {
    return await apiClient.post(`new/message/broadcasts`, body);
};

export const UpdateBroadCastWithMessage = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`update/message/broadcasts/${id}`, body);
};

export const UpdateBroadCast = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`broadcasts/${id}`, body);
};

export const StartMessageBroadCast = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`start/message/broadcasts/${id}`, body);
};

export const DeleteBroadCast = async (id: string) => {
    return await apiClient.delete(`broadcasts/${id}`);
};
export const StartBroadCast = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`start/broadcasts/${id}`, body);
};
export const ResetBroadcast = async (id: string) => {
    return await apiClient.post(`reset/broadcasts/${id}`);
};
export const SetBroadcastDailyCount = async ({ id, body }: { id: string, body: { count: number } }) => {
    return await apiClient.post(`set/count/broadcasts/${id}`, body);
};
export const StopBroadCast = async (id: string) => {
    return await apiClient.post(`stop/broadcasts/${id}`);
};
export const StopSingleReportBroadCast = async (id: string) => {
    return await apiClient.post(`stop/single/broadcasts/${id}`);
};


export const GetBroadCasts = async () => {
    return await apiClient.get(`broadcasts`)
}
export const GetBroadcastReports = async (id: string) => {
    return await apiClient.get(`reports/broadcasts/${id}`);
};

export const GetBroadcastPaginatedReports = async ({ id, limit, page }: { id?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`pagination/broadcasts/?id=${id}&limit=${limit}&page=${page}`);

}

export const GetBroadcastReportsByMobile = async ({ id, mobile }: { id?: string, mobile: string | undefined }) => {
    return await apiClient.get(`filter/broadcasts/?id=${id}&mobile=${mobile}`);
};
