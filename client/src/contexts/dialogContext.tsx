import React, { useReducer } from "react"

type UserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" | "create_or_edit_erpstate" | "update_state" | "delete_state" |
  "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "refresh_whatsapp" | "update_user_password" | "block_multi_login" | "reset_multi_login" | "assign_users" | "bulk_assign_erp_states" | "toogle_show_visitingcard"


type GreetingChoices = "create_greeting" | "update_greeting" | "delete_greeting" | "bulk_start_greeting" | "close_greeting" | "bulk_stop_greeting" | "stop_greeting" | "start_greeting"

type VisitChoices = "start_day" | "end_day" | "visit_in" | "visit_out" | "close_visit" | "view_visit" | "validate_visit" | "add_summary" | "edit_summary" | "add_ankit_input" | "view_comments" | "view_visit_photo" | "mark_attendence" | "upload_samples"


type TodoChoices = "delete_bulk_todo" | "bulk_start_todo" | "close_todo" | "bulk_stop_todo" | "add_reply" | "view_replies" | "view_contacts"

type CheckListChoices = "create_checklist" | "add_more_check_boxes" | "delete_checklist" | "close_checklist" | "edit_checklist" | "view_checklist_boxes" | "check_my_boxes"


type LeadChoices = "create_or_edit_refer" | "create_or_edit_source" | "delete_crm_item" | "view_remarks" | "close_lead" | "create_or_edit_leadtype" | "delete_lead"  | "delete_leadtype" | "create_refer" | "convert_lead_to_refer" | "delete_refer" | "view_referrals"   |"delete_crm_state"|
   "refer_lead" | "remove_referral" | "assign_refer" | "bulk_assign_leads" | "bulk_assign_refers" | "delete_remark" | "create_or_edt_remark" | "create_or_edit_lead" | "create_or_edit_state" | "create_or_edit_stage" | "bulk_assign_crm_states" | "add_card_comment"

type ProductionChoices = "create_machine" | "close_production" | "update_machine" | "create_article" | "update_article" | "create_dye" | "update_dye" | "toogle_machine" | "toogle_article" | "toogle_dye" | "delete_production" | "create_production" | "update_production"

type TemplateChoices = "create_template" | "update_template" | "delete_template" | "view_template" | "close_template" | "view_template"



type ChoiceState = UserChoices | LeadChoices | TemplateChoices | VisitChoices | CheckListChoices | GreetingChoices | ProductionChoices | TodoChoices

const initialState: ChoiceState | null = null


export enum ProductionChoiceActions {
  create_machine = "create_machine",
  update_machine = "update_machine",
  create_article = "create_article",
  update_article = "update_article",
  create_dye = "create_dye",
  update_dye = "update_dye",
  toogle_machine = "toogle_machine",
  toogle_article = "toogle_article",
  toogle_dye = "toogle_dye",
  close_production = "close_production",
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

export enum TodoChoiceActions {
  delete_bulk_todo = "delete_bulk_todo",
  bulk_start_todo = "bulk_start_todo",
  close_todo = "close_todo",
  bulk_stop_todo = "bulk_stop_todo",
  add_reply = "add_reply",
  view_replies = "view_replies",
  view_contacts = "view_contacts"

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



export enum LeadChoiceActions {
  create_or_edit_lead = "create_or_edit_lead",
  create_or_edit_state = "create_or_edit_state",
  delete_crm_state ="delete_crm_state",
  create_or_edit_stage = "create_or_edit_stage",
  create_or_edit_refer = "create_or_edit_refer",
  create_or_edit_source = "create_or_edit_source",
  delete_lead = "delete_lead",
  delete_remark = "delete_remark",
  create_or_edt_remark = "create_or_edt_remark",
  view_remarks = "view_remarks",
  close_lead = "close_lead",
  create_or_edit_leadtype = "create_or_edit_leadtype",
  delete_crm_item = "delete_crm_item",
  delete_leadtype = "delete_leadtype",
  create_refer = "create_refer",
  convert_lead_to_refer = "convert_lead_to_refer",
  delete_refer = "delete_refer",
  view_referrals = "view_referrals",
  refer_lead = "refer_lead",
  remove_referral = "remove_referral",
  assign_refer = "assign_refer",
  bulk_assign_leads = "bulk_assign_leads",
  bulk_assign_refers = "bulk_assign_refers",
  bulk_assign_crm_states = "bulk_assign_crm_states",
  add_card_comment = "add_card_comment"
}

export enum UserChoiceActions {
  bulk_assign_erp_states = "bulk_assign_erp_states",
  assign_users = "assign_users",
  signup = "signup",
  toogle_show_visitingcard ="toogle_show_visitingcard",
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
  reset_multi_login = "reset_multi_login",
  create_or_edit_erpstate = "create_or_edit_erpstate",
  update_state = "update_state",
  delete_state = "delete_state"

}

type Action = {
  type: UserChoiceActions |
  LeadChoiceActions | TemplateChoiceActions | CheckListChoiceActions | VisitChoiceActions | GreetingChoiceActions | TodoChoiceActions | ProductionChoiceActions
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
    case UserChoiceActions.refresh_whatsapp: return type
    case UserChoiceActions.make_admin: return type
    case UserChoiceActions.control_access: return type
    case UserChoiceActions.remove_admin: return type
    case UserChoiceActions.delete_user: return type
    case UserChoiceActions.close_user: return type
    case UserChoiceActions.update_user_password: return type
    case UserChoiceActions.reset_multi_login: return type
    case UserChoiceActions.assign_users: return type
    case UserChoiceActions.block_multi_login: return type
    case UserChoiceActions.create_or_edit_erpstate: return type
    case UserChoiceActions.update_state: return type
    case UserChoiceActions.delete_state: return type
    case UserChoiceActions.bulk_assign_erp_states: return type
    case UserChoiceActions.toogle_show_visitingcard: return type

    // lead dialog choices
    case LeadChoiceActions.create_or_edit_refer: return type
    case LeadChoiceActions.create_or_edit_source: return type
    case LeadChoiceActions.view_remarks: return type
    case LeadChoiceActions.delete_crm_item: return type
    case LeadChoiceActions.create_or_edit_leadtype: return type
    case LeadChoiceActions.delete_lead: return type
    case LeadChoiceActions.delete_leadtype: return type
    case LeadChoiceActions.close_lead: return type
    case LeadChoiceActions.create_refer: return type
    case LeadChoiceActions.convert_lead_to_refer: return type
    case LeadChoiceActions.delete_refer: return type
    case LeadChoiceActions.view_referrals: return type
    case LeadChoiceActions.refer_lead: return type
    case LeadChoiceActions.remove_referral: return type
    case LeadChoiceActions.assign_refer: return type
    case LeadChoiceActions.delete_remark: return type
    case LeadChoiceActions.create_or_edt_remark: return type
    case LeadChoiceActions.bulk_assign_leads: return type
    case LeadChoiceActions.bulk_assign_refers: return type
    case LeadChoiceActions.create_or_edit_lead: return type
    case LeadChoiceActions.create_or_edit_state: return type
    case LeadChoiceActions.create_or_edit_stage: return type
    case LeadChoiceActions.bulk_assign_crm_states: return type
    case LeadChoiceActions.add_card_comment: return type
    case LeadChoiceActions.delete_crm_state: return type

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
    case ProductionChoiceActions.create_production: return type
    case ProductionChoiceActions.update_production: return type
    case ProductionChoiceActions.delete_production: return type

    // template choice action
    case TemplateChoiceActions.create_template: return type
    case TemplateChoiceActions.update_template: return type
    case TemplateChoiceActions.delete_template: return type
    case TemplateChoiceActions.close_template: return type
    case TemplateChoiceActions.view_template: return type

    //greeeting
    case GreetingChoiceActions.create_greeting: return type
    case GreetingChoiceActions.update_greeting: return type
    case GreetingChoiceActions.delete_greeting: return type
    case GreetingChoiceActions.close_greeting: return type
    case GreetingChoiceActions.bulk_start_greeting: return type
    case GreetingChoiceActions.bulk_stop_greeting: return type
    case GreetingChoiceActions.start_greeting: return type
    case GreetingChoiceActions.stop_greeting: return type

    //todos
    case TodoChoiceActions.delete_bulk_todo: return type
    case TodoChoiceActions.close_todo: return type
    case TodoChoiceActions.bulk_start_todo: return type
    case TodoChoiceActions.bulk_stop_todo: return type
    case TodoChoiceActions.view_replies: return type
    case TodoChoiceActions.add_reply: return type
    case TodoChoiceActions.view_contacts: return type

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