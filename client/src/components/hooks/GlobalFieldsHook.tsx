import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"

export function useGlobalFields() {
    const { user } = useContext(UserContext)
        let hiddenFields =user?.global_fields.map((field) => {
            if (field.hidden)
                return field.field
                else
            return ""
        }) 

        let readonlyFields =user?.global_fields.map((field) => {
            if (field.readonly)
                return field.field
            else
                return undefined
        })  
        
    return { hiddenFields, readonlyFields }
}