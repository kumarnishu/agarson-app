import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { ILead } from "./lead.model"
import { IReferredParty } from "./referred.model"
import { IArticle } from "../production/article.model"


export type IBill = {
    _id: string,
    articles: { article: IArticle, qty: number, rate: number }[],
    lead: ILead,
    billphoto: Asset,
    refer: IReferredParty,
    bill_no: string,
    bill_date: Date,
    created_at: Date,
    remind_date: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}

const BillSchema = new mongoose.Schema<IBill, mongoose.Model<IBill, {}, {}>, {}>({
    bill_no: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    },
    articles: [{
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }, qty: Number, rate: Number
    }],
    billphoto: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    bill_date: {
        type: Date,
        required: true
    },
    remind_date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    refer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferredParty'
    }
})

export const Bill = mongoose.model<IBill, mongoose.Model<IBill, {}, {}>>("Bill", BillSchema)