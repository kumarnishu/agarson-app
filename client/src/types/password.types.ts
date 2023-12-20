import { IUser } from "./user.types"

export type IPassword = {
    _id: string,
    state: string,
    username: string,
    password: string,
    persons: IUser[],
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

export type IPasswordBody = Request['body'] & IPassword;