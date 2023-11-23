import { apiClient } from "./utils/AxiosInterceptor"


export const GetVisits = async () => {
    return await apiClient.get(`visits`)

}

export const GetMyVisits = async () => {
    return await apiClient.get(`visits/me`)

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
export const MakeVisitOut = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.patch(`visit/out/${id}`, body)
}
