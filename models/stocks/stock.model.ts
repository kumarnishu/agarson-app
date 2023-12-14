import mongoose from "mongoose"
import { IStock } from "../../types/stock.types"

const StockSchema = new mongoose.Schema<IStock, mongoose.Model<IStock, {}, {}>, {}>({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    size: String,
    weight:String,
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    color: String,
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

export const Stock = mongoose.model<IStock, mongoose.Model<IStock, {}, {}>>("Stock", StockSchema)