import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"

export function useAccessFieldsHooks() {
    const { user } = useContext(UserContext)
    let backup_access_fields = user?.backup_access_fields
    let user_access_fields = user?.user_access_fields
    let crm_access_fields = user?.crm_access_fields
    let bot_access_fields = user?.bot_access_fields
    let contacts_access_fields = user?.contacts_access_fields
    let reminders_access_fields = user?.reminders_access_fields
    let broadcast_access_fields = user?.broadcast_access_fields
    let templates_access_fields = user?.templates_access_fields

    return { backup_access_fields, user_access_fields, crm_access_fields, bot_access_fields, contacts_access_fields, reminders_access_fields, broadcast_access_fields, templates_access_fields }
}