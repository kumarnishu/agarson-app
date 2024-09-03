import { GetUserDto } from "../dtos/users/user.dto";

export type IChecklist = {
    _id: string,
    title: string,
    sheet_url: string,
    serial_no:number,
    boxes: {
        desired_date: Date,
        actual_date?: Date,
    }[],
    owner: GetUserDto,
    created_at: Date,
    updated_at: Date,
    created_by: GetUserDto,
    updated_by: GetUserDto
}


export type IChecklistBody = Request['body'] & IChecklist;