import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"

export function useTemplateFields() {
    const { user } = useContext(UserContext)
    let hiddenFields = user?.template_fields.map((field) => {
        if (field.hidden)
            return field.field
        else
            return ""
    })

    let readonlyFields = user?.template_fields.map((field) => {
        if (field.readonly)
            return field.field
        else
            return undefined
    })

    return { hiddenFields, readonlyFields }
}