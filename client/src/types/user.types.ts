import { FeatureAccess } from "./access.types"
import { Asset } from "./asset.types"

export type IUser = {
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
    user_access_fields: FeatureAccess,
    crm_access_fields: FeatureAccess,
    productions_access_fields: FeatureAccess,
    templates_access_fields: FeatureAccess,
    passwords_access_fields: FeatureAccess,
    bot_access_fields: FeatureAccess,
    backup_access_fields: FeatureAccess,
    reminders_access_fields: FeatureAccess,
    reports_access_fields: FeatureAccess,
    checklists_access_fields: FeatureAccess,
    greetings_access_fields: FeatureAccess,
    visit_access_fields: FeatureAccess,
    email_verified: Boolean,
    mobile_verified: Boolean,
    is_active: Boolean,
    last_login: Date,
    multi_login_token: string | null,
    is_multi_login: boolean,
    assigned_users: IUser[]
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

