import { apiClient } from "./utils/AxiosInterceptor";


export const CreateMachine = async (body: { name: string, display_name: string, serial_no: number, category: string }) => {
    return await apiClient.post(`machines`, body);
};


export const UpdateMachine = async ({ body, id }: { body: { name: string, serial_no: number, display_name: string ,category: string }, id: string }) => {
    return await apiClient.put(`machines/${id}`, body);
};

export const ToogleMachine = async (id: string) => {
    return await apiClient.patch(`machines/toogle/${id}`);
};

export const GetMachines = async (hidden?: string) => {
    if (hidden) {
        return await apiClient.get(`machines?hidden=${hidden}`);
    }
    return await apiClient.get(`machines`);
};

export const CreateDye = async (body: { dye_number: number, size: string }) => {
    return await apiClient.post(`dyes`, body);
};

export const UpdateDye = async ({ body, id }: { body: { dye_number: number, size: string }, id: string }) => {
    return await apiClient.put(`dyes/${id}`, body);
};

export const ToogleDye = async (id: string) => {
    return await apiClient.patch(`dyes/toogle/${id}`);
};

export const GetDyes = async (hidden?: string) => {
    if (hidden)
        return await apiClient.get(`dyes?hidden=${hidden}`);
    else
        return await apiClient.get(`dyes`);
};

export const CreateArticle = async (body: { name: string, display_name: string }) => {
    return await apiClient.post(`articles`, body);
};

export const UpdateArticle = async ({ body, id }: { body: { name: string, display_name: string}, id: string }) => {
    return await apiClient.put(`articles/${id}`, body);
};

export const ToogleArticle = async (id: string) => {
    return await apiClient.patch(`articles/toogle/${id}`);
};

export const GetArticles = async (hidden?: string) => {
    if (hidden)
        return await apiClient.get(`articles?hidden=${hidden}`);
    else
        return await apiClient.get(`articles`);
};


export const GetMyProductions = async ({ date, machine }: { date: string, machine?: string }) => {
    if (machine)
        return await apiClient.get(`productions/me/?date=${date}&machine=${machine}`);
    else
        return await apiClient.get(`productions/me/?date=${date}`);
}

export const CreateProduction = async (body: {
    machine: string,
    thekedar: string,
    articles: string[],
    manpower: number,
    production: number,
    big_repair: number,
    small_repair: number,
    production_hours: number,
    date: String
}) => {
    return await apiClient.post(`productions`, body);
}

export const UpdateProduction = async ({ id, body }: {
    body: {
        machine: string,
        thekedar: string,
        production_hours: number,
        articles: string[],
        manpower: number,
        production: number,
        big_repair: number,
        small_repair: number,
        date: String
    }, id: string

}) => {
    return await apiClient.put(`productions/${id}`, body);
}

export const DeleteProduction = async (id: string) => {
    return await apiClient.delete(`productions/${id}`);
}

export const GetProductions = async ({ limit, page, start_date, end_date, id }: { limit: number | undefined, page: number | undefined, start_date?: string, end_date?: string, id?: string }) => {
    if (id)
        return await apiClient.get(`productions/?id=${id}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)
    else
        return await apiClient.get(`productions/?start_date=${start_date}&end_date=${end_date}&limit=${limit}&page=${page}`)

}



export const BulkUploadMachines = async (body: FormData) => {
    return await apiClient.put(`machines/upload/bulk`, body);
}
export const BulkUploadDyes = async (body: FormData) => {
    return await apiClient.put(`dyes/upload/bulk`, body);
}
export const BulkUploadArticles = async (body: FormData) => {
    return await apiClient.put(`articles/upload/bulk`, body);
}

export const UpdateMachineCategories = async ({ body }: { body: { categories?: string[] } }) => {
    return await apiClient.put(`machine/categories`, body)
}
export const GetMachineCategories = async () => {
    return await apiClient.get(`machine/categories`)
}

export const FuzzySearchProductions = async ({ searchString, limit, page }: { searchString?: string, limit: number | undefined, page: number | undefined }) => {
    return await apiClient.get(`search/visits?key=${searchString}&limit=${limit}&page=${page}`)
}
