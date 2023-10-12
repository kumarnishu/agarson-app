import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { destroyFile } from "../utils/destroyFile.util"
import { IMessageTemplateBody } from "../types/template.types"


export const CreateMessagetemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, categories } = body as IMessageTemplateBody
    if (!name) {
        return res.status(400).json({ message: "template name required" })
    }
    let templ = await MessageTemplate.findOne({ name: name })
    if (templ) {
        return res.status(403).json({ message: "template already exists with this name" })
    }
    let template = new MessageTemplate({
        name: name,
        message: message,
        caption: caption
    })
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        const storageLocation = `watemplates/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            template.media = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    template.created_at = new Date()
    template.updated_at = new Date()
    if (req.user) {
        template.created_by = req.user
        template.updated_by = req.user
    }
    template.categories = categories
    await template.save()
    return res.status(201).json(template)
}

export const UpdateMessagetemplate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct template id" })
    }
    let body = JSON.parse(req.body.body)
    let { name, message, categories, caption } = body as IMessageTemplateBody
    if (!name) {
        return res.status(400).json({ message: "template name required" })
    }
    let template = await MessageTemplate.findById(id)
    if (template?.name !== name) {
        let templ = await MessageTemplate.findOne({ name: name })
        if (templ) {
            return res.status(403).json({ message: "template already exists with this name" })
        }
    }
    if (!template)
        return res.status(404).json({ message: 'template not found' })
    let media = template.media
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
        const storageLocation = `watemplates/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (template.media && template.media?._id)
                await destroyFile(template.media._id)
            media = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let newcategories = template.categories
    if (categories)
        newcategories = categories
    if (req.user)
        await MessageTemplate.findByIdAndUpdate(template?._id, {
            name: name,
            message: message,
            caption: caption,
            media: media,
            updated_at: new Date(),
            updated_by: req.user,
            categories: newcategories
        })

    return res.status(200).json({ message: "template updated" })
}

export const DeleteMessagetemplate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct template id" })
    }
    let template = await MessageTemplate.findById(id)
    if (!template)
        return res.status(404).json({ message: "template not exists" })
    if (template.media && template.media?._id)
        await destroyFile(template.media._id)
    await template.remove()
    return res.status(200).json("message template deleted")
}

export const GetMessagetemplates = async (req: Request, res: Response, next: NextFunction) => {
    let templates = await MessageTemplate.find()
    return res.status(200).json(templates)
}


