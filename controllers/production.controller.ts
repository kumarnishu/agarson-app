import { NextFunction, Request, Response } from "express"
import { ShoeWeight } from "../models/production/shoe_weight.report.model"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { Machine } from "../models/production/machine.model"
import { Article } from "../models/production/article.model"
import { Dye } from "../models/production/dye.types"

//get
export const GetMachines = async (req: Request, res: Response, next: NextFunction) => {
    let machines = await Machine.find({active:true}).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(machines)
}
export const GetArticles = async (req: Request, res: Response, next: NextFunction) => {
    let articles = await Article.find({active:true}).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(articles)
}

export const GetDyes = async (req: Request, res: Response, next: NextFunction) => {
    let dyes = await Dye.find({active:true}).populate('created_by').populate('updated_by').sort('dye_number')
    return res.status(200).json(dyes)
}
export const GetShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let weights = await ShoeWeight.find().populate('created_by').populate('updated_by').sort('dye_number')
    return res.status(200).json(weights)
}

//post/put/patch/delete
export const CreateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Machine.findOne({ name: name }))
        return res.status(400).json({ message: "already exists this machine" })
    let machine = new Machine({
        name: name, display_name: display_name
    }).save()

    return res.status(201).json(machine)
}

export const UpdateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let machine = await Machine.findById(id)
    if (!machine)
        return res.status(404).json({ message: "machine not found" })
    if (name !== machine.name)
        if (await Machine.findOne({ name: name }))
            return res.status(400).json({ message: "already exists this machine" })
    machine.name = name
    machine.display_name = display_name
    await machine.save()
    return res.status(200).json(machine)
}

export const CreateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name, sizes } = req.body as {
        name: string,
        display_name: string,
        sizes: [{
            size: string,
            standard_weight: number,
            upper_weight: number,
        }
        ]
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Article.findOne({ name: name }))
        return res.status(400).json({ message: "already exists this article" })
    let machine = new Machine({
        name: name, display_name: display_name
    }).save()

    return res.status(201).json(machine)

}

export const UpdateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name, sizes } = req.body as {
        name: string,
        display_name: string,
        sizes: [{
            size: string,
            standard_weight: number,
            upper_weight: number,
        }
        ]
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let article = await Article.findById(id)
    if (!article)
        return res.status(404).json({ message: "article not found" })
    if (name !== article.name)
        if (await Article.findOne({ name: name }))
            return res.status(400).json({ message: "already exists this article" })
    article.name = name
    article.display_name = display_name
    article.sizes = sizes
    await article.save()
    return res.status(200).json(article)

}
export const CreateDye = async (req: Request, res: Response, next: NextFunction) => {
    const { dye_number, size } = req.body as {
        dye_number: number,
        size: string,
    }
    if (!dye_number || !size) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Dye.findOne({ dye_number: dye_number }))
        return res.status(400).json({ message: "already exists this dye" })
    let dye = new Dye({ dye_number: dye_number, size: size }).save()
    return res.status(201).json(dye)
}
export const UpdateDye = async (req: Request, res: Response, next: NextFunction) => {
    const { dye_number, size } = req.body as {
        dye_number: number,
        size: string,
    }
    if (!dye_number || !size) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }

    const id = req.params.id
    let dye = await Dye.findById(id)
    if (!dye)
        return res.status(404).json({ message: "dye not found" })
    if (dye_number !== dye.dye_number)
        if (await Dye.findOne({ dye_number: dye_number }))
            return res.status(400).json({ message: "already exists this dye" })
    dye.dye_number = dye_number
    dye.size = size
    await dye.save()
    return res.status(200).json(dye)
}
export const CreateShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number
    }
    let { machine, dye, article, weight } = body

    if (!machine || !dye || !article || !weight)
        return res.status(400).json({ message: "please fill all reqired fields" })

    let m1 = await Machine.findById(machine)
    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!m1 || !d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })
    let shoe_weight = new ShoeWeight({
        machine: m1, dye: d1, article: art1, shoe_weight: weight
    })
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `visits/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            shoe_weight.shoe_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.created_by = req.user
    shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(201).json(shoe_weight)
}

export const UpdateShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number
    }
    let { machine, dye, article, weight } = body

    if (!machine || !dye || !article || !weight)
        return res.status(400).json({ message: "please fill all reqired fields" })
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })
    let m1 = await Machine.findById(machine)
    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!m1 || !d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })

    shoe_weight.machine = m1
    shoe_weight.dye = d1
    shoe_weight.article = art1
    shoe_weight.shoe_weight = weight
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.created_by = req.user
    shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}

export const ValidateShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })
    shoe_weight.is_validated = true
    shoe_weight.updated_at = new Date()
    shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}