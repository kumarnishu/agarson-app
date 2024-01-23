import React, { useReducer } from "react"

type UserMenu = "profile_menu" | "close_user_menu" | "user_menu"
type CrmMenu = | "close_crm_menu" | "crm_menu"
type VisitMenu = | "close_visit_menu" | "visit_menu"
type ReportMenu = | "close_report_menu" | "report_menu"
type CheckListMenu = "close_checklist_menu" | "checklist_menu"
type ProductionMenu = "close_production_menu" | "production_menu"


type MenuState = {
    type: UserMenu | CrmMenu | CheckListMenu | null | VisitMenu | ReportMenu | ProductionMenu
    anchorEl: HTMLElement | null
}

const initialState: MenuState = {
    type: null,
    anchorEl: null
}

export enum ProductionMenuActions {
    close_production_menu = "close_production_menu",
    production_menu = "production_menu"
}
export enum CheckListMenuActions {
    close_checklist_menu = "close_checklist_menu",
    checklist_menu = "checklist_menu"
}
export enum ErpMenuActions {
    close_erp_menu = "close_erp_menu",
    erp_menu = "erp_menu"
}
export enum TodoMenuActions {
    close_todo_menu = "close_todo_menu",
    todo_menu = "todo_menu"
}
export enum VisitMenuActions {
    close_visit_menu = "close_visit_menu",
    visit_menu = "visit_menu"
}
export enum ReportsMenuActions {
    close_report_menu = "close_report_menu",
    report_menu = "report_menu"
}
export enum TaskMenuActions {
    close_task_menu = "close_task_menu",
    task_menu = "task_menu"
}


export enum BotMenuActions {
    close_bot_menu = "close_bot_menu",
    bot_menu = "bot_menu"
}
export enum CrmMenuActions {
    close_crm_menu = "close_crm_menu",
    crm_menu = "crm_menu"
}

export enum UserMenuActions {
    profile_menu = "profile_menu",
    close_user_menu = "close_user_menu",
    user_menu = "user_menu"
}

type Action = {
    type: UserMenuActions | CrmMenuActions | CheckListMenuActions | ReportsMenuActions | VisitMenuActions  | ProductionMenuActions
    anchorEl: HTMLElement | null
}

// reducer
function reducer(state: MenuState | null, action: Action) {
    let type = action.type
    switch (type) {
        // user dialogs menus
        case UserMenuActions.profile_menu: return action
        case UserMenuActions.close_user_menu: return action
        case UserMenuActions.user_menu: return action


        // lead dialog menus

        case CrmMenuActions.close_crm_menu: return action
        case CrmMenuActions.crm_menu: return action

        case ProductionMenuActions.close_production_menu: return action
        case ProductionMenuActions.production_menu: return action

        // visit
        case VisitMenuActions.close_visit_menu: return action
        case VisitMenuActions.visit_menu: return action

        case ReportsMenuActions.close_report_menu: return action
        case ReportsMenuActions.report_menu: return action

        // checklist menu action
        case CheckListMenuActions.close_checklist_menu: return action
        case CheckListMenuActions.checklist_menu: return action

     
        default: return state
    }
}
// context
type Context = {
    menu: MenuState | null,
    setMenu: React.Dispatch<Action>
}
export const MenuContext = React.createContext<Context>(
    {
        menu: { type: null, anchorEl: null },
        setMenu: () => null
    }
)
// provider
export function MenuProvider(props: { children: JSX.Element }) {
    const [menu, setMenu] = useReducer(reducer, initialState)
    return (
        <MenuContext.Provider value={{ menu, setMenu }}>
            {props.children}
        </MenuContext.Provider>
    )

}
