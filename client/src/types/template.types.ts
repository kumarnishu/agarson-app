import { Asset } from "./asset.types";
import { IUser } from "./user.types";

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
export type IMessage = {
    message?: string,
    caption?: string,
    media?: Asset
}
export type ITemplateCategoryField = {
    _id: string,
    categories: string[],
    updated_at: Date,
    created_at: Date,
    created_by: IUser,
    updated_by: IUser
}
export type IMessageTemplateBody = Request['body'] & IMessageTemplate;
export type IMessageBody = Request['body'] & IMessage;