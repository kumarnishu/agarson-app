import { DropDownDto } from "../common/dropdown.dto"


export type CreateOrEditChecklistCategoryDto = {
    category: string
}


export type GetChecklistDto = {
    _id: string,
    category: DropDownDto,
    work_title: string,
    link: string,
    user: DropDownDto,
    end_date: string,
    frequency: string,
    boxes:GetChecklistBoxDto[],
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}
export type CreateOrEditChecklistDto={
    category: string,
    work_title: string,
    link: string,
    end_date:string,
    user_id: string,
    frequency: string,
}

export type GetChecklistBoxDto = {
    _id: string,
    date: string,
    checked: boolean,
    remarks: string,
}