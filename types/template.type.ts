export type IErpStateTemplate = {
    _id?: string,
    state: string,
    apr: string,
    may: string,
    jun: string,
    jul: string,
    aug: string,
    sep: string,
    oct: string,
    nov: string,
    dec: string,
    jan: string,
    feb: string,
    mar: string,
    status?: any
}



export type ISaleAnalysisReportTemplate = {
    state: string,
    monthly_target: number,
    monthly_achivement: number,
    monthly_percentage: number,
    annual_target: number,
    annual_achivement: number,
    annual_percentage: number,
    last_year_sale: number,
    last_year_sale_percentage_comparison: number
}
export type IPartyTargetReportTemplate = {
    slno: string,
    PARTY: string,
    Create_Date: string,
    STATION: string,
    SALES_OWNER: string,
    report_owner: string
    All_TARGET: string,
    TARGET: number,
    PROJECTION: number,
    GROWTH: number,
    TARGET_ACHIEVE: number,
    TOTAL_SALE_OLD: number,
    TOTAL_SALE_NEW: number,
    Last_Apr: number,
    Cur_Apr: number,
    Last_May: number,
    Cur_May: number,
    Last_Jun: number,
    Cur_Jun: number,
    Last_Jul: number,
    Cur_Jul: number,
    Last_Aug: number,
    Cur_Aug: number,
    Last_Sep: number,
    Cur_Sep: number,
    Last_Oct: number,
    Cur_Oct: number,
    Last_Nov: number,
    Cur_Nov: number,
    Last_Dec: number,
    Cur_Dec: number,
    Last_Jan: number,
    Cur_Jan: number,
    Last_Feb: number,
    Cur_Feb: number,
    Last_Mar: number,
    Cur_Mar: number,
    status?: string
}

export type ITemplateCategoryField = {
    _id: string,
    categories: string[]
}

