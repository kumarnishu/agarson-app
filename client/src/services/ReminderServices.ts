import { apiClient } from "./utils/AxiosInterceptor";


export const CreateReminder = async (body: FormData) => {
    return await apiClient.post(`reminders`, body);
};
export const CreateReminderWithMessage = async (body: FormData) => {
    return await apiClient.post(`new/message/reminders`, body);
};

export const UpdateReminderWithMessage = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`update/message/reminders/${id}`, body);
};

export const UpdateReminder = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`reminders/${id}`, body);
};

export const StartMessageReminder = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`start/message/reminders/${id}`, body);
};


export const StartReminder = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`start/reminders/${id}`, body);
};
export const ResetReminder = async (id: string) => {
    return await apiClient.post(`reset/reminders/${id}`);
};
export const StopReminder = async (id: string) => {
    return await apiClient.post(`stop/reminders/${id}`);
};
export const StopSingleReportReminder = async (id: string) => {
    return await apiClient.post(`stop/single/reminders/${id}`);
};


export const GetReminders = async () => {
    return await apiClient.get(`reminders`)
}
export const GetReminderReports = async (id: string) => {
    return await apiClient.get(`reports/reminders/${id}`);
};

export const GetReminderPaginatedReports = async ({ id, limit, page }: { id?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`pagination/reminders/?id=${id}&limit=${limit}&page=${page}`);

}

export const GetReminderReportsByMobile = async ({ id, mobile }: { id?: string, mobile: string | undefined }) => {
    return await apiClient.get(`filter/reminders/?id=${id}&mobile=${mobile}`);
};
