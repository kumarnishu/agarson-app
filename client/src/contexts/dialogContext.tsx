import React, { useReducer } from "react"

type UserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" | "create_department" | "update_department" |
  "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "refresh_whatsapp" | "update_user_password" | "block_multi_login" | "reset_multi_login" | "assign_users"


type GreetingChoices = "create_greeting" | "update_greeting" | "delete_greeting" | "bulk_start_greeting" | "close_greeting" | "bulk_stop_greeting" | "stop_greeting" | "start_greeting"

type VisitChoices = "start_day" | "end_day" | "visit_in" | "visit_out" | "close_visit" | "view_visit" | "validate_visit" | "add_summary" | "edit_summary" | "add_brijesh_input" | "add_ankit_input" | "view_comments" | "view_visit_photo" | "mark_attendence" | "upload_samples"


type PasswordChoices = "create_password" | "delete_password" | "close_password" | "update_erp_password"

type CheckListChoices = "create_checklist" | "add_more_check_boxes" | "delete_checklist" | "close_checklist" | "edit_checklist" | "view_checklist_boxes" | "check_my_boxes"


type LeadChoices = "create_lead" | "update_lead" | "add_remark" | "view_remarks" | "close_lead" | "display_filter" | "delete_lead" | "convert_customer" | "lead_advance_filter" | "create_refer" | "update_refer" | "delete_refer" | "view_referrals" | "bulk_delete_useless_leads" | "convert_useless"
  | "refer_lead" | "remove_referral" | "assign_refer" | "bulk_assign_leads" | "bulk_assign_refers" | "delete_remark" | "update_remark" | "create_broadcast" | "update_broadcast" | "stop_broadcast" | "start_broadcast"

type ProductionChoices = "create_machine" | "close_production" | "update_machine" | "create_article" | "update_article" | "create_dye" | "update_dye" | "validate_weight" | "toogle_machine" | "toogle_article" | "toogle_dye" | "view_shoe_photo" | "create_shoe_weight" | "delete_production" | "update_shoe_weight" | "create_production" | "update_production"

type TemplateChoices = "create_template" | "update_template" | "delete_template" | "view_template" | "close_template" | "view_template"


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



type ChoiceState = UserChoices | LeadChoices | BotChoices | TemplateChoices | VisitChoices | CheckListChoices | GreetingChoices | PasswordChoices | ProductionChoices

const initialState: ChoiceState | null = null


export enum ProductionChoiceActions {
  validate_weight = "validate_weight",
  create_machine = "create_machine",
  view_shoe_photo = "view_shoe_photo",
  update_machine = "update_machine",
  create_article = "create_article",
  update_article = "update_article",
  create_dye = "create_dye",
  update_dye = "update_dye",
  toogle_machine = "toogle_machine",
  toogle_article = "toogle_article",
  toogle_dye = "toogle_dye",
  close_production = "close_production",
  create_shoe_weight = "create_shoe_weight",
  update_shoe_weight = "update_shoe_weight",
  create_production = "create_production",
  delete_production = "delete_production",
  update_production = "update_production"
}

export enum GreetingChoiceActions {
  create_greeting = "create_greeting",
  update_greeting = "update_greeting",
  delete_greeting = "delete_greeting",
  start_greeting = "start_greeting",
  bulk_start_greeting = "bulk_start_greeting",
  close_greeting = "close_greeting",
  bulk_stop_greeting = "bulk_stop_greeting",
  stop_greeting = "stop_greeting"
}
export enum PasswordChoiceActions {
  create_password = "create_password",
  delete_password = "delete_password",
  close_password = "close_password",
  update_erp_password = "update_erp_password"
}
export enum VisitChoiceActions {
  upload_samples = "upload_samples",
  view_visit_photo = "view_visit_photo",
  mark_attendence = "mark_attendence",
  start_day = "start_day",
  end_day = "end_day",
  visit_in = "visit_in",
  visit_out = "visit_out",
  close_visit = "close_visit",
  view_visit = "view_visit",
  validate_visit = "validate_visit",
  add_summary = "add_summary",
  edit_summary = "edit_summary",
  add_brijesh_input = "add_brijesh_input",
  add_ankit_input = "add_ankit_input",
  view_comments = "view_comments"

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
  bulk_assign_refers = "bulk_assign_refers",
  create_broadcast = "create_broadcast",
  update_broadcast = "update_broadcast",
  stop_broadcast = "stop_broadcast",
  start_broadcast = "start_broadcast"
}

export enum UserChoiceActions {
  create_department = "create_department",
  update_department = "update_department",
  assign_users = "assign_users",
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
  update_user_password = "update_user_password",
  block_multi_login = "block_multi_login",
  reset_multi_login = "reset_multi_login"
}

type Action = {
  type: UserChoiceActions |
  LeadChoiceActions | BotChoiceActions | TemplateChoiceActions | PasswordChoiceActions | CheckListChoiceActions | VisitChoiceActions | GreetingChoiceActions | ProductionChoiceActions
}

// reducer
function reducer(state: ChoiceState | null, action: Action) {
  let type = action.type
  switch (type) {
    // user dialogs choices
    case UserChoiceActions.signup: return type
    case UserChoiceActions.create_department: return type
    case UserChoiceActions.update_department: return type
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
    case UserChoiceActions.reset_multi_login: return type
    case UserChoiceActions.assign_users: return type
    case UserChoiceActions.block_multi_login: return type

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
    case LeadChoiceActions.create_broadcast: return type
    case LeadChoiceActions.update_broadcast: return type
    case LeadChoiceActions.stop_broadcast: return type
    case LeadChoiceActions.start_broadcast: return type


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

    //production choice actios
    case ProductionChoiceActions.create_machine: return type
    case ProductionChoiceActions.update_machine: return type
    case ProductionChoiceActions.create_article: return type
    case ProductionChoiceActions.update_article: return type
    case ProductionChoiceActions.create_dye: return type
    case ProductionChoiceActions.update_dye: return type
    case ProductionChoiceActions.toogle_article: return type
    case ProductionChoiceActions.toogle_dye: return type
    case ProductionChoiceActions.toogle_machine: return type
    case ProductionChoiceActions.close_production: return type
    case ProductionChoiceActions.validate_weight: return type
    case ProductionChoiceActions.view_shoe_photo: return type
    case ProductionChoiceActions.create_production: return type
    case ProductionChoiceActions.update_production: return type
    case ProductionChoiceActions.create_shoe_weight: return type
    case ProductionChoiceActions.update_shoe_weight: return type
    case ProductionChoiceActions.delete_production: return type

    // template choice action
    case TemplateChoiceActions.create_template: return type
    case TemplateChoiceActions.update_template: return type
    case TemplateChoiceActions.delete_template: return type
    case TemplateChoiceActions.close_template: return type
    case TemplateChoiceActions.view_template: return type

    case PasswordChoiceActions.create_password: return type
    case PasswordChoiceActions.update_erp_password: return type
    case PasswordChoiceActions.delete_password: return type
    case PasswordChoiceActions.close_password: return type

    //greeeting
    case GreetingChoiceActions.create_greeting: return type
    case GreetingChoiceActions.update_greeting: return type
    case GreetingChoiceActions.delete_greeting: return type
    case GreetingChoiceActions.close_greeting: return type
    case GreetingChoiceActions.bulk_start_greeting: return type
    case GreetingChoiceActions.bulk_stop_greeting: return type
    case GreetingChoiceActions.start_greeting: return type
    case GreetingChoiceActions.stop_greeting: return type


    // visit
    case VisitChoiceActions.upload_samples: return type
    case VisitChoiceActions.visit_in: return type
    case VisitChoiceActions.visit_out: return type
    case VisitChoiceActions.start_day: return type
    case VisitChoiceActions.end_day: return type
    case VisitChoiceActions.close_visit: return type
    case VisitChoiceActions.view_visit: return type
    case VisitChoiceActions.edit_summary: return type
    case VisitChoiceActions.add_summary: return type
    case VisitChoiceActions.add_ankit_input: return type
    case VisitChoiceActions.add_brijesh_input: return type
    case VisitChoiceActions.view_comments: return type
    case VisitChoiceActions.validate_visit: return type
    case VisitChoiceActions.mark_attendence: return type
    case VisitChoiceActions.view_visit_photo: return type


    // checklist actions
    case CheckListChoiceActions.create_checklist: return type
    case CheckListChoiceActions.add_more_check_boxes: return type
    case CheckListChoiceActions.delete_checklist: return type
    case CheckListChoiceActions.close_checklist: return type
    case CheckListChoiceActions.edit_checklist: return type
    case CheckListChoiceActions.view_checklist_boxes: return type
    case CheckListChoiceActions.check_my_boxes: return type
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