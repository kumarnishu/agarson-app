import { apiClient } from "./utils/AxiosInterceptor";


export const GetArticles = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`articles/?limit=${limit}&page=${page}`)

}
export const FuzzySearchArticles = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/articles?key=${searchString}&limit=${limit}&page=${page}`)
}


export const GetStocks = async ({ limit, page }: { limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`stocks/?limit=${limit}&page=${page}`)
}

export const GetArticleStocks = async ({ limit, page, id }: { limit: number | undefined, id: string, page: number | undefined }) => {
    return await apiClient.get(`stocks/${id}/?limit=${limit}&page=${page}`)
}

export const CreateArticle = async (body: FormData) => {
    return await apiClient.post(`articles`, body);
};

export const UpdateArticle = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`articles/${id}`, body);
};

export const ActivateArticle = async (id: string) => {
    return await apiClient.patch(`articles/activate/${id}`);
};
export const DeActivateArticle = async (id: string) => {
    return await apiClient.patch(`articles/deactivate/${id}`);
};

export const CreateStock = async (body: FormData) => {
    return await apiClient.post(`stocks`, body);
};

export const UpdateStock = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`stocks/${id}`, body);
};

export const ActivateStock = async (id: string) => {
    return await apiClient.patch(`stocks/activate/${id}`);
};
export const DeActivateStock = async (id: string) => {
    return await apiClient.patch(`stocks/deactivate/${id}`);
};


export const BulkUpdateStock = async () => {
    return await apiClient.post("stock/upload/bulk")
}



