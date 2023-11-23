import React, { useReducer } from "react"

type UserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" |
  "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "refresh_whatsapp" | "update_user_password"

type ContactChoices = "create_contact" | "update_contact" | "delete_contact" | "bulk_contact" | "close_contact"

type VisitChoices = "start_day" | "end_day" | "visit_in" | "visit_out" | "close_visit"

type TaskChoices = "create_task" | "add_more_boxes" | "delete_task" | "close_task" | "view_boxes" | "edit_task"

type CheckListChoices = "create_checklist" | "add_more_check_boxes" | "delete_checklist" | "close_checklist" | "edit_checklist" | "view_checklist_boxes" | "check_my_boxes"


type LeadChoices = "create_lead" | "update_lead" | "add_remark" | "view_remarks" | "close_lead" | "display_filter" | "delete_lead" | "convert_customer" | "lead_advance_filter" | "create_refer" | "update_refer" | "delete_refer" | "view_referrals" | "bulk_delete_useless_leads" | "convert_useless"
  | "refer_lead" | "remove_referral" | "assign_refer" | "bulk_assign_leads" | "bulk_assign_refers" | "delete_remark" | "update_remark"

type TemplateChoices = "create_template" | "update_template" | "delete_template" | "view_template" | "close_template" | "view_template"
type BroadcastChoices = "create_broadcast" | "update_broadcast" | "delete_broadcast" | "close_broadcast" | "view_broadcast" | 'start_broadcast' | "reset_broadcast" | "stop_broadcast" | "create_message_broadcast" | "update_message_broadcast"
  | "start_message_broadcast" | "set_daily_count"

type TODOChoices = "create_todo" | "update_todo" | "delete_todo" | "close_todo" | "view_todo" | 'start_todo' | "reset_todo" | "stop_todo" | "create_message_todo" | "update_message_todo"
  | "start_message_todo"

type ReminderChoices = "create_reminder" | "update_reminder" | "delete_reminder" | "close_reminder" | "view_reminder" | 'start_reminder' | "reset_reminder" | "stop_reminder" | "create_message_reminder" | "update_message_reminder"
  | "start_message_reminder"

type TaskSchedulerChoices = "create_task_scheduler" | "update_task_scheduler" | "delete_task_scheduler" | "close_task_scheduler" | "view_task_scheduler" | 'start_task_scheduler' | "stop_task_scheduler"



type BotChoices = "create_flow"
  | "refresh_whatsapp"
  | "update_flow"
  | "toogle_bot_status"
  | "update_tracker"
  | "delete_flow"
  | "close_bot"
  | "view_connected_users"
  | "update_connected_users"
  | "toogle_flow_status" | "delete_tracker"



type ChoiceState = UserChoices | LeadChoices | BotChoices | TemplateChoices | TaskChoices | VisitChoices
  | BroadcastChoices | TaskSchedulerChoices | TODOChoices | ReminderChoices | ContactChoices | CheckListChoices

const initialState: ChoiceState | null = null



export enum ContactChoiceActions {
  create_contact = "create_contact",
  update_contact = "update_contact",
  delete_contact = "delete_contact",
  bulk_contact = "bulk_contact",
  close_contact = "close_contact"
}
export enum VisitChoiceActions {
  start_day = "start_day",
  end_day = "end_day",
  visit_in = "visit_in",
  visit_out = "visit_out",
  close_visit = "close_visit"

}
export enum TaskChoiceActions {
  create_task = "create_task",
  add_more_boxes = "add_more_boxes",
  delete_task = "delete_task",
  close_task = "close_task",
  view_boxes = "view_boxes",
  edit_task = "edit_task"
}
export enum CheckListChoiceActions {
  create_checklist = "create_checklist",
  add_more_check_boxes = "add_more_check_boxes",
  delete_checklist = "delete_checklist",
  close_checklist = "close_checklist",
  edit_checklist = "edit_checklist",
  view_checklist_boxes = "view_checklist_boxes",
  check_my_boxes = "check_my_boxes"
}


export enum TemplateChoiceActions {
  create_template = "create_template",
  update_template = "update_template",
  delete_template = "delete_template",
  close_template = "close_template",
  view_template = "view_template"

}
export enum BroadcastChoiceActions {
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
export enum ReminderChoiceActions {
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
export enum TODOChoiceActions {
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
export enum TaskSchedulerChoiceActions {
  create_task_scheduler = "create_task_scheduler",
  update_task_scheduler = "update_task_scheduler",
  delete_task_scheduler = "delete_task_scheduler",
  close_task_scheduler = "close_task_scheduler",
  view_task_scheduler = "view_task_scheduler",
  start_task_scheduler = 'start_task_scheduler',
  stop_task_scheduler = "stop_task_scheduler",
}

export enum BotChoiceActions {
  create_flow = "create_flow",
  refresh_whatsapp = "refresh_whatsapp",
  update_flow = "update_flow",
  toogle_bot_status = "toogle_bot_status",
  update_tracker = "update_tracker",
  delete_tracker = "delete_tracker",
  delete_flow = "delete_flow",
  close_bot = "close_bot",
  view_connected_users = "view_connected_users",
  update_connected_users = "update_connected_users",
  toogle_flow_status = "toogle_flow_status"
}
export enum LeadChoiceActions {
  create_lead = "create_lead",
  update_lead = "update_lead",
  delete_lead = "delete_lead",
  delete_remark = "delete_remark",
  update_remark = "update_remark",
  view_remarks = "view_remarks",
  close_lead = "close_lead",
  convert_customer = "convert_customer",
  display_filter = "display_filter",
  add_remark = "add_remark",
  lead_advance_filter = "lead_advance_filter",
  create_refer = "create_refer",
  update_refer = "update_refer",
  delete_refer = "delete_refer",
  view_referrals = "view_referrals",
  refer_lead = "refer_lead",
  remove_referral = "remove_referral",
  bulk_delete_useless_leads = "bulk_delete_useless_leads",
  convert_useless = "convert_useless",
  assign_refer = "assign_refer",
  bulk_assign_leads = "bulk_assign_leads",
  bulk_assign_refers = "bulk_assign_refers"
}

export enum UserChoiceActions {
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
  type: UserChoiceActions | LeadChoiceActions | BotChoiceActions | TemplateChoiceActions | BroadcastChoiceActions | TODOChoiceActions | ReminderChoiceActions | ContactChoiceActions | TaskChoiceActions | CheckListChoiceActions | VisitChoiceActions
}

// reducer
function reducer(state: ChoiceState | null, action: Action) {
  let type = action.type
  switch (type) {
    // user dialogs choices
    case UserChoiceActions.signup: return type
    case UserChoiceActions.reset_password_mail: return type
    case UserChoiceActions.new_user: return type
    case UserChoiceActions.update_user: return type
    case UserChoiceActions.update_profile: return type
    case UserChoiceActions.view_profile: return type
    case UserChoiceActions.update_password: return type
    case UserChoiceActions.reset_password: return type
    case UserChoiceActions.verify_email: return type
    case UserChoiceActions.block_user: return type
    case UserChoiceActions.unblock_user: return type
    case UserChoiceActions.make_admin: return type
    case UserChoiceActions.control_access: return type
    case UserChoiceActions.remove_admin: return type
    case UserChoiceActions.delete_user: return type
    case UserChoiceActions.close_user: return type
    case UserChoiceActions.update_user_password: return type

    // lead dialog choices
    case LeadChoiceActions.create_lead: return type
    case LeadChoiceActions.update_lead: return type
    case LeadChoiceActions.view_remarks: return type
    case LeadChoiceActions.add_remark: return type
    case LeadChoiceActions.display_filter: return type
    case LeadChoiceActions.delete_lead: return type
    case LeadChoiceActions.convert_customer: return type
    case LeadChoiceActions.lead_advance_filter: return type
    case LeadChoiceActions.close_lead: return type
    case LeadChoiceActions.create_refer: return type
    case LeadChoiceActions.update_refer: return type
    case LeadChoiceActions.delete_refer: return type
    case LeadChoiceActions.view_referrals: return type
    case LeadChoiceActions.refer_lead: return type
    case LeadChoiceActions.remove_referral: return type
    case LeadChoiceActions.bulk_delete_useless_leads: return type
    case LeadChoiceActions.assign_refer: return type
    case LeadChoiceActions.delete_remark: return type
    case LeadChoiceActions.update_remark: return type
    case LeadChoiceActions.convert_useless: return type
    case LeadChoiceActions.bulk_assign_leads: return type
    case LeadChoiceActions.bulk_assign_refers: return type


    //bot choice actions
    case BotChoiceActions.refresh_whatsapp: return type
    case BotChoiceActions.delete_flow: return type
    case BotChoiceActions.update_flow: return type
    case BotChoiceActions.create_flow: return type
    case BotChoiceActions.update_tracker: return type
    case BotChoiceActions.toogle_bot_status: return type
    case BotChoiceActions.close_bot: return type
    case BotChoiceActions.view_connected_users: return type
    case BotChoiceActions.delete_tracker: return type
    case BotChoiceActions.toogle_flow_status: return type
    case BotChoiceActions.update_connected_users: return type


    // template choice action
    case TemplateChoiceActions.create_template: return type
    case TemplateChoiceActions.update_template: return type
    case TemplateChoiceActions.delete_template: return type
    case TemplateChoiceActions.close_template: return type
    case TemplateChoiceActions.view_template: return type


    case VisitChoiceActions.visit_in: return type
    case VisitChoiceActions.visit_out: return type
    case VisitChoiceActions.start_day: return type
    case VisitChoiceActions.end_day: return type
    case VisitChoiceActions.close_visit: return type


    // task
    case TaskChoiceActions.create_task: return type
    case TaskChoiceActions.add_more_boxes: return type
    case TaskChoiceActions.view_boxes: return type
    case TaskChoiceActions.delete_task: return type
    case TaskChoiceActions.close_task: return type
    case TaskChoiceActions.edit_task: return type

    // checklist actions
    case CheckListChoiceActions.create_checklist: return type
    case CheckListChoiceActions.add_more_check_boxes: return type
    case CheckListChoiceActions.delete_checklist: return type
    case CheckListChoiceActions.close_checklist: return type
    case CheckListChoiceActions.edit_checklist: return type
    case CheckListChoiceActions.view_checklist_boxes: return type
    case CheckListChoiceActions.check_my_boxes: return type

    // /contact choice actions
    case ContactChoiceActions.create_contact: return type
    case ContactChoiceActions.update_contact: return type
    case ContactChoiceActions.delete_contact: return type
    case ContactChoiceActions.close_contact: return type
    case ContactChoiceActions.bulk_contact: return type

    // broadcast choice action
    case BroadcastChoiceActions.create_broadcast: return type
    case BroadcastChoiceActions.update_broadcast: return type
    case BroadcastChoiceActions.delete_broadcast: return type
    case BroadcastChoiceActions.close_broadcast: return type
    case BroadcastChoiceActions.view_broadcast: return type
    case BroadcastChoiceActions.start_broadcast: return type
    case BroadcastChoiceActions.reset_broadcast: return type
    case BroadcastChoiceActions.stop_broadcast: return type
    case BroadcastChoiceActions.create_message_broadcast: return type
    case BroadcastChoiceActions.update_message_broadcast: return type
    case BroadcastChoiceActions.start_message_broadcast: return type
    case BroadcastChoiceActions.set_daily_count: return type

    // todo choice action
    case TODOChoiceActions.create_todo: return type
    case TODOChoiceActions.update_todo: return type
    case TODOChoiceActions.delete_todo: return type
    case TODOChoiceActions.close_todo: return type
    case TODOChoiceActions.view_todo: return type
    case TODOChoiceActions.start_todo: return type
    case TODOChoiceActions.reset_todo: return type
    case TODOChoiceActions.stop_todo: return type
    case TODOChoiceActions.create_message_todo: return type
    case TODOChoiceActions.update_message_todo: return type
    case TODOChoiceActions.start_message_todo: return type

    // broadcast choice action
    case ReminderChoiceActions.create_reminder: return type
    case ReminderChoiceActions.update_reminder: return type
    case ReminderChoiceActions.delete_reminder: return type
    case ReminderChoiceActions.close_reminder: return type
    case ReminderChoiceActions.view_reminder: return type
    case ReminderChoiceActions.start_reminder: return type
    case ReminderChoiceActions.reset_reminder: return type
    case ReminderChoiceActions.stop_reminder: return type
    case ReminderChoiceActions.create_message_reminder: return type
    case ReminderChoiceActions.update_message_reminder: return type
    case ReminderChoiceActions.start_message_reminder: return type

    default: return state
  }
}
// context
type Context = {
  choice: ChoiceState | null,
  setChoice: React.Dispatch<Action>
}
export const ChoiceContext = React.createContext<Context>(
  {
    choice: null,
    setChoice: () => null
  }
)
// provider
export function ChoiceProvider(props: { children: JSX.Element }) {
  const [choice, setChoice] = useReducer(reducer, initialState)
  return (
    <ChoiceContext.Provider value={{ choice, setChoice }}>
      {props.children}
    </ChoiceContext.Provider>
  )

}
