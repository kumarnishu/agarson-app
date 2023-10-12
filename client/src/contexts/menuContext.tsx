import React, { useReducer } from "react"

type UserMenu = "profile_menu"  | "close_user_menu" | "user_menu"

type CrmMenu = | "close_crm_menu" | "crm_menu"

type TemplateMenu ="close_template_menu" | "template_menu"
type BotMenu =  "close_bot_menu" | "bot_menu"

type BroadcastMenu =  "close_broadcast_menu" | "broadcast_menu"


type MenuState = {
    type: UserMenu | CrmMenu | BotMenu | TemplateMenu | BroadcastMenu  | null,
    anchorEl: HTMLElement | null
}

const initialState: MenuState = {
    type: null,
    anchorEl: null
}

export enum TemplateMenuActions {
    close_template_menu = "close_template_menu",
    template_menu = "template_menu"
}
export enum BroadcastMenuActions {
    close_broadcast_menu = "close_broadcast_menu",
    broadcast_menu = "broadcast_menu"
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
    type: UserMenuActions | CrmMenuActions | BotMenuActions | TemplateMenuActions | BroadcastMenuActions 
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


        //bot menu actions

        case BotMenuActions.close_bot_menu: return action
        case BotMenuActions.bot_menu: return action



        // template menu action
        case TemplateMenuActions.close_template_menu: return action
        case TemplateMenuActions.template_menu: return action


        // broadcast menu action
        case BroadcastMenuActions.close_broadcast_menu: return action
        case BroadcastMenuActions.broadcast_menu: return action


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
