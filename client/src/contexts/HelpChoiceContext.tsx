import React, { useReducer } from "react"

type HelpUserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" |
    "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "refresh_whatsapp" | "update_user_password"

type helpContactChoices = "create_contact" | "update_contact" | "delete_contact" | "bulk_contact" | "close_contact"


type HelpLeadChoices = "create_lead" | "update_lead" | "update_remark" | "view_remarks" | "close_lead" | "display_filter" | "delete_lead" | "convert_customer" | "lead_advance_filter" | "create_refer" | "update_refer" | "delete_refer" | "view_referrals" | "bulk_delete_useless_leads" | "convert_useless"
    | "refer_lead" | "remove_referral"

type helpTemplateChoices = "create_template" | "update_template" | "delete_template" | "view_template" | "close_template" | "view_template"
type HelpBroadcastChoices = "create_broadcast" | "update_broadcast" | "delete_broadcast" | "close_broadcast" | "view_broadcast" | 'start_broadcast' | "reset_broadcast" | "stop_broadcast" | "create_message_broadcast" | "update_message_broadcast"
    | "start_message_broadcast" | "set_daily_count"

type HelpTODOChoices = "create_todo" | "update_todo" | "delete_todo" | "close_todo" | "view_todo" | 'start_todo' | "reset_todo" | "stop_todo" | "create_message_todo" | "update_message_todo"
    | "start_message_todo"

type HelpReminderChoices = "create_reminder" | "update_reminder" | "delete_reminder" | "close_reminder" | "view_reminder" | 'start_reminder' | "reset_reminder" | "stop_reminder" | "create_message_reminder" | "update_message_reminder"
    | "start_message_reminder"

type HelpTaskSchedulerChoices = "create_task_scheduler" | "update_task_scheduler" | "delete_task_scheduler" | "close_task_scheduler" | "view_task_scheduler" | 'start_task_scheduler' | "stop_task_scheduler"


type HelpBotChoices = "create_flow"
    | "refresh_whatsapp"
    | "update_flow"
    | "toogle_bot_status"
    | "update_tracker"
    | "delete_flow"
    | "close_bot"
    | "view_connected_users"
    | "update_connected_users"
    | "toogle_flow_status"



type ChoiceState = HelpUserChoices | HelpLeadChoices | HelpBotChoices | helpTemplateChoices | HelpBroadcastChoices | HelpTaskSchedulerChoices | HelpTODOChoices | HelpReminderChoices | helpContactChoices

const initialState: ChoiceState | null = null



export enum HelpContactChoiceActions {
    create_contact = "create_contact",
    update_contact = "update_contact",
    delete_contact = "delete_contact",
    bulk_contact = "bulk_contact",
    close_contact = "close_contact"
}

export enum HelpTemplateChoiceActions {
    create_template = "create_template",
    update_template = "update_template",
    delete_template = "delete_template",
    close_template = "close_template",
    view_template = "view_template"

}
export enum HelpBroadcastChoiceActions {
    create_broadcast = "create_broadcast",
    update_broadcast = "update_broadcast",
    delete_broadcast = "delete_broadcast",
    close_broadcast = "close_broadcast",
    view_broadcast = "view_broadcast",
    start_broadcast = "start_broadcast",
    reset_broadcast = "reset_broadcast",
    stop_broadcast = "stop_broadcast",
    create_message_broadcast = "create_message_broadcast",
    update_message_broadcast = "update_message_broadcast",
    start_message_broadcast = "start_message_broadcast",
    set_daily_count = "set_daily_count"
}
export enum HelpReminderChoiceActions {
    create_reminder = "create_reminder",
    update_reminder = "update_reminder",
    delete_reminder = "delete_reminder",
    close_reminder = "close_reminder",
    view_reminder = "view_reminder",
    start_reminder = "start_reminder",
    reset_reminder = "reset_reminder",
    stop_reminder = "stop_reminder",
    create_message_reminder = "create_message_reminder",
    update_message_reminder = "update_message_reminder",
    start_message_reminder = "start_message_reminder"
}
export enum HelpTODOChoiceActions {
    create_todo = "create_todo",
    update_todo = "update_todo",
    delete_todo = "delete_todo",
    close_todo = "close_todo",
    view_todo = "view_todo",
    start_todo = "start_todo",
    reset_todo = "reset_todo",
    stop_todo = "stop_todo",
    create_message_todo = "create_message_todo",
    update_message_todo = "update_message_todo",
    start_message_todo = "start_message_todo"
}
export enum HelpTaskSchedulerChoiceActions {
    create_task_scheduler = "create_task_scheduler",
    update_task_scheduler = "update_task_scheduler",
    delete_task_scheduler = "delete_task_scheduler",
    close_task_scheduler = "close_task_scheduler",
    view_task_scheduler = "view_task_scheduler",
    start_task_scheduler = 'start_task_scheduler',
    stop_task_scheduler = "stop_task_scheduler",
}

export enum HelpBotChoiceActions {
    create_flow = "create_flow",
    refresh_whatsapp = "refresh_whatsapp",
    update_flow = "update_flow",
    toogle_bot_status = "toogle_bot_status",
    update_tracker = "update_tracker",
    delete_flow = "delete_flow",
    close_bot = "close_bot",
    view_connected_users = "view_connected_users",
    update_connected_users = "update_connected_users",
    toogle_flow_status = "toogle_flow_status"
}
export enum HelpLeadChoiceActions {
    create_lead = "create_lead",
    update_lead = "update_lead",
    delete_lead = "delete_lead",
    view_remarks = "view_remarks",
    close_lead = "close_lead",
    convert_customer = "convert_customer",
    display_filter = "display_filter",
    update_remark = "update_remark",
    lead_advance_filter = "lead_advance_filter",
    create_refer = "create_refer",
    update_refer = "update_refer",
    delete_refer = "delete_refer",
    view_referrals = "view_referrals",
    refer_lead = "refer_lead",
    remove_referral = "remove_referral",
    bulk_delete_useless_leads = "bulk_delete_useless_leads",
    convert_useless = "convert_useless"
}

export enum HelpUserChoiceActions {
    signup = "signup",
    reset_password_mail = "reset_password_mail",
    close_user = "close_user",
    new_user = "new_user",
    update_user = "update_user",
    update_profile = "update_profile",
    view_profile = "view_profile",
    reset_password = "reset_password",
    update_password = "update_password",
    verify_email = "verify_email",
    block_user = "block_user",
    unblock_user = "unblock_user",
    make_admin = "make_admin",
    remove_admin = "remove_admin",
    delete_user = "delete_user",
    control_access = "control_access",
    refresh_whatsapp = "refresh_whatsapp",
    update_user_password = "update_user_password"
}

type Action = {
    type: HelpUserChoiceActions | HelpLeadChoiceActions | HelpBotChoiceActions | HelpTemplateChoiceActions | HelpBroadcastChoiceActions | HelpTODOChoiceActions | HelpReminderChoiceActions | HelpContactChoiceActions
}

// reducer
function reducer(state: ChoiceState | null, action: Action) {
    let type = action.type
    switch (type) {
        // user dialogs choices
        case HelpUserChoiceActions.signup: return type
        case HelpUserChoiceActions.reset_password_mail: return type
        case HelpUserChoiceActions.new_user: return type
        case HelpUserChoiceActions.update_user: return type
        case HelpUserChoiceActions.update_profile: return type
        case HelpUserChoiceActions.view_profile: return type
        case HelpUserChoiceActions.update_password: return type
        case HelpUserChoiceActions.reset_password: return type
        case HelpUserChoiceActions.verify_email: return type
        case HelpUserChoiceActions.block_user: return type
        case HelpUserChoiceActions.unblock_user: return type
        case HelpUserChoiceActions.make_admin: return type
        case HelpUserChoiceActions.control_access: return type
        case HelpUserChoiceActions.remove_admin: return type
        case HelpUserChoiceActions.delete_user: return type
        case HelpUserChoiceActions.close_user: return type
        case HelpUserChoiceActions.update_user_password: return type

        // lead dialog choices
        case HelpLeadChoiceActions.create_lead: return type
        case HelpLeadChoiceActions.update_lead: return type
        case HelpLeadChoiceActions.view_remarks: return type
        case HelpLeadChoiceActions.update_remark: return type
        case HelpLeadChoiceActions.display_filter: return type
        case HelpLeadChoiceActions.delete_lead: return type
        case HelpLeadChoiceActions.convert_customer: return type
        case HelpLeadChoiceActions.lead_advance_filter: return type
        case HelpLeadChoiceActions.close_lead: return type
        case HelpLeadChoiceActions.create_refer: return type
        case HelpLeadChoiceActions.update_refer: return type
        case HelpLeadChoiceActions.delete_refer: return type
        case HelpLeadChoiceActions.view_referrals: return type
        case HelpLeadChoiceActions.refer_lead: return type
        case HelpLeadChoiceActions.remove_referral: return type
        case HelpLeadChoiceActions.bulk_delete_useless_leads: return type
        case HelpLeadChoiceActions.convert_useless: return type


        //bot choice actions
        case HelpBotChoiceActions.refresh_whatsapp: return type
        case HelpBotChoiceActions.delete_flow: return type
        case HelpBotChoiceActions.update_flow: return type
        case HelpBotChoiceActions.create_flow: return type
        case HelpBotChoiceActions.update_tracker: return type
        case HelpBotChoiceActions.toogle_bot_status: return type
        case HelpBotChoiceActions.close_bot: return type
        case HelpBotChoiceActions.view_connected_users: return type
        case HelpBotChoiceActions.toogle_flow_status: return type
        case HelpBotChoiceActions.update_connected_users: return type


        // template choice action
        case HelpTemplateChoiceActions.create_template: return type
        case HelpTemplateChoiceActions.update_template: return type
        case HelpTemplateChoiceActions.delete_template: return type
        case HelpTemplateChoiceActions.close_template: return type
        case HelpTemplateChoiceActions.view_template: return type


        // /contact choice actions
        case HelpContactChoiceActions.create_contact: return type
        case HelpContactChoiceActions.update_contact: return type
        case HelpContactChoiceActions.delete_contact: return type
        case HelpContactChoiceActions.close_contact: return type
        case HelpContactChoiceActions.bulk_contact: return type

        // broadcast choice action
        case HelpBroadcastChoiceActions.create_broadcast: return type
        case HelpBroadcastChoiceActions.update_broadcast: return type
        case HelpBroadcastChoiceActions.delete_broadcast: return type
        case HelpBroadcastChoiceActions.close_broadcast: return type
        case HelpBroadcastChoiceActions.view_broadcast: return type
        case HelpBroadcastChoiceActions.start_broadcast: return type
        case HelpBroadcastChoiceActions.reset_broadcast: return type
        case HelpBroadcastChoiceActions.stop_broadcast: return type
        case HelpBroadcastChoiceActions.create_message_broadcast: return type
        case HelpBroadcastChoiceActions.update_message_broadcast: return type
        case HelpBroadcastChoiceActions.start_message_broadcast: return type
        case HelpBroadcastChoiceActions.set_daily_count: return type

        // todo choice action
        case HelpTODOChoiceActions.create_todo: return type
        case HelpTODOChoiceActions.update_todo: return type
        case HelpTODOChoiceActions.delete_todo: return type
        case HelpTODOChoiceActions.close_todo: return type
        case HelpTODOChoiceActions.view_todo: return type
        case HelpTODOChoiceActions.start_todo: return type
        case HelpTODOChoiceActions.reset_todo: return type
        case HelpTODOChoiceActions.stop_todo: return type
        case HelpTODOChoiceActions.create_message_todo: return type
        case HelpTODOChoiceActions.update_message_todo: return type
        case HelpTODOChoiceActions.start_message_todo: return type

        // broadcast choice action
        case HelpReminderChoiceActions.create_reminder: return type
        case HelpReminderChoiceActions.update_reminder: return type
        case HelpReminderChoiceActions.delete_reminder: return type
        case HelpReminderChoiceActions.close_reminder: return type
        case HelpReminderChoiceActions.view_reminder: return type
        case HelpReminderChoiceActions.start_reminder: return type
        case HelpReminderChoiceActions.reset_reminder: return type
        case HelpReminderChoiceActions.stop_reminder: return type
        case HelpReminderChoiceActions.create_message_reminder: return type
        case HelpReminderChoiceActions.update_message_reminder: return type
        case HelpReminderChoiceActions.start_message_reminder: return type

        default: return state
    }
}
// context
type Context = {
    choice: ChoiceState | null,
    setChoice: React.Dispatch<Action>
}
export const HelpChoiceContext = React.createContext<Context>(
    {
        choice: null,
        setChoice: () => null
    }
)
// provider
export function HelpChoiceProvider(props: { children: JSX.Element }) {
    const [choice, setChoice] = useReducer(reducer, initialState)
    return (
        <HelpChoiceContext.Provider value={{ choice, setChoice }}>
            {props.children}
        </HelpChoiceContext.Provider>
    )

}
