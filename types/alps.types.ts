import { Asset } from "./asset.types";

export type IAlps = {
    _id: string,
    serial_number: string,
    name: string,
    city: string,
    mobile: string,
    gst: string,
    media: Asset,
    created_at: Date
}


export type IAlpsBody = Request['body'] & IAlps;