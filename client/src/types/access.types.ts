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
    reports = "reports",
    visit = "visit",
    bot = "bot",
    todos = "todos",
    backup = "backup",
    greetings = "greetings",
    templates = "templates",
    erp_login = "erp login",
}
