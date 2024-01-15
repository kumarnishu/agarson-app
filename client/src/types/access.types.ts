export type FeatureAccess = {
    is_editable: boolean,
    is_hidden: boolean,
    is_deletion_allowed: boolean
}
export enum Feature {
    users = "users",
    crm = "crm",
    checklists = "my checklists",
    productions = "productions",
    reports = "all reports",
    visit = "my visit",
    bot = "wa bot",
    reminders = "Wa reminders",
    backup = "Databse backup",
    greetings = "Wa greetings",
    templates = "Wa templates",
    erp_login = "erp login",
}