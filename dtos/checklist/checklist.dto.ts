import { DropDownDto } from "../common/dropdown.dto"

export type GetChecklistCategoryDto = {
    _id: string,
    category: string,
    created_at: Date,
    updated_at: Date,
    created_by: DropDownDto,
    updated_by: DropDownDto
}
export type CreateOrEditChecklistCategoryDto = {
    category: string
}


export type GetChecklistDto = {
    _id: string,
    category: DropDownDto,
    work_title: string,
    details1: string,
    details2: string,
    user: DropDownDto,
    frequency: string,
    created_at: Date,
    updated_at: Date,
    created_by: DropDownDto,
    updated_by: DropDownDto
}
export type CreateOrEditChecklistDto={
    category: string,
    work_title: string,
    details1: string,
    details2: string,
    user: string,
    frequency: string,
}

export type GetChecklistBoxDto = {
    _id: string,
    date: Date,
    checked: boolean,
    checklist: DropDownDto,
    created_at: Date,
    updated_at: Date,
    created_by: DropDownDto,
    updated_by: DropDownDto
}