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
    return await apiClient.patch(`start/message/reminders/${id}`, body);
};


export const StartReminder = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`start/reminders/${id}`, body);
};
export const ResetReminder = async (id: string) => {
    return await apiClient.patch(`reset/reminders/${id}`);
};
export const HideReminder = async (id: string) => {
    return await apiClient.patch(`hide/reminders/${id}`);
};
export const StopReminder = async (id: string) => {
    return await apiClient.patch(`stop/reminders/${id}`);
};
export const StopSingleReportReminder = async (id: string) => {
    return await apiClient.patch(`stop/single/reminders/${id}`);
};


export const GetReminders = async (hidden: string) => {
    return await apiClient.get(`reminders/?hidden=${hidden}`)
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
