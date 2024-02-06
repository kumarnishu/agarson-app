import { Asset } from "./asset.types"
import { IReferredParty } from "./crm.types"
import { IUser } from "./user.types"

export type IVisitingCard = {
    _id:string,
    name: string,
    city: string,
    state: string,
    salesman: IUser,
    refer: IReferredParty,
    comments: {
        comment: string,
        created_by: IUser,
        timestamp: Date,
    }[],
    is_closed: boolean,
    card: Asset,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}