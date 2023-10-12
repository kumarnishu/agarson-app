import { IMessage, IMessageTemplate } from "./template.types"
import { IUser } from "./user.types"

export type IReminder = {
    _id: string,
    name: string,
    is_todo: boolean,
    run_once: boolean,
    serial_number: string,
    is_active: boolean,
    is_paused: boolean,
    running_key: string,
    refresh_key: string,
    frequency_type: string,
    frequency_value: string,
    cron_string: string,
    refresh_cron_string: string,
    next_run_date: Date,
    next_refresh_date: Date,
    start_date: Date,
    connected_number: string,
    templates: IMessageTemplate[]
    message: IMessage
    is_random_template: boolean
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IReminderBody = Request['body'] & IReminder;