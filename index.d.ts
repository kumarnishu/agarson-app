import { IUser } from "./types/user.types";


declare  global {
    namespace Express {
        export interface Request {
            user: IUser | null
        }
    }
}