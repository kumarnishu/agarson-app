export type FeatureAccess = {
    is_editable: boolean,
    is_hidden: boolean,
    is_deletion_allowed: boolean
}
export enum Feature {
    users = "users",
    todos = "todos",
    tasks = "tasks",
    crm = "crm",
    checklists = "checklists",
    productions = "productions",
    reports = "reports",
    visit = "visit",
    contacts = "contacts",
    bot = "wa bot",
    broadcast = "broadcast",
    reminders = "reminders",
    backup = "backup",
    alps = "alps",
    greetings = "greetings",
    templates = "templates",
    erp_login = "erp login",
}