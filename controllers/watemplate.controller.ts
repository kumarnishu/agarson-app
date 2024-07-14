import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { IMessageTemplate, MessageTemplate } from "../models/watemplates/watemplate.model"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { destroyFile } from "../utils/destroyFile.util"
import { TemplateCategoryField } from "../models/watemplates/categories.model"


export const GetMessagetemplatesCategories = async (req: Request, res: Response, next: NextFunction) => {
    let categoryObj = await TemplateCategoryField.findOne()
    return res.status(200).json(categoryObj)
}

export const UpdateMessagetemplatesCategories = async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = req.body as { categories: string[] }
    console.log(categories)
    await TemplateCategoryField.findOneAndRemove()
    let cat = new TemplateCategoryField({ categories: categories })
    cat.created_at = new Date()
    cat.updated_at = new Date()
    if (req.user) {
        cat.created_by = req.user
        cat.updated_by = req.user
    }
    await cat.save()
    return res.status(200).json({ message: "updated categories" })
}

export const GetMessagetemplates = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let category = req.query.category
    let templates: IMessageTemplate[] = []
    if (limit && category) {
        templates = await MessageTemplate.find({ category: category }).limit(limit)
    }
    else if (category && !limit) {
        templates = await MessageTemplate.find({ category: category })
    }
    else
        templates = await MessageTemplate.find()
    return res.status(200).json(templates)
}

export const CreateMessagetemplate = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name, message, caption, category } = body as Request['body'] & IMessageTemplate
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
    template.category = category
    await template.save()
    return res.status(201).json(template)
}

export const UpdateMessagetemplate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct template id" })
    }
    let body = JSON.parse(req.body.body)
    let { name, message, category, caption } = body as Request['body'] & IMessageTemplate
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
    let newcategory = template.category
    if (category)
        newcategory = category
    if (req.user)
        await MessageTemplate.findByIdAndUpdate(template?._id, {
            name: name,
            message: message,
            caption: caption,
            media: media,
            updated_at: new Date(),
            updated_by: req.user,
            category: newcategory
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




