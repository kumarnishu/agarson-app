import mongoose from "mongoose"
import { IProduction } from "../../types/production.types"


const ProductionSchema = new mongoose.Schema<IProduction, mongoose.Model<IProduction, {}, {}>, {}>({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    thekedar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    manpower: Number,
    production: Number,
    big_repair: Number,
    small_repair: Number,
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

export const Production = mongoose.model<IProduction, mongoose.Model<IProduction, {}, {}>>("Production", ProductionSchema)