import { apiClient } from "./utils/AxiosInterceptor";


export const GetStates = async () => {
    return await apiClient.get(`states`)
}

export const BulkCreateStateFromExcel = async (body: FormData) => {
    return await apiClient.put(`states`, body)
}
export const CreateState = async (body: { state: string }) => {
    return await apiClient.post(`states`, body);
};


export const UpdateState = async ({ body, id }: { body: { state: string }, id: string }) => {
    return await apiClient.put(`states/${id}`, body);
};

export const GetPendingOrdersReports = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`reports/pending/orders/?limit=${limit}&page=${page}`)
}

export const BulkPendingOrderFromExcel = async (body: FormData) => {
    return await apiClient.put(`reports/pending/orders`, body)
}

export const GetBillsAgingReports = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`reports/bills/aging/?limit=${limit}&page=${page}`)
}

export const BulkBillsAgingreportFromExcel = async (body: FormData) => {
    return await apiClient.put(`reports/bills/aging`, body)
}

export const GetClientSaleReports = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`reports/client/sale/?limit=${limit}&page=${page}`)
}

export const BulkClientSalereportFromExcel = async (body: FormData) => {
    return await apiClient.put(`reports/client/sale`, body)
}


export const AssignStates = async ({ body }: { body: { states: string[], ids: string[] } }) => {
    return await apiClient.patch(`bulk/assign/states`, body)
}
