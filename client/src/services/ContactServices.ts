import { apiClient } from "./utils/AxiosInterceptor";


export const CreateContact = async (body: { name: string, designation: string, mobile: string }) => {
    return await apiClient.post(`contacts`, body);
};
export const UpdateContact = async ({ body, id }: { body: { name: string, designation: string, mobile: string }, id: string }) => {
    return await apiClient.put(`contacts/${id}`, body);
};

export const DeleteContact = async (id: string) => {
    return await apiClient.delete(`contacts/${id}`);
};

export const GetContacts = async () => {
    return await apiClient.get(`contacts`);
};

export const BulkContactUpdateFromExcel = async (body: FormData) => {
    return await apiClient.put(`bulk/new/contacts`, body)
}