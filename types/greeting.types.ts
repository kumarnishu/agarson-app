import { IMessageTemplate } from "./template.types"
import { IUser } from "./user.types"

export type IGreeting = {
    name: string,
    party: string,
    mobile: string,
    message: string,
    caption: string,
    template: IMessageTemplate,
    greeting_type: string,
    status: string,
    running_key:string,
    is_paused: boolean,
    is_active: boolean,
    cron_string: string,
    start_date: Date,
    next_run_date: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IGreetingBody = Request['body'] & IGreeting;


