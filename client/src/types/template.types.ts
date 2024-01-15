import { Asset } from "./asset.types";
import { IUser } from "./user.types";

export type ITemplateCategoryField = {
    _id: string,
    categories: string[],
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}


export type IMessageTemplate = {
    _id: string,
    name: string,
    message?: string,
    caption?: string,
    media?: Asset,
    category: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IMessageTemplateBody = Request['body'] & IMessageTemplate;