import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"

export function useBotFields() {
    const { user } = useContext(UserContext)
    let hiddenFields = user?.bot_fields.map((field) => {
        if (field.hidden)
            return field.field
        else
            return ""
    })

    let readonlyFields = user?.bot_fields.map((field) => {
        if (field.readonly)
            return field.field
        else
            return undefined
    })

    return { hiddenFields, readonlyFields }
}