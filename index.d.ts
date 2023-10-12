import { IUser } from "./types/index"


declare  global {
    namespace Express {
        export interface Request {
            user: IUser | null
        }
    }
}