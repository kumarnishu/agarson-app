import { IGreeting } from "./greeting.types";
import { IReminder } from "./reminder.types";
import { IUser } from "./user.types";

export type IContact = {
    _id: string,
    name: string,
    party: string,
    mobile: string,
    reminders: IReminder[],
    greetings: IGreeting[],
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IContactReport = {
    _id: string,
    contact: IContact,
    reminder: IReminder,
    greeting: IGreeting,
    reminder_whatsapp_status: string,
    greeting_whatsapp_status: string,
    reminder_status: string,
    greeting_status: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IContactReportBody = Request['body'] & IContactReport;
export type IContactBody = Request['body'] & IContact;