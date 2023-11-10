import { IUser } from "./user.types"

export type ITask = {
    _id: string,
    boxes: {
        id: string,
        is_completed: boolean
    }[]
    task_description: string,
    person: IUser,
    frequency_type: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ITaskBody = Request['body'] & ITask;