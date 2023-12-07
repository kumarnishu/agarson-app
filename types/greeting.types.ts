import { IUser } from "./user.types"

export type IGreeting = {
    _id:string,
    name: string,
    party: string,
    category: string,
    mobile: string,
    dob_time: Date,
    anniversary_time: Date,
    next_run_dob_time: Date,
    next_run_anniversary_time: Date,
    dob_cronstring: string,
    anniversary_cronstring: string,
    dob_key: string,
    anniversary_key: string,
    dob_whatsapp_status: string,
    anniversary_whatsapp_status: string,
    is_active: boolean,
    is_paused: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IGreetingBody = Request['body'] & IGreeting;


