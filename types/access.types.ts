export type AccessType = {
    feature: string,
    is_editable: boolean,
    is_readonly: boolean,
    is_hidden: boolean,
    is_deletion_allowed: boolean
}

export const Features = ["users", "crm", "contacts", "reminders", "templates", "alps", "broadcast", "backup", "bot"]