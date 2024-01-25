export type FeatureAccess = {
    is_editable: boolean,
    is_hidden: boolean,
    is_deletion_allowed: boolean
}
export enum Feature {
    users = "users",
    crm = "crm",
    checklists = "checklists",
    productions = "productions",
    visit = "visit",
    todos = "todos",
    backup = "backup",
    templates = "templates",
    erp_reports = "erp reports",
}