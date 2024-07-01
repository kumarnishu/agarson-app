import { apiClient } from "./utils/AxiosInterceptor"

//leads
export const GetLeads = async ({ limit, page, stage }: { limit: number | undefined, page: number | undefined, stage?: string}) => {
  return await apiClient.get(`leads/?limit=${limit}&page=${page}&stage=${stage}`)
}

export const FuzzySearchLeads = async ({ searchString, limit, page, stage, stageFilter }: { searchString?: string, limit: number | undefined, page: number | undefined, stage?: string, stageFilter: boolean }) => {
  return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}&stage=${stage}&stageFilter=${stageFilter}`)
}


export const CreateOrUpdateLead = async ({ id, body }: { body: FormData, id?: string }) => {
  if (id) {
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

//remarks
export const CreateOrEditRemark = async ({ body, lead_id, remark_id }: {
  body: {
    remark: string,
    remind_date?: string
  },
  lead_id?: string,
  remark_id?: string

}) => {
  if (lead_id) {
    return await apiClient.patch(`remarks/leads/${lead_id}`, body)
  }
  return await apiClient.put(`remarks/${remark_id}`, body)
}


export const DeleteRemark = async (id: string) => {
  return await apiClient.delete(`remarks/${id}`)
}


//refers
export const GetPaginatedRefers = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
  return await apiClient.get(`refers/paginated/?limit=${limit}&page=${page}`)
}
export const GetRefers = async () => {
  return await apiClient.get(`refers`)
}

export const FuzzySearchRefers = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
  return await apiClient.get(`search/refers?key=${searchString}&limit=${limit}&page=${page}`)
}


export const CreateOrUpdateRefer = async ({ id, body }: { body: FormData, id?: string }) => {
  if (id) {
    return await apiClient.put(`refers/${id}`, body)
  }
  return await apiClient.post("refers", body)
}


export const DeleteRefer = async ({ id }: { id: string }) => {
  return await apiClient.delete(`refers/${id}`)
}


export const BulkReferUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`update/refers/bulk`, body)
}

//states

export const GetAllStates = async () => {
  return await apiClient.get(`crm/states`)
}


export const CreateOrEditState = async ({ body, id }: {
  body: { state: string }
  id?: string
}) => {
  if (id) {
    return await apiClient.put(`crm/states/${id}`, body)
  }
  return await apiClient.post(`crm/states`, body)
}


export const DeleteCrmState = async (id: string) => {
  return await apiClient.delete(`crm/states/${id}`)
}

export const BulkStateUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`crm/states/excel/createorupdate`, body)
}

//cities
export const GetAllCities = async () => {
  return await apiClient.get(`crm/cities`)
}


export const CreateOrEditCity = async ({ body, id }: {
  body: { state: string, city: string }
  id?: string

}) => {
  if (id) {
    return await apiClient.put(`crm/cities/${id}`, body)
  }
  return await apiClient.post(`crm/cities`, body)
}


export const DeleteCity = async (id: string) => {
  return await apiClient.delete(`crm/cities/${id}`)
}

export const BulkCityUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`crm/cities/excel/createorupdate`, body)
}


//stages
export const GetAllStages = async () => {
  return await apiClient.get(`crm/stages`)
}


export const CreateOrEditStage = async ({ body, id }: {
  body: { stage: string }
  id?: string
}) => {
  if (id) {
    return await apiClient.put(`crm/stages/${id}`, body)
  }
  return await apiClient.post(`crm/stages`, body)
}


export const DeleteStage = async (id: string) => {
  return await apiClient.delete(`crm/stages/${id}`)
}

//sources
export const GetAllSources = async () => {
  return await apiClient.get(`crm/sources`)
}


export const CreateOrEditSource = async ({ body, id }: {
  body: { source: string }
  id?: string
}) => {
  if (id) {
    return await apiClient.put(`crm/sources/${id}`, body)
  }
  return await apiClient.post(`crm/sources`, body)
}


export const DeleteSource = async (id: string) => {
  return await apiClient.delete(`crm/sources/${id}`)
}

//types
export const GetAllLeadTypes = async () => {
  return await apiClient.get(`crm/leadtypes`)
}


export const CreateOrEditLeadType = async ({ body, id }: {
  body: { type: string }
  id?: string
}) => {
  if (id) {
    return await apiClient.put(`crm/leadtypes/${id}`, body)
  }
  return await apiClient.post(`crm/leadtypes`, body)
}


export const DeleteLeadType = async (id: string) => {
  return await apiClient.delete(`crm/leadtypes/${id}`)
}

export const ReferLead = async ({ id, body }: { id: string, body: { party_id: string, remark: string } }) => {
  return await apiClient.post(`refers/leads/${id}`, body)
}
export const RemoveReferLead = async ({ id, body }: { id: string, body: { remark: string } }) => {
  return await apiClient.patch(`refers/leads/${id}`, body)
}

export const AssignCRMStatesToUsers = async ({ body }: {
  body: {
    user_ids: string[],
    state_ids: string[],
    flag: number
  }
}) => {
  return await apiClient.patch(`crm/states/assign`, body)
}