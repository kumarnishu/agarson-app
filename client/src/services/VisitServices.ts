import { apiClient } from "./utils/AxiosInterceptor"

export const GetVisits = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
    if (id)
        return await apiClient.get(`visits/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`visits/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)

}
export const GetVisitAttendences = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
    if (id)
        return await apiClient.get(`attendence/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`attendence/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)

}


export const getMyTodayVisit = async () => {
    return await apiClient.get("visit/today")
}

export const StartMyDay = async (body: FormData) => {
    return await apiClient.post("day/start", body)
}

export const EndMyDay = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`day/end/${id}`, body)
}


export const MakeVisitIn = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.post(`visit/in/${id}`, body)
}
export const AddVisitSummary = async ({ id, body }: {
    id: string, body: {
        summary: string
        is_old_party: boolean
        dealer_of: string
        refs_given: string
        reviews_taken: number,
        turnover: string
    }
}) => {
    return await apiClient.patch(`visit/summary/${id}`, body)
}

export const EditVisitSummary = async ({ id, body }: {
    id: string, body: {
        summary: string
        is_old_party: boolean
        dealer_of: string
        refs_given: string
        reviews_taken: number,
        turnover: string
    }
}) => {
    return await apiClient.patch(`visit/summary/edit/${id}`, body)
}

export const AddAnkitInput = async ({ id, body }: { id: string, body: { input: string } }) => {
    return await apiClient.patch(`visit/ankit/input/${id}`, body)
}


export const ValidateVisit = async (id: string) => {
    return await apiClient.patch(`visit/validate/${id}`)
}
export const ToogleAttendence = async (id: string) => {
    return await apiClient.patch(`visit/toogle/${id}`)
}

export const MakeVisitOut = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`visit/out/${id}`, body)
}

export const UploadVisitSamplesPhoto = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`visit/samples/upload/${id}`, body)
}


export const FuzzySearchVisits = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/visits?key=${searchString}&limit=${limit}&page=${page}`)
}

export const GetAddress = async ({ lat, long }: { lat?: string, long?: string }) => {
    return await apiClient.get(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
}