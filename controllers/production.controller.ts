import { NextFunction, Request, Response } from "express"
import { IMachine, Machine } from "../models/production/machine.model"
import { Article, IArticle } from "../models/production/article.model"
import { Dye, IDye } from "../models/production/dye.model"
import xlsx from "xlsx"
import { IProduction, Production } from "../models/production/production.model"
import { IUser, User } from "../models/users/user.model"
import { MachineCategory } from "../models/production/category.machine.model"
import { IShoeWeight, ShoeWeight } from "../models/production/shoe.weight.model"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { destroyFile } from "../utils/destroyFile.util"
import { DyeLocation } from "../models/production/dye.location.model"
import isMongoId from "validator/lib/isMongoId"
import { DyeStatus, IDyeStatus } from "../models/production/dye.status.model"

//get
export const GetMachineCategories = async (req: Request, res: Response, next: NextFunction) => {
    let categoryObj = await MachineCategory.findOne()
    return res.status(200).json(categoryObj)
}

export const GetMachines = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let machines: IMachine[] = []
    if (hidden === "true") {
        machines = await Machine.find().populate('created_by').populate('updated_by').sort('serial_no')
    } else
        machines = await Machine.find({ active: true }).populate('created_by').populate('updated_by').sort('serial_no')
    return res.status(200).json(machines)
}
export const GetArticles = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let articles: IArticle[] = []
    if (hidden === "true") {
        articles = await Article.find().populate('created_by').populate('updated_by').sort('name')
    } else
        articles = await Article.find({ active: true }).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(articles)
}

export const GetDyeById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let dye = await Dye.findById(id).populate('article');
    return res.status(200).json(dye)
}
export const GetDyes = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let dyes: IDye[] = []
    if (hidden === "true") {
        dyes = await Dye.find().populate('article').populate('created_by').populate('updated_by').sort('dye_number')
    } else
        dyes = await Dye.find({ active: true }).populate('article').populate('created_by').populate('updated_by').sort('dye_number')
    return res.status(200).json(dyes)
}


export const GetProductions = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let productions: IProduction[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: { $in: user_ids } }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('date').skip((page - 1) * limit).limit(limit)
                count = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: { $in: user_ids } }).countDocuments()
            }

            else {
                productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: req.user?._id }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('date').skip((page - 1) * limit).limit(limit)
                count = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).countDocuments()
            }
        }


        if (id) {
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: id }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('date').skip((page - 1) * limit).limit(limit)
            count = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: id }).countDocuments()
        }

        return res.status(200).json({
            productions,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}


export const GetMyTodayProductions = async (req: Request, res: Response, next: NextFunction) => {
    let machine = req.query.machine
    let date = String(req.query.date)
    let dt1 = new Date(date)
    let dt2 = new Date(date)
    dt2.setDate(dt1.getDate() + 1)
    let productions: IProduction[] = []
    if (machine) {
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, machine: machine }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    if (!machine)
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('-updated_at')

    return res.status(200).json(productions)
}

//post/put/patch/delete
export const CreateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name, category, serial_no } = req.body as {
        name: string,
        display_name: string,
        serial_no: number,
        category: string
    }
    if (!name || !display_name || !category || !serial_no) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Machine.findOne({ name: name }))
        return res.status(400).json({ message: "already exists this machine" })
    let machine = await new Machine({
        name: name, display_name: display_name, category: category,
        serial_no: serial_no,
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
        let workbook_response: { name: string, display_name: string, category: string, serial_no: number }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newMachines: { name: string, display_name: string, category: string, serial_no: number, }[] = []
        workbook_response.forEach(async (machine) => {
            let name: string | null = machine.name
            let display_name: string | null = machine.display_name
            let category: string | null = machine.category
            let serial_no: number | null = machine.serial_no
            console.log(display_name, name)
            newMachines.push({ name: name, display_name: display_name, category: category, serial_no: machine.serial_no, })
        })
        console.log(newMachines)
        newMachines.forEach(async (mac) => {
            let machine = await Machine.findOne({ name: mac.name })
            if (!machine)
                await new Machine({ name: mac.name, display_name: mac.display_name, category: mac.category, serial_no: mac.serial_no, created_by: req.user, updated_by: req.user }).save()
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
        let workbook_response: { dye_number: number, size: string, article: string, st_weight: number }[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let newDyes: { dye_number: number, size: string, article: string, st_weight: number }[] = []
        workbook_response.forEach(async (dye) => {
            let dye_number: number | null = dye.dye_number
            let size: string | null = dye.size
            let article: string | null = dye.article || ""
            let st_weight: number | null = dye.st_weight
            newDyes.push({ dye_number: dye_number, size: size, article: article, st_weight: st_weight })
        })

        for (let i = 0; i < newDyes.length; i++) {
            let mac = newDyes[i];
            let dye = await Dye.findOne({ dye_number: mac.dye_number })
            let art = await Article.findOne({ name: mac.article.toLowerCase().trim() })
            if (!dye) {
                await new Dye({ dye_number: mac.dye_number, size: mac.size, article: art, stdshoe_weight: mac.st_weight, created_by: req.user, updated_by: req.user }).save()
            }
            else {
                await Dye.findByIdAndUpdate(dye._id, {
                    dye_number: mac.dye_number, size: mac.size, article: art?._id, stdshoe_weight: mac.st_weight, created_by: req.user, updated_by: req.user
                })
            }
        }

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
    const { name, display_name, category, serial_no } = req.body as {
        name: string,
        display_name: string,
        category: string,
        serial_no: number
    }
    if (!name || !display_name || !category || !serial_no) {
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
    machine.serial_no = serial_no
    machine.category = category
    machine.updated_at = new Date()
    if (req.user)
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
    if (req.user)
        machine.updated_by = req.user
    await machine.save()
    return res.status(200).json(machine)

}

export const CreateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Article.findOne({ name: name }))
        return res.status(400).json({ message: "already exists this article" })
    let machine = await new Article({
        name: name, display_name: display_name,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()

    return res.status(201).json(machine)

}

export const UpdateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string,

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
    article.updated_at = new Date()
    if (req.user)
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
    if (req.user)
        article.updated_by = req.user
    await article.save()
    return res.status(200).json(article)

}

export const CreateDye = async (req: Request, res: Response, next: NextFunction) => {
    const { dye_number, size, article_id, st_weight } = req.body as {
        dye_number: number,
        size: string,
        article_id: string,
        st_weight: number
    }
    if (!dye_number || !size) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Dye.findOne({ dye_number: dye_number }))
        return res.status(400).json({ message: "already exists this dye" })
    let art = await Article.findById(article_id)
    if (!art)
        return res.status(404).json({ message: "article not found" })
    let dye = await new Dye({
        dye_number: dye_number, size: size,
        article: art,
        stdshoe_weight: st_weight,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(dye)
}
export const UpdateDye = async (req: Request, res: Response, next: NextFunction) => {
    const { dye_number, size, article_id, st_weight } = req.body as {
        dye_number: number,
        size: string,
        article_id: string,
        st_weight: number
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

    let art = await Article.findById(article_id)
    if (!art)
        return res.status(404).json({ message: "article not found" })
    dye.dye_number = dye_number
    dye.size = size
    dye.article = art
    dye.stdshoe_weight = st_weight,
        dye.updated_at = new Date()
    if (req.user)
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
    if (req.user)
        dye.updated_by = req.user
    await dye.save()
    return res.status(200).json(dye)
}


export const CreateProduction = async (req: Request, res: Response, next: NextFunction) => {
    let {
        machine,
        thekedar,
        articles,
        manpower,
        production,
        big_repair,
        production_hours,
        small_repair,
        date,
        upper_damage
    } = req.body as {
        machine: string,
        date: string,
        production_hours: number,
        thekedar: string,
        articles: string[],
        manpower: number,
        production: number,
        big_repair: number,
        small_repair: number,
        upper_damage: number
    }
    let previous_date = new Date()
    let day = previous_date.getDate() - 3
    previous_date.setDate(day)
    // if (new Date(date) < previous_date || new Date(date) > new Date())
    //     return res.status(400).json({ message: "invalid date, should be within last 2 days" })

    let previous_date2 = new Date(date)
    let day2 = previous_date2.getDate() - 3
    previous_date2.setDate(day2)

    let prods = await Production.find({ created_at: { $gte: previous_date2 }, machine: machine })
    prods = prods.filter((prod) => {
        if (prod.date.getDate() === new Date(date).getDate() && prod.date.getMonth() === new Date(date).getMonth() && prod.date.getFullYear() === new Date(date).getFullYear()) {
            return prod
        }
    })
    if (prods.length === 2)
        return res.status(400).json({ message: "not allowed more than 2 productions for the same machine" })

    if (!machine || !thekedar || !articles || !manpower || !production || !date)
        return res.status(400).json({ message: "please fill all reqired fields" })


    let production_date = new Date(date)


    if (articles.length === 0) {
        return res.status(400).json({ message: "select an article" })
    }
    let m1 = await Machine.findById(machine)
    let t1 = await User.findById(thekedar)

    if (!m1 || !t1)
        return res.status(400).json({ message: "not a valid request" })
    let new_prouction = new Production({
        machine: m1,
        thekedar: t1,
        production_hours: production_hours,
        articles: articles,
        manpower: manpower,
        production: production,
        big_repair: big_repair,
        small_repair: small_repair,
        upper_damage: upper_damage
    })

    new_prouction.date = production_date
    new_prouction.created_at = new Date()
    new_prouction.updated_at = new Date()
    if (req.user) {
        new_prouction.created_by = req.user
        new_prouction.updated_by = req.user
    }
    await new_prouction.save()
    return res.status(201).json(new_prouction)
}

export const UpdateProduction = async (req: Request, res: Response, next: NextFunction) => {
    let {
        machine,
        thekedar,
        articles,
        production_hours,
        manpower,
        production,
        big_repair,
        small_repair,
        upper_damage,
        date
    } = req.body as {
        machine: string,
        date: string,
        production_hours: number,
        thekedar: string,
        articles: string[],
        manpower: number,
        production: number,
        big_repair: number,
        upper_damage: number,
        small_repair: number
    }
    let previous_date = new Date()
    let day = previous_date.getDate() - 3
    previous_date.setDate(day)

    // if (new Date(date) < previous_date || new Date(date) > new Date())
    //     return res.status(400).json({ message: "invalid date, should be within last 2 days" })
    if (!machine || !thekedar || !articles || !manpower || !production || !date)
        return res.status(400).json({ message: "please fill all reqired fields" })
    const id = req.params.id
    if (!id)
        return res.status(400).json({ message: "not a valid request" })
    let remote_production = await Production.findById(id)


    if (!remote_production)
        return res.status(404).json({ message: "producton not exists" })

    if (articles.length === 0) {
        return res.status(400).json({ message: "select an article" })
    }
    let m1 = await Machine.findById(machine)
    let t1 = await User.findById(thekedar)

    if (!m1 || !t1)
        return res.status(400).json({ message: "not a valid request" })
    await Production.findByIdAndUpdate(remote_production._id,
        {
            machine: m1,
            thekedar: t1,
            articles: articles,
            manpower: manpower,
            production: production,
            production_hours: production_hours,
            big_repair: big_repair,
            small_repair: small_repair,
            upper_damage: upper_damage,
            created_at: new Date(),
            updated_at: new Date(),
            updated_by: req.user
        })
    return res.status(200).json({ message: "production updated" })
}
export const DeleteProduction = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!id)
        return res.status(400).json({ message: "not a valid request" })
    let remote_production = await Production.findById(id)
    if (!remote_production)
        return res.status(404).json({ message: "producton not exists" })

    await Production.findByIdAndDelete(remote_production._id)
    return res.status(200).json({ message: "production removed" })
}


export const UpdateMachineCategories = async (req: Request, res: Response, next: NextFunction) => {
    const { categories } = req.body as { categories: string[] }
    await MachineCategory.findOneAndRemove()
    let cat = new MachineCategory({ categories: categories })
    cat.created_at = new Date()
    cat.updated_at = new Date()
    if (req.user) {
        cat.created_by = req.user
        cat.updated_by = req.user
    }
    await cat.save()
    return res.status(200).json({ message: "updated categories" })
}
export const GetMyTodayShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    dt1.setDate(new Date().getDate() - 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    let weights: IShoeWeight[] = []
    if (req.user.is_admin) {
        weights = await ShoeWeight.find({ created_at: { $gte: dt1 } }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-created_at')
    }
    else {
        weights = await ShoeWeight.find({ created_at: { $gte: dt1 }, created_by: req.user._id }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-created_at')
    }
    return res.status(200).json(weights)
}
export const GetShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let weights = await ShoeWeight.find().populate('dye').populate('machine').populate('article').populate('created_by').populate('created_by').populate('updated_by').sort("-created_at")
    return res.status(200).json(weights)
}

export const CreateShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number,
        month: number,
    }
    let { machine, dye, article, weight, month } = body

    if (!machine || !dye || !article || !weight)
        return res.status(400).json({ message: "please fill all reqired fields" })

    let m1 = await Machine.findById(machine)
    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!m1 || !d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })
    let shoe_weight = new ShoeWeight({
        machine: m1, dye: d1, article: art1, shoe_weight1: weight, month: month
    })
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `weights/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            shoe_weight.shoe_photo1 = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.created_by = req.user
    shoe_weight.updated_by = req.user
    shoe_weight.weighttime1 = new Date()
    await shoe_weight.save()
    return res.status(201).json(shoe_weight)
}
export const UpdateShoeWeight1 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number,
        month: number
    }
    let { machine, dye, article, weight, month } = body

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
    if (shoe_weight.shoe_photo1 && shoe_weight.shoe_photo1._id)
        await destroyFile(shoe_weight.shoe_photo1._id)
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `weights/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            shoe_weight.shoe_photo1 = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    shoe_weight.machine = m1
    shoe_weight.dye = d1
    shoe_weight.month = month
    shoe_weight.article = art1
    shoe_weight.shoe_weight1 = weight
    shoe_weight.created_at = new Date()
    shoe_weight.weighttime1 = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.created_by = req.user
    shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}
export const UpdateShoeWeight2 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number,
        month: number
    }
    console.log(body)
    let { machine, dye, article, weight, month } = body

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
        return res.status(400).json({ message: "please fill  reqired fields" })
    if (shoe_weight.shoe_photo2 && shoe_weight.shoe_photo2._id)
        await destroyFile(shoe_weight.shoe_photo2._id)
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `weights/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            shoe_weight.shoe_photo2 = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    shoe_weight.machine = m1
    shoe_weight.dye = d1
    shoe_weight.month = month
    shoe_weight.article = art1
    shoe_weight.shoe_weight2 = weight
    shoe_weight.weighttime2 = new Date()
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.created_by = req.user
    shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}
export const UpdateShoeWeight3 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        weight: number,
        month: number
    }
    let { machine, dye, article, weight, month } = body

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
    if (shoe_weight.shoe_photo3 && shoe_weight.shoe_photo3._id)
        await destroyFile(shoe_weight.shoe_photo3._id)
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `weights/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            shoe_weight.shoe_photo3 = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    shoe_weight.machine = m1
    shoe_weight.dye = d1
    shoe_weight.month = month
    shoe_weight.article = art1
    shoe_weight.shoe_weight3 = weight
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.weighttime3 = new Date()
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
export const DeleteShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })
    shoe_weight.is_validated = true
    shoe_weight.updated_at = new Date()
    shoe_weight.updated_by = req.user
    if (shoe_weight.shoe_photo1 && shoe_weight.shoe_photo1._id)
        await destroyFile(shoe_weight.shoe_photo1._id)
    if (shoe_weight.shoe_photo2 && shoe_weight.shoe_photo2._id)
        await destroyFile(shoe_weight.shoe_photo2._id)
    if (shoe_weight.shoe_photo3 && shoe_weight.shoe_photo3._id)
        await destroyFile(shoe_weight.shoe_photo3._id)
    await shoe_weight.remove()
    return res.status(200).json(shoe_weight)
}


export const GetAllDyeLocations = async (req: Request, res: Response, next: NextFunction) => {
    let locations = await DyeLocation.find()
    return res.status(200).json(locations)
}


export const CreateDyeLocation = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await DyeLocation.findOne({ name: name.toLowerCase() }))
        return res.status(400).json({ message: "already exists this dye location" })
    let result = await new DyeLocation({
        name: name,
        display_name: display_name,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateDyeLocation = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as {
        name: string,
        display_name: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldlocation = await DyeLocation.findById(id)
    if (!oldlocation)
        return res.status(404).json({ message: "location not found" })
    if (name !== oldlocation.name)
        if (await DyeLocation.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this location" })
    let prevname = oldlocation.name
    oldlocation.name = name
    oldlocation.updated_at = new Date()
    if (req.user)
        oldlocation.updated_by = req.user
    await oldlocation.save()
    return res.status(200).json(oldlocation)

}
export const DeleteDyeLocation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "location id not valid" })
    let location = await DyeLocation.findById(id);
    if (!location) {
        return res.status(404).json({ message: "location not found" })
    }
    await location.remove();
    return res.status(200).json({ message: "lead location deleted successfully" })
}
export const GetMyTodayDyeStatus = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    dt1.setDate(new Date().getDate() - 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    let statusall: IDyeStatus[] = []
    if (req.user.is_admin) {
        statusall = await DyeStatus.find({ created_at: { $gte: dt1 } }).populate('machine').populate('dye').populate('article').populate('location').populate('created_by').populate('updated_by').sort('-created_at')
    }
    else {
        statusall = await DyeStatus.find({ created_at: { $gte: dt1 }, created_by: req.user._id }).populate('machine').populate('dye').populate('article').populate('location').populate('created_by').populate('updated_by').sort('-created_at')
    }
    return res.status(200).json(statusall)
}

export const GetDyeStatus = async (req: Request, res: Response, next: NextFunction) => {
    let statusall = await DyeStatus.find().populate('dye').populate('machine').populate('article').populate('created_by').populate('created_by').populate('location').populate('updated_by').sort('-created_at')
    return res.status(200).json(statusall)
}

export const CreateDyeStatus = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as {
        machine: string,
        dye: string,
        article: string,
        repair_required:boolean,
        location: string
    }
    let { machine, dye, article, location, repair_required } = body

    if (!location || !dye)
        if (!machine || !article)
            return res.status(400).json({ message: "please fill all reqired fields" })

    let m1 = await Machine.findById(machine)
    let l1 = await DyeLocation.findById(location)
    let a1 = await Article.findById(article)
    let d1 = await Dye.findById(dye)
    if (!d1) {
        return res.status(404).json({ message: "dye not found" })
    }

    let status = new DyeStatus({
        machine: m1, dye: d1, article: a1, location: l1
    })
    if (req.file) {
        console.log(req.file.mimetype)
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `dyestatus/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            status.dye_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    status.created_at = new Date()
    status.updated_at = new Date()
    status.created_by = req.user
    status.repair_required = repair_required;
    status.updated_by = req.user
    status.photo_time = new Date()
    await status.save()
    return res.status(201).json(status)
}

export const DeleteDyeStatus = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let status = await DyeStatus.findById(id)
    if (!status)
        return res.status(404).json({ message: "dye status not found" })
    status.updated_at = new Date()
    status.updated_by = req.user
    if (status.dye_photo && status.dye_photo._id)
        await destroyFile(status.dye_photo._id)
    await status.remove()
    return res.status(200).json(status)
}