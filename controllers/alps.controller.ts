import { NextFunction, Request, Response } from "express"
import { Alps } from "../models/alps/alps.model"
import isMongoId from "validator/lib/isMongoId"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { destroyFile } from "../utils/destroyFile.util"
import { IAlps, IAlpsBody } from "../types/alps.types"

export const CreateAlpsRecord = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, mobile, city, gst } = body as IAlpsBody
    if (!name || !mobile || !city || !gst) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let count = await Alps.countDocuments()

    let bill = new Alps({
        name: name,
        mobile: mobile,
        city: city,
        gst: gst,
        serial_number: String(count + 1)
    })
    if (!req.file) {
        return res.status(400).json({ message: "please provide bill" })
    }
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        const storageLocation = `waalps/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            bill.media = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    bill.created_at = new Date()
    await bill.save()
    return res.status(201).json(bill)
}

export const DeleteAlpsRecord = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct bill id" })
    }
    let bill = await Alps.findById(id)
    if (!bill)
        return res.status(404).json({ message: "record not exists" })
    if (bill.media && bill.media?._id)
        await destroyFile(bill.media._id)
    await bill.remove()
    return res.status(200).json("record deleted")
}


export const FuzzySearchAlpss = async (req: Request, res: Response, next: NextFunction) => {
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let alps: IAlps[] = []

    if (key.length == 1 || key.length > 4) {
        alps = await Alps.find({
            $or: [
                { serial_number: { $regex: key[0], $options: 'i' } },
                { name: { $regex: key[0], $options: 'i' } },
                { city: { $regex: key[0], $options: 'i' } },
                { mobile: { $regex: key[0], $options: 'i' } },
                { gst: { $regex: key[0], $options: 'i' } },
            ]
        }
        ).sort('-created_at')
    }
    if (key.length == 2) {
        alps = await Alps.find({
            $and: [
                {
                    $or: [
                        { serial_number: { $regex: key[1], $options: 'i' } },
                        { name: { $regex: key[1], $options: 'i' } },
                        { city: { $regex: key[1], $options: 'i' } },
                        { mobile: { $regex: key[1], $options: 'i' } },
                        { gst: { $regex: key[1], $options: 'i' } },

                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[1], $options: 'i' } },
                        { name: { $regex: key[1], $options: 'i' } },
                        { city: { $regex: key[1], $options: 'i' } },
                        { mobile: { $regex: key[1], $options: 'i' } },
                        { gst: { $regex: key[1], $options: 'i' } },
                    ]
                }
            ]
            ,

        }
        ).sort('-created_at')
    }
    if (key.length == 3) {
        alps = await Alps.find({
            $and: [
                {
                    $or: [
                        { serial_number: { $regex: key[2], $options: 'i' } },
                        { name: { $regex: key[2], $options: 'i' } },
                        { city: { $regex: key[2], $options: 'i' } },
                        { mobile: { $regex: key[2], $options: 'i' } },
                        { gst: { $regex: key[2], $options: 'i' } },

                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[2], $options: 'i' } },
                        { name: { $regex: key[2], $options: 'i' } },
                        { city: { $regex: key[2], $options: 'i' } },
                        { mobile: { $regex: key[2], $options: 'i' } },
                        { gst: { $regex: key[2], $options: 'i' } },
                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[2], $options: 'i' } },
                        { name: { $regex: key[2], $options: 'i' } },
                        { city: { $regex: key[2], $options: 'i' } },
                        { mobile: { $regex: key[2], $options: 'i' } },
                        { gst: { $regex: key[2], $options: 'i' } },
                    ]
                }
            ]
            ,

        }
        ).sort('-created_at')
    }
    if (key.length == 4) {
        alps = await Alps.find({
            $and: [
                {
                    $or: [
                        { serial_number: { $regex: key[3], $options: 'i' } },
                        { name: { $regex: key[3], $options: 'i' } },
                        { city: { $regex: key[3], $options: 'i' } },
                        { mobile: { $regex: key[3], $options: 'i' } },
                        { gst: { $regex: key[3], $options: 'i' } },

                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[3], $options: 'i' } },
                        { name: { $regex: key[3], $options: 'i' } },
                        { city: { $regex: key[3], $options: 'i' } },
                        { mobile: { $regex: key[3], $options: 'i' } },
                        { gst: { $regex: key[3], $options: 'i' } },
                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[3], $options: 'i' } },
                        { name: { $regex: key[3], $options: 'i' } },
                        { city: { $regex: key[3], $options: 'i' } },
                        { mobile: { $regex: key[3], $options: 'i' } },
                        { gst: { $regex: key[3], $options: 'i' } },
                    ]
                },
                {
                    $or: [
                        { serial_number: { $regex: key[3], $options: 'i' } },
                        { name: { $regex: key[3], $options: 'i' } },
                        { city: { $regex: key[3], $options: 'i' } },
                        { mobile: { $regex: key[3], $options: 'i' } },
                        { gst: { $regex: key[3], $options: 'i' } },
                    ]
                }
            ]
            ,

        }
        ).sort('-created_at')
    }

    return res.status(200).json(alps)
}


export const GetAlpss = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let alps = await Alps.find({ is_customer: false }).sort('-created_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)

        let count = await Alps.countDocuments()
        return res.status(200).json({
            alps,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(500).json({ message: "bad request" })

}