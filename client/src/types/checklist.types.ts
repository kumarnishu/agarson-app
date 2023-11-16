import { IUser } from "./user.types"

export type IChecklist = {
    _id: string,
    title: string,
    sheet_url: string,
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


export type IChecklistkBody = Request['body'] & IChecklist;