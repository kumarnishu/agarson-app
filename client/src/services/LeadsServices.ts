import { apiClient } from "./utils/AxiosInterceptor"


export const GetLeads = async ({ limit, page, userId }: { limit: number | undefined, userId?: string, page: number | undefined }) => {
  if (userId)
    return await apiClient.get(`leads/?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`leads/?limit=${limit}&page=${page}`)
}

export const FuzzySearchLeads = async ({ searchString, limit, page, userId }: { searchString?: string, limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}`)
}


export const NewLead = async (body: FormData) => {
  return await apiClient.post("leads", body)
}
export const UpdateLead = async ({ id, body }: { id: string, body: FormData }) => {
  return await apiClient.put(`leads/${id}`, body)
}
export const DeleteLead = async ({ id }: { id: string }) => {
  return await apiClient.delete(`leads/${id}`)
}


export const BulkLeadUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`update/leads/bulk`, body)
}


export const NewRemark = async ({ id, body }: {
  id: string, body: {
    remark: string,
    remind_date?: string
  }
}) => {
  return await apiClient.patch(`remarks/leads/${id}`, body)
}
export const UpdateRemark = async ({ id, body }: {
  id: string, body: {
    remark: string,
    remind_date?: string
  }
}) => {
  return await apiClient.put(`remarks/${id}`, body)
}

export const DeleteRemark = async (id: string) => {
  return await apiClient.delete(`remarks/${id}`)
}
