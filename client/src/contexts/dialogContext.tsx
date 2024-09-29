import React, { useReducer } from "react"

type UserChoices = "signup" | "reset_password_mail" | "close_user" | "new_user" | "update_user" | "update_profile" | "view_profile" | "update_password" | "reset_password" | "verify_email" | "control_access" | "delete_user" | "toogle_flow_status" | "create_or_edit_erpstate" | "update_state" | "delete_erp_state" |
  "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "refresh_whatsapp" | "update_user_password" | "block_multi_login" | "reset_multi_login" | "assign_users" | "bulk_assign_erp_states" | "toogle_show_visitingcard" | "assign_permissions" | "bulk_assign_permissions" |"delete_role"


type GreetingChoices = "create_greeting" | "update_greeting" | "delete_greeting" | "bulk_start_greeting" | "close_greeting" | "bulk_stop_greeting" | "stop_greeting" | "start_greeting"

type VisitChoices = "start_day" | "end_day" | "visit_in" | "visit_out" | "close_visit" | "view_visit" | "validate_visit" | "add_summary" | "edit_summary" | "add_ankit_input" | "view_comments" | "view_visit_photo" | "mark_attendence" | "upload_samples"


type TodoChoices = "delete_bulk_todo" | "bulk_start_todo" | "close_todo" | "bulk_stop_todo" | "add_reply" | "view_replies" | "view_contacts"

type CheckListChoices = "create_or_edit_checklist" | "create_or_edit_checklist_category" | "delete_checklist" | "close_checklist" | "edit_checklist" | "delete_checklist_category" | "toogle_checklist"


type LeadChoices = "create_or_edit_refer" |"create_or_edit_leadtype"| "create_or_edit_source" | "delete_crm_item" | "view_remarks" | "close_lead" | "create_or_edit_city" | "bulk_assign_crm_cities" | "find_unknown_stages" | "create_or_edit_bill" | "convert_lead_to_refer" | "bulk_delete_useless_leads" | "view_referrals" | "delete_crm_state" |"find_unknown_cities"|
  "refer_lead" | "remove_referral" | "assign_refer" | "bulk_assign_leads" | "bulk_assign_refers" | "delete_remark" | "create_or_edt_remark" | "create_or_edit_lead" | "create_or_edit_state" | "create_or_edit_stage" | "bulk_assign_crm_states" | "find_unknown_states" | "merge_leads" | "view_refer_remarks" | "delete_bill" |"view_bills"


type ProductionChoices = "create_machine" | "close_production" | "update_machine" | "create_article" | "update_article" | "create_dye" | "update_dye" | "validate_weight" | "toogle_machine" | "toogle_article" | "toogle_dye" | "view_shoe_photo" | "view_shoe_photo2" | "view_shoe_photo3" | "create_shoe_weight" | "delete_production" | "update_shoe_weight1" | "create_production" | "update_production" | "delete_weight" | "create_or_edit_location" | "delete_dye_location" | "update_shoe_weight2" | "update_shoe_weight3"


type TemplateChoices = "create_template" | "update_template" | "delete_template" | "view_template" | "close_template" | "view_template"



type ChoiceState = UserChoices | LeadChoices | TemplateChoices | VisitChoices | CheckListChoices | GreetingChoices | ProductionChoices | TodoChoices

const initialState: ChoiceState | null = null


export enum ProductionChoiceActions {
  validate_weight = "validate_weight",
  delete_weight ="delete_weight",
  create_or_edit_location="create_or_edit_location",
  delete_dye_location ="delete_dye_location",
  create_machine = "create_machine",
  view_shoe_photo = "view_shoe_photo",
  view_shoe_photo2 = "view_shoe_photo2",
  view_shoe_photo3 = "view_shoe_photo3",
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
  update_shoe_weight1 = "update_shoe_weight1",
  update_shoe_weight2 = "update_shoe_weight2",
  update_shoe_weight3 = "update_shoe_weight3",
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
  create_or_edit_checklist = "create_or_edit_checklist",
  create_or_edit_checklist_category = "create_or_edit_checklist_category",
  delete_checklist = "delete_checklist",
  close_checklist = "close_checklist",
  edit_checklist = "edit_checklist",
  delete_checklist_category = "delete_checklist_category",
  toogle_checklist = "toogle_checklist"
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
  view_bills ="view_bills",
  create_or_edit_state = "create_or_edit_state",
  delete_crm_state ="delete_crm_state",
  create_or_edit_stage = "create_or_edit_stage",
  create_or_edit_refer = "create_or_edit_refer",
  create_or_edit_source = "create_or_edit_source",
  bulk_assign_crm_cities = "bulk_assign_crm_cities",
  delete_remark = "delete_remark",
  create_or_edt_remark = "create_or_edt_remark",
  view_remarks = "view_remarks",
  close_lead = "close_lead",
  create_or_edit_city = "create_or_edit_city",
  delete_crm_item = "delete_crm_item",
  find_unknown_stages = "find_unknown_stages",
  find_unknown_cities = "find_unknown_cities",
  create_or_edit_bill = "create_or_edit_bill",
  create_or_edit_leadtype ="create_or_edit_leadtype",
  convert_lead_to_refer = "convert_lead_to_refer",
  bulk_delete_useless_leads = "bulk_delete_useless_leads",
  view_referrals = "view_referrals",
  refer_lead = "refer_lead",
  remove_referral = "remove_referral",
  assign_refer = "assign_refer",
  bulk_assign_leads = "bulk_assign_leads",
  bulk_assign_refers = "bulk_assign_refers",
  bulk_assign_crm_states = "bulk_assign_crm_states",
  find_unknown_states = "find_unknown_states",
  merge_leads ="merge_leads",
  view_refer_remarks="view_refer_remarks",
  delete_bill ="delete_bill"
}

export enum UserChoiceActions {
  bulk_assign_erp_states = "bulk_assign_erp_states",
  assign_users = "assign_users",
  assign_permissions="assign_permissions",
  bulk_assign_permissions= "bulk_assign_permissions",
  delete_role ="delete_role",
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
  delete_erp_state = "delete_erp_state"

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
    case UserChoiceActions.delete_erp_state: return type
    case UserChoiceActions.bulk_assign_erp_states: return type
    case UserChoiceActions.toogle_show_visitingcard: return type
    case UserChoiceActions.bulk_assign_permissions: return type
    case UserChoiceActions.assign_permissions: return type
    case UserChoiceActions.delete_role: return type

    // lead dialog choices
    case LeadChoiceActions.create_or_edit_refer: return type
    case LeadChoiceActions.create_or_edit_source: return type
    case LeadChoiceActions.view_remarks: return type
    case LeadChoiceActions.delete_crm_item: return type
    case LeadChoiceActions.create_or_edit_city: return type
    case LeadChoiceActions.bulk_assign_crm_cities: return type
    case LeadChoiceActions.find_unknown_stages: return type
    case LeadChoiceActions.close_lead: return type
    case LeadChoiceActions.create_or_edit_bill: return type
    case LeadChoiceActions.find_unknown_cities:return type
    case LeadChoiceActions.convert_lead_to_refer: return type
    case LeadChoiceActions.bulk_delete_useless_leads: return type
    case LeadChoiceActions.create_or_edit_leadtype: return type
    case LeadChoiceActions.view_referrals: return type
    case LeadChoiceActions.view_bills: return type
    case LeadChoiceActions.refer_lead: return type
    case LeadChoiceActions.remove_referral: return type
    case LeadChoiceActions.assign_refer: return type
    case LeadChoiceActions.delete_remark: return type
    case LeadChoiceActions.create_or_edt_remark: return type
    case LeadChoiceActions.bulk_assign_leads: return type
    case LeadChoiceActions.bulk_assign_refers: return type
    case LeadChoiceActions.create_or_edit_lead: return type
    case LeadChoiceActions.create_or_edit_state: return type
    case LeadChoiceActions.delete_bill: return type
    case LeadChoiceActions.create_or_edit_stage: return type
    case LeadChoiceActions.bulk_assign_crm_states: return type
    case LeadChoiceActions.find_unknown_states: return type
    case LeadChoiceActions.delete_crm_state: return type
    case LeadChoiceActions.merge_leads: return type
    case LeadChoiceActions.view_refer_remarks: return type

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
    case ProductionChoiceActions.view_shoe_photo2: return type
    case ProductionChoiceActions.view_shoe_photo3: return type
    case ProductionChoiceActions.create_production: return type
    case ProductionChoiceActions.update_production: return type
    case ProductionChoiceActions.create_shoe_weight: return type
    case ProductionChoiceActions.update_shoe_weight1: return type
    case ProductionChoiceActions.update_shoe_weight2: return type
    case ProductionChoiceActions.update_shoe_weight3: return type
    case ProductionChoiceActions.delete_production: return type
    case ProductionChoiceActions.delete_weight: return type
    case ProductionChoiceActions.create_or_edit_location: return type
    case ProductionChoiceActions.delete_dye_location: return type

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
    case CheckListChoiceActions.create_or_edit_checklist: return type
    case CheckListChoiceActions.create_or_edit_checklist_category: return type
    case CheckListChoiceActions.delete_checklist: return type
    case CheckListChoiceActions.close_checklist: return type
    case CheckListChoiceActions.edit_checklist: return type
    case CheckListChoiceActions.delete_checklist_category: return type
    case CheckListChoiceActions.toogle_checklist: return type
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