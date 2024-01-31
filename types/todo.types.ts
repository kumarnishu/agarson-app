import { IUser } from "./user.types"

export type ITodoTemplate = {
    _id: string,
    serial_no: number,
    title: string,
    subtitle: string,
    category: string,
    category2: string,
    contacts: string,
    todo_type: string,
    run_once: boolean,
    frequency_type: string,
    frequency_value: string,
    start_date: string,
    connected_user: string,
    status?: string
}
export type ITodo = {
    _id: string,
    serial_no: number,
    title: string,
    subtitle: string,
    category: string,
    category2: string,
    contacts: {
        mobile: string,
        name: string,
        is_sent: boolean,
        timestamp:Date
    }[],
    todo_type: string,
    is_hidden:boolean,
    is_active: boolean,
    run_once: boolean,
    running_key: string,
    frequency_type: string,
    frequency_value: string,
    cron_string: string,
    next_run_date: Date,
    start_date: Date,
    connected_user: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type ITodoBody = Request['body'] & ITodo;

