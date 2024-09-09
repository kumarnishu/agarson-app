import { CreateOrEditChecklistDto } from "../dtos/checklist/checklist.dto";
import { apiClient } from "./utils/AxiosInterceptor";


export const GetAllCheckCategories = async () => {
    return await apiClient.get(`checklists/categories`)
}


export const CreateOrEditCheckCategory = async ({ body, id }: {
    body: { key: string }
    id?: string
}) => {
    if (id) {
        return await apiClient.put(`checklists/categories/${id}`, body)
    }
    return await apiClient.post(`checklists/categories`, body)
}
export const DeleteChecklistCategory = async (id: string) => {
    return await apiClient.delete(`checklists/categories/${id}`)
}



export const CreateOrEditCheckList = async ({ body, id }: { body: CreateOrEditChecklistDto, id?: string }) => {
    if (id)
        return await apiClient.put(`checklists/${id}`, body);
    return await apiClient.post(`checklists`, body);
};



export const GetChecklists = async ({ category, limit, page, start_date, end_date, id }: {category:string,limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
    if (id)
        return await apiClient.get(`checklists/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}&category=${category}`)
    else
        return await apiClient.get(`checklists/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}&category=${category}`)
}




export const ToogleMyCheckLists = async ({ id }: { id: string}) => {
    return await apiClient.patch(`checklists/toogle/${id}`)
}


export const DeleteCheckList = async (id: string) => {
    return await apiClient.delete(`checklists/${id}`)
}



