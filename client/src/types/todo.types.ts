import { IUser } from "./user.types"

export type ITodo = {
    _id: string,
    work_title: string,
    category: string,
    work_description: string,
    person: IUser,
    status: string,
    replies: { reply: string, created_by: IUser, timestamp: Date }[]
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ITodoBody = Request['body'] & ITodo;