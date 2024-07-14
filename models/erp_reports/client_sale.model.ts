import mongoose from "mongoose"
import { IState } from "./state.model"
import { IUser } from "../users/user.model"

export type ILastYearClientSaleReport = {
    _id: string,
    report_owner: IState
    account: string,
    article: string,
    oldqty: string,
    newqty: string,
    apr: string,
    may: string,
    jun: string,
    jul: string,
    aug: string,
    sep: string,
    oct: string,
    nov: string,
    dec: string,
    jan: string,
    feb: string,
    mar: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}
export type IClientSaleReport = {
    _id: string,
    report_owner: IState
    account: string,
    article: string,
    oldqty: string,
    newqty: string,
    apr: string,
    may: string,
    jun: string,
    jul: string,
    aug: string,
    sep: string,
    oct: string,
    nov: string,
    dec: string,
    jan: string,
    feb: string,
    mar: string,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser,
    status?: string
}




const ClientSaleReportSchema = new mongoose.Schema<IClientSaleReport, mongoose.Model<IClientSaleReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    account: String,
    article: String,
    oldqty: String,
    newqty: String,
    apr: String,
    may: String,
    jun: String,
    jul: String,
    aug: String,
    sep: String,
    oct: String,
    nov: String,
    dec: String,
    jan: String,
    feb: String,
    mar: String,
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
    }
})


const LastYearClientSaleReportSchema = new mongoose.Schema<ILastYearClientSaleReport, mongoose.Model<ILastYearClientSaleReport, {}, {}>, {}>({
    report_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    account: String,
    article: String,
    oldqty: String,
    newqty: String,
    apr: String,
    may: String,
    jun: String,
    jul: String,
    aug: String,
    sep: String,
    oct: String,
    nov: String,
    dec: String,
    jan: String,
    feb: String,
    mar: String,
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
    }
})

export const LastYearClientSaleReport = mongoose.model<ILastYearClientSaleReport, mongoose.Model<ILastYearClientSaleReport, {}, {}>>("LastYearClientSaleReport", LastYearClientSaleReportSchema)

export const ClientSaleReport = mongoose.model<IClientSaleReport, mongoose.Model<IClientSaleReport, {}, {}>>("ClientSaleReport", ClientSaleReportSchema)
