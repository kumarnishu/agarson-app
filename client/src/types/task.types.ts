import { IUser } from "./user.types"

export type ITask = {
    _id: string,
    boxes: {
        date: Date,
        is_completed: boolean
    }[]
    task_description: string,
    frequency_value: number,
    person: IUser,
    frequency_type: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ITaskBody = Request['body'] & ITask;