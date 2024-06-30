import { apiClient } from "./utils/AxiosInterceptor"


export const GetLeads = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`leads/?limit=${limit}&page=${page}`)
}

export const FuzzySearchLeads = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}`)
}


export const CreateOrUpdateLead = async ({ id, body }: { body: FormData, id?: string}) => {
  if(id){
    return await apiClient.put(`leads/${id}`, body)
  }
  return await apiClient.post("leads", body)
}


export const DeleteLead = async ({ id }: { id: string }) => {
  return await apiClient.delete(`leads/${id}`)
}


export const BulkLeadUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`update/leads/bulk`, body)
}


export const CreateOrEditRemark = async ({ body, lead_id, remark_id }: {
  body: {
    remark: string,
    remind_date?: string
  },
  lead_id?: string,
  remark_id?: string
  
}) => {
  if(lead_id){
    return await apiClient.patch(`remarks/leads/${lead_id}`, body)
  }
    return await apiClient.put(`remarks/${remark_id}`, body)
}


export const DeleteRemark = async (id: string) => {
  return await apiClient.delete(`remarks/${id}`)
}
