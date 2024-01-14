import { IUser } from "./user.types"

export type IChecklist = {
    _id: string,
    title: string,
    sheet_url: string,
    serial_no:number,
    boxes: {
        desired_date: Date,
        actual_date?: Date,
    }[],
    owner: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


export type IChecklistBody = Request['body'] & IChecklist;