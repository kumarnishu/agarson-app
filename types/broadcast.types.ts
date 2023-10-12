import { IMessage, IMessageTemplate } from "./template.types"
import { IUser } from "./user.types"

export type IBroadcastReport = {
    _id: string,
    mobile: string,
    customer_name: string,
    is_buisness: boolean,
    status: string,
    broadcast: IBroadcast,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IBroadcast = {
    _id: string,
    name: string,
    start_date: Date,
    cron_string: string,
    next_run_date: Date
    cron_key: string,
    daily_count: number,
    is_active: boolean,
    connected_number: string,
    templates: IMessageTemplate[]
    message: IMessage
    is_random_template: boolean
    daily_limit: number,
    is_paused: boolean,
    time_gap: string,
    autoRefresh: boolean,
    leads_selected: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IBroadcastReportBody = Request['body'] & IBroadcastReport;
export type IBroadcastBody = Request['body'] & IBroadcast;