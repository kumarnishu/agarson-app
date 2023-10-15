import { AlpsAccess, BackupAccess, BotAccess, BroadcastAccess, ContactsAccess, CrmAccess, RemindersAccess, TemplatesAccess, UserAccess } from "./access.types"
import { Asset } from "./asset.types"

export type IUser = {
    //user properties
    _id: string,
    username: string,
    password: string,
    email: string,
    mobile: string,
    dp: Asset,
    client_id: string,
    client_data_path: string,
    connected_number: string,
    is_whatsapp_active: Boolean,
    is_admin: Boolean,
    user_access_fields: UserAccess,
    crm_access_fields: CrmAccess,
    contacts_access_fields: ContactsAccess,
    templates_access_fields: TemplatesAccess,
    bot_access_fields: BotAccess,
    broadcast_access_fields: BroadcastAccess,
    backup_access_fields: BackupAccess,
    reminders_access_fields: RemindersAccess,
    alps_access_fields: AlpsAccess,
    email_verified: Boolean,
    is_active: Boolean,
    last_login: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
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