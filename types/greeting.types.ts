import { IUser } from "./user.types"

export type IGreeting = {
    _id:string,
    name: string,
    party: string,
    category: string,
    mobile: string,
    dob_time: Date,
    anniversary_time: Date,
    is_active: boolean,
    connected_number: string,
    last_run_date: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IGreetingBody = Request['body'] & IGreeting;


