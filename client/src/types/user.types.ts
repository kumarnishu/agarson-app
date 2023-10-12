import { AccessType } from "./access.types"
import { Asset } from "./asset.types"

export type IUser = {
    //user properties
    _id: string,
    username: string,
    password: string,
    email: string,
    mobile: string,
    dp: Asset,
    //bot properties
    client_id: string,
    client_data_path: string,
    connected_number: string,
    is_whatsapp_active: Boolean,
    //auth properties
    is_admin: Boolean,
    access_fields: AccessType[],
   
    email_verified: Boolean,
    is_active: Boolean,
    last_login: Date,
    created_at: Date,
    updated_at: Date,
    //ref properties
    created_by_username: string,
    created_by: IUser,
    updated_by_username: string,
    updated_by: IUser
    //tokens
    resetPasswordToken: string | null,
    resetPasswordExpire: Date | null,
    emailVerifyToken: string | null,
    emailVerifyExpire: Date | null
}
export type IUserMethods = {
    getAccessToken: () => string,
    comparePassword: (password: string) => boolean,
    getResetPasswordToken: () => string,
    getEmailVerifyToken: () => string
}
export type TUserBody = Request['body'] & IUser;