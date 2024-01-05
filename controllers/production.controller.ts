import { NextFunction, Request, Response } from "express"
import { ShoeWeight } from "../models/production/shoe_weight.report.model"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { Machine } from "../models/production/machine.model"
import { Article } from "../models/production/article.model"
import { Dye } from "../models/production/dye.types"
import xlsx from "xlsx"
import { Production } from "../models/production/production.types"
import { User } from "../models/users/user.model"
import { IShoeWeight } from "../types/production.types"

//get
export const GetMachines = async (req: Request, res: Response, next: NextFunction) => {
    let machines = await Machine.find({ active: true }).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(machines)
}
export const GetArticles = async (req: Request, res: Response, next: NextFunction) => {
    let articles = await Article.find({ active: true }).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(articles)
}

export const GetDyes = async (req: Request, res: Response, next: NextFunction) => {
    let dyes = await Dye.find({ active: true }).populate('created_by').populate('updated_by').sort('dye_number')
    return res.status(200).json(dyes)
}
export const GetShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let weights = await ShoeWeight.find().populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('dye_number')
    return res.status(200).json(weights)
}
export const GetMyTodayShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let previous_date = new Date()
    let day = previous_date.getDate() - 2
    previous_date.setDate(day)
    let dye = req.query.dye
    let weights: IShoeWeight[] = []
    if (dye) {
        weights = await ShoeWeight.find({ created_at: { $gte: previous_date }, dye: dye }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('dye_number')
    }
    else {
        weights = await ShoeWeight.find({ created_at: { $gte: previous_date } }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('dye_number')
    }
    weights = weights.filter((weight) => {
        if (weight.created_at.getDate() === new Date().getDate() && weight.created_at.getMonth() === new Date().getMonth() && weight.created_at.getFullYear() === new Date().getFullYear() && weight.created_by.username === req.user.username)
            return weight
    })
    return res.status(200).json(weights)
}

export const GetProductions = async (req: Request, res: Response, next: NextFunction) => {
    let productions = await Production.find().populate('machine').populate('thekedar').populate('article').populate('created_by').populate('updated_by').sort('-created_at')
    return res.status(200).json(productions)
}
export const GetMyTodayProductions = async (req: Request, res: Response, next: NextFunction) => {
    let previous_date = new Date()
    let day = previous_date.getDate() - 4
    previous_date.setDate(day)

    let productions = await Production.find({ created_at: { $gte: previous_date } }).populate('machine').populate('thekedar').populate('article').populate('created_by').populate('updated_by').sort('-created_at')
    return res.status(200).json(productions)
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
    let machine = await new Machine({
        name: name, display_name: display_name,
        created_at: new Date(),
        updated_by: req.user,
        updated_at: new Date(),
        created_by: req.user,
    }).save()

    return res.status(201).json(machine)
}

export const BulkUploadMachine = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: { name: string, display_name: string }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newMachines: { name: string, display_name: string }[] = []
        workbook_response.forEach(async (machine) => {
            let name: string | null = machine.name
            let display_name: string | null = machine.display_name
            console.log(display_name, name)
            newMachines.push({ name: name, display_name: display_name })
        })
        console.log(newMachines)
        newMachines.forEach(async (mac) => {
            let machine = await Machine.findOne({ display_name: mac.display_name })
            if (!machine)
                await new Machine({ name: mac.name, display_name: mac.display_name, created_by: req.user, updated_by: req.user }).save()
        })
    }
    return res.status(200).json({ message: "machines updated" });
}
export const BulkUploadDye = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: { dye_number: number, size: string }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newDyes: { dye_number: number, size: string }[] = []
        workbook_response.forEach(async (dye) => {
            let dye_number: number | null = dye.dye_number
            let size: string | null = dye.size
            newDyes.push({ dye_number: dye_number, size: size })
        })
        console.log(newDyes)
        newDyes.forEach(async (mac) => {
            let dye = await Dye.findOne({ dye_number: mac.dye_number })
            if (!dye)
                await new Dye({ dye_number: mac.dye_number, size: mac.size, created_by: req.user, updated_by: req.user }).save()
        })
    }
    return res.status(200).json({ message: "dyes updated" });
}
export const BulkUploadArticle = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: { name: string, display_name: string }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newArticles: { name: string, display_name: string }[] = []
        workbook_response.forEach(async (article) => {
            let name: string | null = article.name
            let display_name: string | null = article.display_name
            console.log(display_name, name)
            newArticles.push({ name: name, display_name: display_name })
        })
        console.log(newArticles)
        newArticles.forEach(async (mac) => {
            let article = await Article.findOne({ display_name: mac.display_name })
            if (!article)
                await new Article({ name: mac.name, display_name: mac.display_name, created_by: req.user, updated_by: req.user }).save()
        })
    }
    return res.status(200).json({ message: "articles updated" });
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
    machine.updated_at = new Date()
    machine.updated_by = req.user
    await machine.save()
    return res.status(200).json(machine)
}
export const ToogleMachine = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let machine = await Machine.findById(id)
    if (!machine)
        return res.status(404).json({ message: "machine not found" })
    machine.active = !machine.active
    machine.updated_at = new Date()
    machine.updated_by = req.user
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
    let machine = await new Article({
        name: name, display_name: display_name, created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
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
    article.updated_at = new Date()
    article.updated_by = req.user
    await article.save()
    return res.status(200).json(article)

}
export const ToogleArticle = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let article = await Article.findById(id)
    if (!article)
        return res.status(404).json({ message: "article not found" })
    article.active = !article.active
    article.updated_at = new Date()
    article.updated_by = req.user
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
    let dye = await new Dye({
        dye_number: dye_number, size: size, created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
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
    dye.updated_at = new Date()
    dye.updated_by = req.user
    await dye.save()
    return res.status(200).json(dye)
}

export const ToogleDye = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let dye = await Dye.findById(id)
    if (!dye)
        return res.status(404).json({ message: "dye not found" })
    dye.active = !dye.active
    dye.updated_at = new Date()
    dye.updated_by = req.user
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
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)
    let d1 = await Dye.findById(dye)
    let m1 = await Machine.findById(machine)
    let art1 = await Article.findById(article)
    if (!m1 || !d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })


    let shoe_weights = await ShoeWeight.find({ created_at: { $gte: previous_date }, dye: d1._id })
    shoe_weights = shoe_weights.filter((shoe_weight) => {
        if (shoe_weight.created_at.getDate() === new Date().getDate() && shoe_weight.created_at.getMonth() === new Date().getMonth() && shoe_weight.created_at.getFullYear() === new Date().getFullYear()) {
            return shoe_weight
        }
    })

    if (shoe_weights.length === 3)
        return res.status(400).json({ message: "no more shoe wieght allowed to upload for the same dye" })

    let shoe_weight = new ShoeWeight({
        machine: m1, dye: d1, article: art1, shoe_weight: weight
    })
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `productions/media`;
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


export const CreateProduction = async (req: Request, res: Response, next: NextFunction) => {
    let {
        machine,
        thekedar,
        article,
        manpower,
        production,
        big_repair,
        small_repair
    } = req.body as {
        machine: string,
        thekedar: string,
        article: string,
        manpower: number,
        production: number,
        big_repair: number,
        small_repair: number
    }

    if (!machine || !thekedar || !article || !manpower || !production || !big_repair || !small_repair)
        return res.status(400).json({ message: "please fill all reqired fields" })
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    let production_date = new Date()
    production_date.setDate(production_date.getDate() - 1)

    let productions = await Production.find({ created_at: { $gte: previous_date } })
    let remoteproduction = productions.find((prouction) => {
        if (prouction.created_at.getDate() === new Date(production_date).getDate() && prouction.created_at.getMonth() === new Date(production_date).getMonth() && prouction.created_at.getFullYear() === new Date(production_date).getFullYear()) {
            return prouction
        }
    })
    if (remoteproduction)
        return res.status(400).json({ message: "producton alreday created" })

    let m1 = await Machine.findById(machine)
    let t1 = await User.findById(thekedar)
    let art1 = await Article.findById(article)

    if (!m1 || !t1 || !art1)
        return res.status(400).json({ message: "not a valid request" })
    let new_prouction = new Production({
        machine: m1,
        thekedar: t1,
        article: art1,
        manpower: manpower,
        production: production,
        big_repair: big_repair,
        small_repair: small_repair
    })

    new_prouction.created_at = production_date
    new_prouction.updated_at = new Date()
    new_prouction.created_by = req.user
    new_prouction.updated_by = req.user
    await new_prouction.save()
    return res.status(201).json(new_prouction)
}

export const UpdateProduction = async (req: Request, res: Response, next: NextFunction) => {
    let { machine,
        thekedar,
        article,
        manpower,
        production,
        big_repair,
        small_repair
    } = req.body as {
        machine: string,
        thekedar: string,
        article: string,
        manpower: number,
        production: number,
        big_repair: number,
        small_repair: number
    }

    if (!machine || !thekedar || !article || !manpower || !production || !big_repair || !small_repair)
        return res.status(400).json({ message: "please fill all reqired fields" })
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    const id = req.params.id
    let remote_production = await Production.findById(id)
    if (!remote_production)
        return res.status(404).json({ message: "production not found" })


    let m1 = await Machine.findById(machine)
    let t1 = await User.findById(thekedar)
    let art1 = await Article.findById(article)

    if (!m1 || !t1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })

    remote_production.machine = m1
    remote_production.thekedar = t1
    remote_production.article = art1
    remote_production.manpower = manpower
    remote_production.production = production
    remote_production.big_repair = big_repair
    remote_production.small_repair = small_repair
    remote_production.created_at = new Date()
    remote_production.updated_at = new Date()
    remote_production.created_by = req.user
    remote_production.updated_by = req.user
    await remote_production.save()
    return res.status(200).json(remote_production)
}



