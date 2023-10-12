import { Edge, Node } from "reactflow"
import { IUser } from "./user.types"

export type FlowNode = {
    id: string,
    data: any,
    type: "DefaultNode" | "MenuNode" | "StartNode" | "OutputNode" | "CommonNode"
    parentNode: string
}
export type IFlow = {
    _id?: string,
    flow_name: string,
    trigger_keywords: string,
    created_by?: IUser,
    created_at?: Date,
    updated_at?: Date,
    updated_by?: IUser,
    nodes: Node[],
    edges: Edge[],
    is_active?: boolean,
    connected_users?: IUser[]
}

export type IKeywordTracker = {
    _id: string,
    phone_number: string,
    bot_number: string,
    is_active: boolean,
    skip_main_menu: boolean,
    flow: IFlow,
    updated_at: Date
}
export type IMenuTracker = {
    _id: string,
    phone_number: string,
    bot_number: string,
    customer_name: string,
    is_active: boolean,
    menu_id: string,
    flow: IFlow,
    updated_at: Date
}