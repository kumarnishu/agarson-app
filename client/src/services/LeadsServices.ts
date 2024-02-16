import { apiClient } from "./utils/AxiosInterceptor"


export const GetLeads = async ({ limit, page, userId }: { limit: number | undefined, userId?: string, page: number | undefined }) => {
  if (userId)
    return await apiClient.get(`leads/?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`leads/?limit=${limit}&page=${page}`)
}

export const GetReminderRemarks = async () => {
  return await apiClient.get(`reminder/remarks`)
}

export const GetRefers = async () => {
  return await apiClient.get("refers")
}

export const GetUselessLeads = async ({ limit, page, userId }: { limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`useless/leads/?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`useless/leads/?limit=${limit}&page=${page}`)

}
export const FuzzySearchUselessLeads = async ({ searchString, limit, page, userId }: { searchString?: string, limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`search/leads/useless?key=${searchString}&limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`search/leads/useless?key=${searchString}&limit=${limit}&page=${page}`)
}


export const GetPaginatedRefers = async ({ limit, page, userId }: { limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`refers/paginated?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`refers/paginated?limit=${limit}&page=${page}`)

}

export const NewReferParty = async (body: {
  name: string, customer_name?: string, city: string, state: string, mobile: string, lead_owners: string,
}) => {
  return await apiClient.post("refers", body)
}

export const UpdateReferParty = async ({ id, body }: {
  id: string,
  body: {
    name: string, customer_name?: string, city: string, state: string, mobile: string, lead_owners: string,
  }
}) => {
  return await apiClient.put(`refers/${id}`, body)
}

export const DeleteReferParty = async ({ id }: { id: string }) => {
  return await apiClient.delete(`refers/${id}`)
}

export const ReferLead = async ({ id, body }: {
  id: string, body: {
    party_id: string,
    remark: string
  }
}) => {
  return await apiClient.post(`refers/leads/${id}`, body)
}
export const RemoveLeadReferrals = async ({ id, body }: { id: string, body: { remark: string } }) => {
  return await apiClient.patch(`refers/leads/${id}`, body)
}


export const GetRemarks = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
  if (id)
    return await apiClient.get(`remarks/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
  else
    return await apiClient.get(`remarks/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
}

export const FuzzySearchLeads = async ({ searchString, limit, page, userId }: { searchString?: string, limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`search/leads?key=${searchString}&limit=${limit}&page=${page}`)
}
export const FuzzySearchRefers = async ({ searchString, limit, page, userId }: { searchString?: string, limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`search/refers?key=${searchString}&limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`search/refers?key=${searchString}&limit=${limit}&page=${page}`)

}

export const FuzzySearchCustomers = async ({ searchString, limit, page, userId }: { searchString?: string, limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`search/customers?key=${searchString}&limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`search/customers?key=${searchString}&limit=${limit}&page=${page}`)

}

export const GetCustomers = async ({ limit, page, userId }: { limit: number | undefined, page: number | undefined, userId?: string }) => {
  if (userId)
    return await apiClient.get(`customers?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`customers?limit=${limit}&page=${page}`)
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
export const ConvertCustomer = async ({ id, body }: { id: string, body: { remark: string } }) => {
  return await apiClient.patch(`leads/${id}`, body)
}
export const ToogleUseless = async ({ id, body }: { id: string, body: { remark: string } }) => {
  return await apiClient.patch(`toogle/useless/${id}`, body)
}
export const BulkLeadUpdateFromExcel = async (body: FormData) => {
  return await apiClient.put(`update/leads/bulk`, body)
}
export const BulkDeleteUselessLeads = async (body: { leads_ids: string[] }) => {
  return await apiClient.post(`bulk/leads/delete`, body)
}
export const NewRemark = async ({ id, body }: {
  id: string, body: {
    remark: string,
    lead_owners: string[],
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
export const AssignRefer = async ({ id, body }: {
  id: string, body: {
    lead_owners: string[]
  }
}) => {
  return await apiClient.patch(`assign/refer/${id}`, body)
}

export const BulkAssignRefers = async ({ body }: {
  body: {
    lead_owners: string[],
    refers: string[],
  }
}) => {
  return await apiClient.put(`bulk/assign/refers`, body)
}
export const BulkAssignLeads = async ({ body }: {
  body: {
    lead_owners: string[],
    leads: string[]
  }
}) => {
  return await apiClient.put(`bulk/assign/leads`, body)
}

export const UpdateLeadFieldsUpdatable = async ({ body }: {
  body?: {
    stages: string[],
    lead_types: string[],
    lead_sources: string[],
  }
}) => {
  return await apiClient.put(`fields/lead/update`, body)
}
export const GetLeadFieldsUpdatable = async () => {
  return await apiClient.get(`lead-updatable-fields`)
}


export const GetMyVisitingCards = async () => {
  return await apiClient.patch(`cards/me`)
}

export const GetVisitingCards = async ({ limit, page, userId }: { limit: number | undefined, userId?: string, page: number | undefined }) => {
  if (userId)
    return await apiClient.get(`cards/?limit=${limit}&page=${page}&id=${userId}`)
  else
    return await apiClient.get(`cards/?limit=${limit}&page=${page}`)
}

export const CreateVisitingCard = async (body: FormData) => {
  return await apiClient.post(`cards`, body)
}

export const UpdateVisitingCard = async ({ body, id }: { id: string, body: FormData }) => {
  return await apiClient.put(`cards/${id}`, body)
}

export const ReferVisitingCard = async ({ body, id }: { id: string, body: { refer: string, comment: string } }) => {
  return await apiClient.patch(`cards/refer/${id}`, body)
}

export const ToogleStatusVisitingCard = async ({ body, id }: { id: string, body: {  comment: string } }) => {
  return await apiClient.patch(`cards/status/toogle/${id}`, body)
}

export const AddCommentsToVisitingCard = async ({ body, id }: { id: string, body: { comment: string } }) => {
  return await apiClient.patch(`cards/comment/${id}`, body)
}