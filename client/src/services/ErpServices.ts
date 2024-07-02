import { IState } from "../types/user.types";
import { apiClient } from "./utils/AxiosInterceptor";


export const GetStates = async () => {
    return await apiClient.get(`states`)
}

export const BulkCreateStateFromExcel = async (body: FormData) => {
    return await apiClient.put(`states`, body)
}
export const CreateOreditErpState = async ({ state, body }: { state?: IState, body: { state: string } }) => {
    if (state)
        return await apiClient.put(`states/${state._id}`, body);
    return await apiClient.post(`states`, body);

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
export const GetClientSaleReportsForlastyear = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`reports/client/sale/lastyear/?limit=${limit}&page=${page}`)
}

export const BulkClientSalereportFromExcelforlastyear = async (body: FormData) => {
    return await apiClient.put(`reports/client/sale/lastyear`, body)
}



export const AssignErpStatesToUsers = async ({ body }: {
    body: {
        user_ids: string[],
        state_ids: string[],
        flag: number
    }
}) => {
    return await apiClient.patch(`bulk/assign/states`, body)
}