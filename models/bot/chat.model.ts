import mongoose from "mongoose"
import { IChat } from "../../types/chat.types"


const ChatsSchema = new mongoose.Schema<IChat, mongoose.Model<IChat, {}, {}>, {}>({
    from: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
   
    body: {
        type: String,
        index: true,
    },
   
    author: {
        type: String,
        trim: true,
        index: true,
    },
    hasMedia: {
        type: Boolean,
        default: false
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: new Date(),
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,
    }
})

export const Chat = mongoose.model<IChat, mongoose.Model<IChat, {}, {}>>("Chat", ChatsSchema)