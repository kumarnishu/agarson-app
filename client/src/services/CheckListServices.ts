import { apiClient } from "./utils/AxiosInterceptor";

export const CreateCheckList = async ({ body, id }: { body: { title: string, sheet_url: string, upto_date: string, start_date: string }, id: string }) => {
    return await apiClient.post(`checklists/${id}`, body);
};

export const AddMoreCheckBoxes = async ({ body, id }: { body: { upto_date: string }, id: string }) => {
    return await apiClient.patch(`checklists/${id}`, body);
};
export const EditCheckList = async ({ body, id }: { body: { title: string, sheet_url: string, user_id: string, serial_no: number }, id: string }) => {
    return await apiClient.put(`checklists/${id}`, body);
};


export const GetCheckLists = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
    if (id)
        return await apiClient.get(`checklists/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`checklists/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
}

export const GetMyCheckLists = async ({ start_date, end_date }: { start_date?: string, end_date?: string }) => {
    if (start_date && end_date)
        return await apiClient.get(`checklists/self/?start_date=${start_date}&end_date=${end_date}`)
    else
        return await apiClient.get(`checklists/self`)
}

export const ToogleMyCheckLists = async ({ id, date }: { id: string, date: string }) => {
    return await apiClient.patch(`checklists/self/${id}/?date=${date}`)
}


export const DeleteCheckList = async (id: string) => {
    return await apiClient.delete(`checklists/${id}`)
}

export const FuzzySearchCheckLists = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/checklists?key=${searchString}&limit=${limit}&page=${page}`)
}

