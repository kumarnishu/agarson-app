import { DropDownDto } from "../common/dropdown.dto"

export type GetSoleThicknessDto={
    dye: string,
    article: string,
    size: string,
    left_thickness: number,
    right_thickness: number,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}

export type CreateOrEditSoleThicknessDto = {
    dye: string,
    article: string,
    size: string,
    left_thickness: number,
    right_thickness: number,
}