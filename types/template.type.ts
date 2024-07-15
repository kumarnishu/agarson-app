export type ILeadTemplate = {
    _id: string,
    name: string,
    customer_name: string,
    customer_designation: string,
    gst: string,
    mobile: string,
    email: string,
    city: string,
    state: string,
    country: string,
    address: string,
    work_description: string,
    turnover: string,
    alternate_mobile1: string,
    alternate_mobile2: string,
    alternate_email: string,
    remarks: string,
    lead_type: string
    stage: string
    lead_source: string
    status?: string
}

export type IReferTemplate = {
    _id: string,
    name: string,
    customer_name: string,
    mobile: string,
    gst: string,
    city: string,
    state: string,
    status?: string
}

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

export type IBillsAgingReportTemplate = {
    report_owner: string
    account: string,
    plu70: number,
    in70to90: number,
    in90to120: number,
    plus120: number
    status?: string
}
export type IPendingOrdersReportTemplate = {
    report_owner: string
    account: string,
    product_family: string,
    article: string,
    size5: number,
    size6: number,
    size7: number,
    size8: number,
    size9: number,
    size10: number,
    size11: number,
    size12_24pairs: number,
    size13: number,
    size11x12: number,
    size3: number,
    size4: number,
    size6to10: number,
    size7to10: number,
    size8to10: number,
    size4to8: number,
    size6to9: number,
    size5to8: number,
    size6to10A: number,
    size7to10B: number,
    size6to9A: number,
    size11close: number,
    size11to13: number,
    size3to8: number,
    status?: string
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
export type ClientSaleReportTemplate = {
    report_owner: string,
    account: string,
    article: string,
    oldqty: number,
    newqty: number,
    apr: number,
    may: number,
    jun: number,
    jul: number,
    aug: number,
    sep: number,
    oct: number,
    nov: number,
    dec: number,
    jan: number,
    feb: number,
    mar: number,
    status?: string
}


export type ICRMStateTemplate = {
    _id: string,
    state: string,
    users?: string,
    status?: string
}
export type ICRMCityTemplate = {
    _id: string,
    city: string,
    users?: string,
    status?: string
}

export type IStageTemplate = {
    _id: string,
    stage: string,
    status?: string
}

export type ILeadTypeTemplate = {
    _id: string,
    type: string,
    status?: string
}

export type ILeadSourceTemplate = {
    _id: string,
    source: string,
    status?: string
}


export type ITemplateCategoryField = {
    _id: string,
    categories: string[]
}

