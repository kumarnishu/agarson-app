import { IUser } from "./user.types"

export type ITodoTemplate = {
    _id: string,
    serial_no: number,
    title: string,
    sheet_url: string,
    category: string,
    category2: string,
    contacts: string,
    reply: string,
    todo_type: string,
    start_time: string,
    dates: string,
    months: string,
    weekdays: string,
    years: string,
    connected_user: string,
    status?: string
}
export type ITodo = {
    _id: string,
    serial_no: number,
    title: string,
    sheet_url: string,
    category: string,
    category2: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        timestamp: Date
    }[],
    replies: {
        reply: string,
        created_by: IUser,
        timestamp: Date
    }[],
    todo_type: string,
    is_hidden: boolean,
    is_active: boolean,
    start_time: string,
    dates: string,
    months: string,
    weekdays: string,
    years: string,
    connected_user: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ITodoBody = Request['body'] & ITodo;

