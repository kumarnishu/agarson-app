import { Asset } from "./asset.types";

export type ITask = {
    _id: string,
    serial_number: string,
    name: string,
    city: string,
    mobile: string,
    gst: string,
    media: Asset,
    created_at: Date
}


export type IAlpsBody = Request['body'] & ITask;