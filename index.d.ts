import { IUser } from "./models/users/user.model";

declare  global {
    namespace Express {
        export interface Request {
            user: IUser | null
        }
    }
}