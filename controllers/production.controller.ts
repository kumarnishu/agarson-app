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
import { DyeLocation, IDyeLocation } from "../models/production/dye.location.model"
import isMongoId from "validator/lib/isMongoId"
import moment from "moment"
import { ISoleThickness, SoleThickness } from "../models/production/sole.thickness.model"
import { CreateOrEditArticleDto, CreateOrEditDyeDTo, CreateOrEditDyeDtoFromExcel, CreateOrEditDyeLocationDto, CreateOrEditMachineDto, CreateOrEditProductionDto, CreateOrEditShoeWeightDto, CreateOrEditSoleThicknessDto, CreateOrEditSpareDyeDto, GetArticleDto, GetCategoryWiseProductionReportDto, GetDyeDto, GetDyeLocationDto, GetDyeStatusReportDto, GetMachineDto, GetProductionDto, GetShoeWeightDiffReportDto, GetShoeWeightDto, GetSoleThicknessDto, GetSpareDyeDto, IColumnRowData, IRowData } from "../dtos/production/production.dto"
import { ISpareDye, SpareDye } from "../models/production/SpareDye.model"
import { CreateOrEditDropDownDto } from "../dtos/common/dropdown.dto"

//get
export const GetMachineCategories = async (req: Request, res: Response, next: NextFunction) => {
    let result = (await MachineCategory.find()).map((c) => {
        return { id: c._id, label: c.category, value: c.category }
    })
    return res.status(200).json(result)
}
export const CreateMachineCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.body as CreateOrEditDropDownDto
    if (!key) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await MachineCategory.findOne({ category: key.toLowerCase() }))
        return res.status(400).json({ message: "already exists this category" })
    let result = await new MachineCategory({
        category: key,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json({ message: "success" })

}

export const UpdateMachineCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.body as CreateOrEditDropDownDto
    if (!key) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldtype = await MachineCategory.findById(id)
    if (!oldtype)
        return res.status(404).json({ message: "category not found" })
    if (key !== oldtype.category)
        if (await MachineCategory.findOne({ category: key.toLowerCase() }))
            return res.status(400).json({ message: "already exists this category" })
    let prevtype = oldtype.category
    oldtype.category = key
    oldtype.updated_at = new Date()
    if (req.user)
        oldtype.updated_by = req.user
    await Machine.updateMany({ category: prevtype }, { category: key })
    await oldtype.save()
    return res.status(200).json({ message: "updated" })

}
export const DeleteMachineCategory = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "category id not valid" })
    let category = await MachineCategory.findById(id);
    if (!category) {
        return res.status(404).json({ message: "category not found" })
    }
    await category.remove();
    return res.status(200).json({ message: "category deleted successfully" })
}
export const GetMachines = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let machines: IMachine[] = []
    let result: GetMachineDto[] = []
    if (hidden === "true") {
        machines = await Machine.find({ active: false }).populate('created_by').populate('updated_by').sort('serial_no')
    } else
        machines = await Machine.find({ active: true }).populate('created_by').populate('updated_by').sort('serial_no')
    result = machines.map((m) => {
        return {
            _id: m._id,
            name: m.name,
            active: m.active,
            category: m.category,
            serial_no: m.serial_no,
            display_name: m.display_name,
            created_at: m.created_at && moment(m.created_at).format("DD/MM/YYYY"),
            updated_at: m.updated_at && moment(m.updated_at).format("DD/MM/YYYY"),
            created_by: { id: m.created_by._id, value: m.created_by.username, label: m.created_by.username },
            updated_by: { id: m.updated_by._id, value: m.updated_by.username, label: m.updated_by.username }
        }
    })
    return res.status(200).json(result)
}
export const GetArticles = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let result: GetArticleDto[] = []
    let articles: IArticle[] = []
    if (hidden === "true") {
        articles = await Article.find({ active: false }).populate('created_by').populate('updated_by').sort('name')
    } else
        articles = await Article.find({ active: true }).populate('created_by').populate('updated_by').sort('name')
    result = articles.map((m) => {
        return {
            _id: m._id,
            name: m.name,
            display_name: m.display_name,
            active: m.active,
            created_at: m.created_at && moment(m.created_at).format("DD/MM/YYYY"),
            updated_at: m.updated_at && moment(m.updated_at).format("DD/MM/YYYY"),
            created_by: { id: m.created_by._id, value: m.created_by.username, label: m.created_by.username },
            updated_by: { id: m.updated_by._id, value: m.updated_by.username, label: m.updated_by.username }
        }
    })
    return res.status(200).json(result)
}

export const GetDyeById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;

    let dye = await Dye.findById(id).populate('articles');
    if (!dye)
        return res.status(404).json({ message: "dye not exists" })
    let result: GetDyeDto = {
        _id: dye._id,
        active: dye.active,
        dye_number: dye.dye_number,
        size: dye.size,
        articles: dye.articles.map((a) => { return { id: a._id, value: a.name, label: a.name } }),
        stdshoe_weight: dye.stdshoe_weight,
        created_at: dye.created_at && moment(dye.created_at).format("DD/MM/YYYY"),
        updated_at: dye.updated_at && moment(dye.updated_at).format("DD/MM/YYYY"),
        created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username },
        updated_by: { id: dye.updated_by._id, value: dye.updated_by.username, label: dye.updated_by.username }
    }
    return res.status(200).json(result)
}

export const GetDyes = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let dyes: IDye[] = []
    let result: GetDyeDto[] = []
    if (hidden === "true") {
        dyes = await Dye.find({ active: false }).populate('articles').populate('created_by').populate('updated_by').sort('dye_number')
    } else
        dyes = await Dye.find({ active: true }).populate('articles').populate('created_by').populate('updated_by').sort('dye_number')
    result = dyes.map((dye) => {
        return {
            _id: dye._id,
            active: dye.active,
            dye_number: dye.dye_number,
            size: dye.size,
            articles: dye.articles.map((a) => { return { id: a._id, value: a.name, label: a.name } }),
            stdshoe_weight: dye.stdshoe_weight,
            created_at: dye.created_at && moment(dye.created_at).format("DD/MM/YYYY"),
            updated_at: dye.updated_at && moment(dye.updated_at).format("DD/MM/YYYY"),
            created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username },
            updated_by: { id: dye.updated_by._id, value: dye.updated_by.username, label: dye.updated_by.username }
        }
    })
    return res.status(200).json(result)
}


export const GetProductions = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let productions: IProduction[] = []
    let result: GetProductionDto[] = []
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
                count = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: req.user?._id }).countDocuments()
            }
        }


        if (id) {
            productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: id }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('date').skip((page - 1) * limit).limit(limit)
            count = await Production.find({ date: { $gte: dt1, $lt: dt2 }, thekedar: id }).countDocuments()
        }
        result = productions.map((p) => {
            return {
                _id: p._id,
                machine: { id: p.machine._id, value: p.machine.name, label: p.machine.name },
                thekedar: { id: p.thekedar._id, value: p.thekedar.username, label: p.thekedar.username },
                articles: p.articles.map((a) => { return { id: a._id, value: a.name, label: a.name } }),
                manpower: p.manpower,
                production: p.production,
                big_repair: p.big_repair,
                upper_damage: p.upper_damage,
                small_repair: p.small_repair,
                date: p.date && moment(p.date).format("DD/MM/YYYY"),
                production_hours: p.production_hours,
                created_at: p.created_at && moment(p.created_at).format("DD/MM/YYYY"),
                updated_at: p.updated_at && moment(p.updated_at).format("DD/MM/YYYY"),
                created_by: { id: p.created_by._id, value: p.created_by.username, label: p.created_by.username },
                updated_by: { id: p.updated_by._id, value: p.updated_by.username, label: p.updated_by.username }
            }
        })
        return res.status(200).json({
            result,
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
    let result: GetProductionDto[] = []
    if (machine) {
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 }, machine: machine }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    if (!machine)
        productions = await Production.find({ date: { $gte: dt1, $lt: dt2 } }).populate('machine').populate('thekedar').populate('articles').populate('created_by').populate('updated_by').sort('-updated_at')

    result = productions.map((p) => {
        return {
            _id: p._id,
            machine: { id: p.machine._id, value: p.machine.name, label: p.machine.name },
            thekedar: { id: p.thekedar._id, value: p.thekedar.username, label: p.thekedar.username },
            articles: p.articles.map((a) => { return { id: a._id, value: a.name, label: a.name } }),
            manpower: p.manpower,
            production: p.production,
            big_repair: p.big_repair,
            upper_damage: p.upper_damage,
            small_repair: p.small_repair,
            date: p.date && moment(p.date).format("DD/MM/YYYY"),
            production_hours: p.production_hours,
            created_at: p.created_at && moment(p.created_at).format("DD/MM/YYYY"),
            updated_at: p.updated_at && moment(p.updated_at).format("DD/MM/YYYY"),
            created_by: { id: p.created_by._id, value: p.created_by.username, label: p.created_by.username },
            updated_by: { id: p.updated_by._id, value: p.updated_by.username, label: p.updated_by.username }
        }
    })
    return res.status(200).json(productions)
}
//post/put/patch/delete
export const CreateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name, category, serial_no } = req.body as CreateOrEditMachineDto
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
        let workbook_response: CreateOrEditMachineDto[] = xlsx.utils.sheet_to_json(
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
        let workbook_response: CreateOrEditDyeDtoFromExcel[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        let newDyes: { dye_number: number, size: string, articles: IArticle[], st_weight: number }[] = []

        for (let i = 0; i < workbook_response.length; i++) {
            let dye_number: number | null = workbook_response[i].dye_number
            let size: string | null = workbook_response[i].size
            let articles: string[] | null = workbook_response[i].articles && workbook_response[i].articles.split(",") || []
            let st_weight: number | null = workbook_response[i].st_weight
            let newArticles: IArticle[] = []
            if (articles && articles.length > 0) {
                for (let j = 0; j < articles.length; j++) {
                    let art = await Article.findOne({ name: articles[j].toLowerCase().trim() })
                    if (art) {
                        newArticles.push(art)
                    }
                }
            }

            newDyes.push({ dye_number: dye_number, size: size, articles: newArticles, st_weight: st_weight })
        }


        for (let i = 0; i < newDyes.length; i++) {
            let mac = newDyes[i];
            let dye = await Dye.findOne({ dye_number: mac.dye_number })
            if (!dye) {
                await new Dye({ dye_number: mac.dye_number, size: mac.size, articles: newDyes[i].articles, stdshoe_weight: mac.st_weight, created_by: req.user, updated_by: req.user }).save()
            }
            else {
                await Dye.findByIdAndUpdate(dye._id, {
                    dye_number: mac.dye_number, size: mac.size, articles: newDyes[i].articles, stdshoe_weight: mac.st_weight, created_by: req.user, updated_by: req.user
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
        let workbook_response: CreateOrEditArticleDto[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
        let newArticles: CreateOrEditArticleDto[] = []
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
    const { name, display_name, category, serial_no } = req.body as CreateOrEditMachineDto
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
    const { name, display_name } = req.body as CreateOrEditArticleDto
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
    const { name, display_name } = req.body as CreateOrEditArticleDto
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
    const { dye_number, size, articles, st_weight } = req.body as CreateOrEditDyeDTo
    if (!dye_number || !size) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Dye.findOne({ dye_number: dye_number }))
        return res.status(400).json({ message: "already exists this dye" })

    let dye = await new Dye({
        dye_number: dye_number, size: size,
        articles: articles,
        stdshoe_weight: st_weight,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(dye)
}
export const UpdateDye = async (req: Request, res: Response, next: NextFunction) => {
    const { dye_number, size, articles, st_weight } = req.body as CreateOrEditDyeDTo
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
    //@ts-ignore
    dye.articles = articles
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
    } = req.body as CreateOrEditProductionDto
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
    } = req.body as CreateOrEditProductionDto
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


export const GetMyTodayShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    dt1.setDate(new Date().getDate())
    dt1.setHours(0)
    dt1.setMinutes(0)
    let result: GetShoeWeightDto[] = []
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []
    let weights: IShoeWeight[] = []

    if (user_ids.length > 0) {
        weights = await ShoeWeight.find({ created_at: { $gte: dt1 }, created_by: { $in: user_ids } }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    else {
        weights = await ShoeWeight.find({ created_at: { $gte: dt1 }, created_by: req.user?._id }).populate('machine').populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    result = weights.map((w) => {
        return {
            _id: w._id,
            machine: { id: w.machine._id, label: w.machine.name, value: w.machine.name },
            dye: { id: w.dye._id, label: String(w.dye.dye_number), value: String(w.dye.dye_number) },
            article: { id: w.article._id, label: w.article.name, value: w.article.name },
            is_validated: w.is_validated,
            month: w.month,
            std_weigtht: w.dye.stdshoe_weight || 0,
            size: w.dye.size || "",
            shoe_weight1: w.shoe_weight1,
            shoe_photo1: w.shoe_photo1?.public_url || "",
            weighttime1: moment(new Date(w.weighttime1)).format('LT'),
            weighttime2: moment(new Date(w.weighttime2)).format('LT'),
            weighttime3: moment(new Date(w.weighttime3)).format('LT'),
            upper_weight1: w.upper_weight1,
            upper_weight2: w.upper_weight2,
            upper_weight3: w.upper_weight3,
            shoe_weight2: w.shoe_weight2,
            shoe_photo2: w.shoe_photo2?.public_url || "",
            shoe_weight3: w.shoe_weight3,
            shoe_photo3: w.shoe_photo3?.public_url || "",
            created_at: moment(w.created_at).format("DD/MM/YYYY"),
            updated_at: moment(w.updated_at).format("DD/MM/YYYY"),
            created_by: { id: w.created_by._id, value: w.created_by.username, label: w.created_by.username },
            updated_by: { id: w.updated_by._id, value: w.updated_by.username, label: w.updated_by.username },
        }
    })
    return res.status(200).json(result)
}


export const GetShoeWeights = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let weights: IShoeWeight[] = []
    let result: GetShoeWeightDto[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                weights = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).populate('dye').populate('machine').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
                count = await ShoeWeight.find({ created_at: { $gt: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).countDocuments()
            }

            else {
                weights = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).populate('dye').populate('machine').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
                count = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).countDocuments()
            }
        }


        if (id) {
            weights = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate('dye').populate('machine').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
            count = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }
        result = weights.map((w) => {
            return {
                _id: w._id,
                machine: { id: w.machine._id, label: w.machine.name, value: w.machine.name },
                dye: { id: w.dye._id, label: String(w.dye.dye_number), value: String(w.dye.dye_number) },
                article: { id: w.article._id, label: w.article.name, value: w.article.name },
                size: w.dye.size || "",
                is_validated: w.is_validated,
                month: w.month,
                std_weigtht: w.dye.stdshoe_weight || 0,
                shoe_weight1: w.shoe_weight1,
                shoe_photo1: w.shoe_photo1?.public_url || "",
                weighttime1: moment(new Date(w.weighttime1)).format('LT'),
                weighttime2: moment(new Date(w.weighttime2)).format('LT'),
                weighttime3: moment(new Date(w.weighttime3)).format('LT'),
                upper_weight1: w.upper_weight1,
                upper_weight2: w.upper_weight2,
                upper_weight3: w.upper_weight3,
                shoe_weight2: w.shoe_weight2,
                shoe_photo2: w.shoe_photo2?.public_url || "",
                shoe_weight3: w.shoe_weight3,
                shoe_photo3: w.shoe_photo3?.public_url || "",
                created_at: moment(w.created_at).format("DD/MM/YYYY"),
                updated_at: moment(w.updated_at).format("DD/MM/YYYY"),
                created_by: { id: w.created_by._id, value: w.created_by.username, label: w.created_by.username },
                updated_by: { id: w.updated_by._id, value: w.updated_by.username, label: w.updated_by.username },
            }
        })
        return res.status(200).json({
            result,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(200).json({ message: "bad request" })
}

export const CreateShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditShoeWeightDto

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    let { machine, dye, article, weight, month, upper_weight } = body

    if (!machine || !dye || !article || !weight || !upper_weight)
        return res.status(400).json({ message: "please fill all reqired fields" })

    let m1 = await Machine.findById(machine)
    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!m1 || !d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })
    if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! this is a spare dye" })
    }

    if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! dye is not available" })
    }


    let shoe_weight = new ShoeWeight({
        machine: m1, dye: d1, article: art1, shoe_weight1: weight, month: month, upper_weight1: upper_weight
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
    if (req.user)
        shoe_weight.created_by = req.user
    if (req.user)
        shoe_weight.updated_by = req.user
    shoe_weight.weighttime1 = new Date()
    await shoe_weight.save()
    return res.status(201).json(shoe_weight)
}
export const UpdateShoeWeight1 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditShoeWeightDto
    let { machine, dye, article, weight, month, upper_weight } = body

    if (!machine || !dye || !article || !weight || !upper_weight)
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

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! this is a spare dye" })
    }

    //@ts-ignore

    if (shoe_weight.dye !== dye)
        if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
            return res.status(400).json({ message: "sorry ! dye is not available" })
        }


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
    shoe_weight.upper_weight1 = upper_weight;
    shoe_weight.article = art1
    shoe_weight.shoe_weight1 = weight
    shoe_weight.created_at = new Date()
    shoe_weight.weighttime1 = new Date()
    shoe_weight.updated_at = new Date()
    if (req.user) {

        shoe_weight.created_by = req.user
        shoe_weight.updated_by = req.user
    }
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}
export const UpdateShoeWeight2 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditShoeWeightDto
    console.log(body)
    let { machine, dye, article, weight, month, upper_weight } = body

    if (!machine || !dye || !article || !weight || !upper_weight)
        return res.status(400).json({ message: "please fill all reqired fields" })
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! this is a spare dye" })
    }

    //@ts-ignore
    if (shoe_weight.dye !== dye)
        if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
            return res.status(400).json({ message: "sorry ! dye is not available" })
        }


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
    shoe_weight.upper_weight2 = upper_weight;
    shoe_weight.shoe_weight2 = weight
    shoe_weight.weighttime2 = new Date()
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    if (req.user) {
        shoe_weight.created_by = req.user
        shoe_weight.updated_by = req.user
    }
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}
export const UpdateShoeWeight3 = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditShoeWeightDto
    let { machine, dye, article, weight, month, upper_weight } = body

    if (!machine || !dye || !article || !weight || !upper_weight)
        return res.status(400).json({ message: "please fill all reqired fields" })
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! this is a spare dye" })
    }

    //@ts-ignore
    if (shoe_weight.dye !== dye)
        if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
            return res.status(400).json({ message: "sorry ! dye is not available" })
        }


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
    shoe_weight.upper_weight3 = upper_weight;
    shoe_weight.dye = d1
    shoe_weight.month = month
    shoe_weight.article = art1
    shoe_weight.shoe_weight3 = weight
    shoe_weight.created_at = new Date()
    shoe_weight.updated_at = new Date()
    shoe_weight.weighttime3 = new Date()
    if (req.user) {
        shoe_weight.created_by = req.user
        shoe_weight.updated_by = req.user
    }
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
    if (req.user)
        shoe_weight.updated_by = req.user
    await shoe_weight.save()
    return res.status(200).json(shoe_weight)
}
export const ValidateSpareDye = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let sparedye = await SpareDye.findById(id)
    if (!sparedye)
        return res.status(404).json({ message: "spare dye not found" })
    sparedye.is_validated = true
    sparedye.updated_at = new Date()
    if (req.user)
        sparedye.updated_by = req.user
    await sparedye.save()
    return res.status(200).json(sparedye)
}
export const DeleteShoeWeight = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let shoe_weight = await ShoeWeight.findById(id)
    if (!shoe_weight)
        return res.status(404).json({ message: "shoe weight not found" })
    shoe_weight.is_validated = true
    shoe_weight.updated_at = new Date()
    if (req.user)
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
    let hidden = String(req.query.hidden)
    let result: GetDyeLocationDto[] = []
    let locations: IDyeLocation[] = []
    if (hidden === "true") {
        locations = await DyeLocation.find({ active: false }).populate('created_by').populate('updated_by')
    } else
        locations = await DyeLocation.find({ active: true }).populate('created_by').populate('updated_by')


    result = locations.map((l) => {
        return {
            _id: l._id,
            name: l.name,
            active: l.active,
            display_name: l.display_name,
            created_at: l.created_at && moment(l.created_at).format("DD/MM/YYYY"),
            updated_at: l.updated_at && moment(l.updated_at).format("DD/MM/YYYY"),
            created_by: { id: l.created_by._id, value: l.created_by.username, label: l.created_by.username },
            updated_by: { id: l.updated_by._id, value: l.updated_by.username, label: l.updated_by.username }
        }
    })
    return res.status(200).json(result)
}


export const CreateDyeLocation = async (req: Request, res: Response, next: NextFunction) => {
    const { name, display_name } = req.body as CreateOrEditDyeLocationDto
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
    const { name, display_name } = req.body as CreateOrEditDyeLocationDto
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
    oldlocation.name = name
    oldlocation.display_name = display_name
    oldlocation.updated_at = new Date()
    if (req.user)
        oldlocation.updated_by = req.user
    await oldlocation.save()
    return res.status(200).json(oldlocation)

}

export const ToogleDyeLocation = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "location id not valid" })
    let location = await DyeLocation.findById(id);
    if (!location) {
        return res.status(404).json({ message: "location not found" })
    }
    location.active = !location.active
    location.updated_at = new Date()
    if (req.user)
        location.updated_by = req.user
    await location.save()
    return res.status(200).json({ message: "success" })
}

export const GetShoeWeightDifferenceReports = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let weights: IShoeWeight[] = []
    let reports: GetShoeWeightDiffReportDto[] = []
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    weights = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate('dye').populate('machine').populate('article').populate('created_by').populate('updated_by').sort("dye.dye_number")
    reports = weights.map((weight) => {
        return {
            date: moment(weight.created_at).format("DD/MM/YYYY"),
            dye_no: weight.dye.dye_number,
            article: weight.article.display_name,
            size: weight.dye.size,
            st_weight: weight.dye.stdshoe_weight || 0,
            machine: weight.machine.display_name,
            w1: weight.shoe_weight1 || 0,
            w2: weight.shoe_weight2 || 0,
            w3: weight.shoe_weight3 || 0,
            u1: weight.upper_weight1 || 0,
            u2: weight.upper_weight2 || 0,
            u3: weight.upper_weight3 || 0,
            d1: weight.shoe_weight1 && weight.upper_weight1 ? (weight.shoe_weight1 - weight.upper_weight1 - weight.dye.stdshoe_weight) : 0,
            d2: weight.shoe_weight2 && weight.upper_weight2 ? (weight.shoe_weight2 - weight.upper_weight2 - weight.dye.stdshoe_weight) : 0,
            d3: weight.shoe_weight3 && weight.upper_weight3 ? (weight.shoe_weight3 - weight.upper_weight3 - weight.dye.stdshoe_weight) : 0,
            person: weight.created_by.username
        }
    })
    return res.status(200).json(reports)
}

export const GetThekedarWiseProductionReports = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let production: IColumnRowData = {
        columns: [],
        rows: []
    };
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    const oneDay = 24 * 60 * 60 * 1000;
    let users = await User.find().sort("username")
    //columns
    production.columns.push({ key: 'date', header: 'Date', type: 'date' });
    users = users.filter((u) => { return u.assigned_permissions.includes('production_view') })
    for (let k = 0; k < users.length; k++) {
        let user = users[k]
        production.columns.push({ key: user.username, header: String(user.username).toUpperCase(), type: 'number' })
    }
    production.columns.push({ key: 'total', header: 'Total', type: 'number' });
    while (dt1 <= dt2) {
        //rows
        let total = 0
        let obj: IRowData = {}
        obj['date'] = moment(dt1).format("DD/MM/YYYY")
        for (let k = 0; k < users.length; k++) {
            let user = users[k]
            let data = await Production.find({ date: { $gte: dt1, $lt: new Date(dt1.getTime() + oneDay) }, thekedar: user._id })
            let result = data.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            if (result === 0)
                obj[users[k].username] = result;
            else
                obj[users[k].username] = result;
            total += result
        }
        obj['total'] = total
        production.rows.push(obj);
        dt1 = new Date(dt1.getTime() + oneDay);
    }


    return res.status(200).json(production)
}

export const GetMachineWiseProductionReports = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let production: IColumnRowData = {
        columns: [],
        rows: []
    };
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    const oneDay = 24 * 60 * 60 * 1000;
    let machines = await Machine.find({ active: true }).sort('serial_no')
    //columns
    production.columns.push({ key: 'date', header: 'Date', type: 'date' });
    for (let k = 0; k < machines.length; k++) {
        production.columns.push({ key: machines[k].name, header: String(machines[k].display_name).toUpperCase(), type: 'number' })
    }
    production.columns.push({ key: 'total', header: 'Total', type: 'number' });

    //rows
    while (dt1 <= dt2) {
        let total = 0
        let obj: IRowData = {}
        obj['date'] = moment(dt1).format("DD/MM/YYYY")
        for (let k = 0; k < machines.length; k++) {
            let data = await Production.find({ date: { $gte: dt1, $lt: new Date(dt1.getTime() + oneDay) }, machine: machines[k]._id })
            let result = data.reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
            if (result === 0)
                obj[machines[k].name] = result;
            else
                obj[machines[k].name] = result;
            total += result
        }
        obj['total'] = total
        production.rows.push(obj);
        dt1 = new Date(dt1.getTime() + oneDay);
    }

    return res.status(200).json(production)
}


export const GetCategoryWiseProductionReports = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let productions: GetCategoryWiseProductionReportDto[] = [];
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    const oneDay = 24 * 60 * 60 * 1000;

    while (dt1 <= dt2) {

        let data = await Production.find({ date: { $gte: dt1, $lt: new Date(dt1.getTime() + oneDay) } }).populate('machine')

        let verpluslymphaprod = data.filter((prod) => { return prod.machine.category === "vertical" || prod.machine.category === "lympha" }).reduce((a, b) => { return Number(a) + Number(b.production) }, 0)

        let puprod = data.filter((prod) => { return prod.machine.category === "pu" }).reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        let gumbootprod = data.filter((prod) => { return prod.machine.category === "gumboot" }).reduce((a, b) => { return Number(a) + Number(b.production) }, 0)
        let total = verpluslymphaprod + puprod + gumbootprod;
        productions.push({
            date: moment(dt1).format("DD/MM/YYYY"),
            total: total,
            verticalpluslympha: verpluslymphaprod,
            pu: puprod,
            gumboot: gumbootprod
        })
        dt1 = new Date(dt1.getTime() + oneDay);
    }
    return res.status(200).json(productions)
}
export const GetMyTodaySoleThickness = async (req: Request, res: Response, next: NextFunction) => {
    console.log("enterd")
    let dt1 = new Date()
    dt1.setDate(new Date().getDate())
    dt1.setHours(0)
    dt1.setMinutes(0)
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []
    let items: ISoleThickness[] = []
    let result: GetSoleThicknessDto[] = []

    if (user_ids.length > 0) {
        items = await SoleThickness.find({ created_at: { $gte: dt1 }, created_by: { $in: user_ids } }).populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    else {
        items = await SoleThickness.find({ created_at: { $gte: dt1 }, created_by: req.user?._id }).populate('dye').populate('article').populate('created_by').populate('updated_by').sort('-updated_at')
    }
    result = items.map((item) => {
        return {
            _id: item._id,
            dye: { id: item.dye._id, value: item.dye.dye_number.toString(), label: item.dye.dye_number.toString() },
            article: { id: item.article._id, value: item.article.name, label: item.article.name },
            size: item.size,
            left_thickness: item.left_thickness,
            right_thickness: item.right_thickness,
            created_at: item.created_at ? moment(item.created_at).format('LT'): "",
            updated_at: item.updated_at ? moment(item.updated_at).format('LT'): "",
            created_by: { id: item.created_by._id, value: item.created_by.username, label: item.created_by.username },
            updated_by: { id: item.updated_by._id, value: item.updated_by.username, label: item.updated_by.username }
        }
    })
    return res.status(200).json(result)
}

export const GetSoleThickness = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let result: GetSoleThicknessDto[] = []
    let items: ISoleThickness[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                items = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).populate('dye').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
                count = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).countDocuments()
            }

            else {
                items = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).populate('dye').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
                count = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).countDocuments()
            }
        }


        if (id) {
            items = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate('dye').populate('article').populate('created_by').populate('updated_by').sort("-created_at").skip((page - 1) * limit).limit(limit)
            count = await SoleThickness.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }

        result = items.map((item) => {
            return {
                _id: item._id,
                dye: { id: item.dye._id, value: item.dye.dye_number.toString(), label: item.dye.dye_number.toString() },
                article: { id: item.article._id, value: item.article.name, label: item.article.name },
                size: item.size,
                left_thickness: item.left_thickness,
                right_thickness: item.right_thickness,
                created_at: item.created_at ? moment(item.created_at).format('DD/MM/YYYY') : "",
                updated_at: item.updated_at ? moment(item.updated_at).format('DD/MM/YYYY') : "",
                created_by: { id: item.created_by._id, value: item.created_by.username, label: item.created_by.username },
                updated_by: { id: item.updated_by._id, value: item.updated_by.username, label: item.updated_by.username }
            }
        })

        return res.status(200).json({
            result,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(200).json({ message: "bad request" })
}
export const CreateSoleThickness = async (req: Request, res: Response, next: NextFunction) => {

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    let { dye, article, size, left_thickness, right_thickness } = req.body as CreateOrEditSoleThicknessDto

    if (!size || !dye || !article || !left_thickness || !right_thickness)
        return res.status(400).json({ message: "please fill all reqired fields" })

    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })


    if (await SoleThickness.findOne({ dye: dye, article: article, size: size, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry !selected dye,article or size not available" })
    }
    let thickness = new SoleThickness({
        dye: d1, article: art1, size: size, left_thickness: left_thickness, right_thickness: right_thickness,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()

    return res.status(201).json(thickness)
}
export const UpdateSoleThickness = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    let { dye, article, size, left_thickness, right_thickness } = req.body as CreateOrEditSoleThicknessDto

    if (!size || !dye || !article || !left_thickness || !right_thickness)
        return res.status(400).json({ message: "please fill all reqired fields" })
    const id = req.params.id
    let thickness = await SoleThickness.findById(id)
    if (!thickness)
        return res.status(404).json({ message: "not found" })

    let d1 = await Dye.findById(dye)
    let art1 = await Article.findById(article)
    if (!d1 || !art1)
        return res.status(400).json({ message: "please fill all reqired fields" })

    //@ts-ignore
    if (thickness.size !== size || thickness.article !== article || thickness.dye !== dye)
        if (await SoleThickness.findOne({ dye: dye, article: article, size: size, created_at: { $gte: dt1, $lt: dt2 } })) {
            return res.status(400).json({ message: "sorry !selected dye,article or size not available" })
        }

    await SoleThickness.findByIdAndUpdate(id, {
        dye: d1, article: art1, size: size, left_thickness: left_thickness, right_thickness: right_thickness,
        updated_at: new Date(),
        updated_by: req.user
    })
    return res.status(200).json(thickness)
}
export const DeleteSoleThickness = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let thickness = await SoleThickness.findById(id)
    if (!thickness)
        return res.status(404).json({ message: " not found" })
    await thickness.remove()
    return res.status(200).json(thickness)
}
export const GetMyTodaySpareDye = async (req: Request, res: Response, next: NextFunction) => {
    let dt1 = new Date()
    dt1.setDate(new Date().getDate())
    dt1.setHours(0)
    dt1.setMinutes(0)
    let sparedyes: ISpareDye[] = []
    let result: GetSpareDyeDto[] = []
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []
    if (user_ids.length > 0) {
        sparedyes = await SpareDye.find({ created_at: { $gte: dt1 }, created_by: { $in: user_ids } }).populate('dye').populate('location').populate('created_by').populate('updated_by').sort('-created_at')
    }
    else {
        sparedyes = await SpareDye.find({ created_at: { $gte: dt1 }, created_by: req.user?._id }).populate('dye').populate('location').populate('created_by').populate('updated_by').sort('-created_at')
    }
    result = sparedyes.map((dye) => {
        return {
            _id: dye._id,
            dye: { id: dye._id, value: String(dye.dye.dye_number), label: String(dye.dye.dye_number) },
            repair_required: dye.repair_required,
            is_validated: dye.is_validated,
            dye_photo: dye.dye_photo?.public_url || "",
            photo_time: dye.created_at && moment(dye.photo_time).format("LT"),
            remarks: dye.remarks || "",
            location: { id: dye.location._id, value: dye.location.name, label: dye.location.name },
            created_at: dye.created_at && moment(dye.created_at).format('LT'),
            updated_at: dye.updated_at && moment(dye.updated_at).format('LT'),
            created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username },
            updated_by: { id: dye.updated_by._id, value: dye.updated_by.username, label: dye.updated_by.username }
        }
    })
    return res.status(200).json(result)
}

export const GetSpareDyes = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let dyes: ISpareDye[] = []
    let result: GetSpareDyeDto[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)
    let user_ids = req.user?.assigned_users.map((user: IUser) => { return user._id }) || []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            if (user_ids.length > 0) {
                dyes = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).populate('dye').populate('created_by').populate('location').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: user_ids } }).countDocuments()
            }

            else {
                dyes = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).populate('dye').populate('created_by').populate('location').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
                count = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).countDocuments()
            }
        }


        if (id) {
            dyes = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate('dye').populate('created_by').populate('location').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }
        result = dyes.map((dye) => {
            return {
                _id: dye._id,
                dye: { id: dye.dye._id, value: String(dye.dye.dye_number), label: String(dye.dye.dye_number) },
                repair_required: dye.repair_required,
                dye_photo: dye.dye_photo?.public_url || "",
                remarks: dye.remarks || "",
                is_validated: dye.is_validated,
                photo_time: dye.created_at && moment(dye.photo_time).format("LT"),
                location: { id: dye.location._id, value: dye.location.name, label: dye.location.name },
                created_at: dye.created_at && moment(dye.created_at).format("DD/MM/YYYY"),
                updated_at: dye.updated_at && moment(dye.updated_at).format("DD/MM/YYYY"),
                created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username },
                updated_by: { id: dye.updated_by._id, value: dye.updated_by.username, label: dye.updated_by.username }
            }
        })
        return res.status(200).json({
            result,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(200).json({ message: "bad request" })
}


export const CreateSpareDye = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditSpareDyeDto
    let { dye, location, repair_required, remarks } = body

    if (!location || !dye || !remarks)
        if (!dye || !location)
            return res.status(400).json({ message: "please fill all reqired fields" })

    let l1 = await DyeLocation.findById(location)
    let d1 = await Dye.findById(dye)
    if (!d1) {
        return res.status(404).json({ message: "dye not found" })
    }
    if (!l1) {
        return res.status(404).json({ message: "location not found" })
    }
    let dyeObj = new SpareDye({
        dye: d1, location: l1
    })

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)
    if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } }))
        return res.status(400).json({ message: "sorry ! this dye is in machine" })
    if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
        return res.status(400).json({ message: "sorry ! dye is not available" })
    }


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
            dyeObj.dye_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    dyeObj.created_at = new Date()
    dyeObj.updated_at = new Date()
    if (remarks)
        dyeObj.remarks = remarks;
    if (req.user)
        dyeObj.created_by = req.user
    dyeObj.repair_required = repair_required;
    if (req.user)
        dyeObj.updated_by = req.user
    dyeObj.photo_time = new Date()
    await dyeObj.save()
    return res.status(201).json(dyeObj)
}

export const UpdateSpareDye = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body) as CreateOrEditSpareDyeDto
    let { dye, location, repair_required, remarks } = body
    const id = req.params.id
    let dyeObj = await SpareDye.findById(id)
    if (!dyeObj)
        return res.status(404).json({ message: "dye not found" })
    if (!location || !dye || !remarks)
        if (!dye || !location)
            return res.status(400).json({ message: "please fill all reqired fields" })

    let dt1 = new Date()
    let dt2 = new Date()
    dt2.setDate(new Date(dt2).getDate() + 1)
    dt1.setHours(0)
    dt1.setMinutes(0)

    if (await ShoeWeight.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } }))
        return res.status(400).json({ message: "sorry ! this dye is in machine" })

    //@ts-ignore
    if (dyeObj.dye !== dye)
        if (await SpareDye.findOne({ dye: dye, created_at: { $gte: dt1, $lt: dt2 } })) {
            return res.status(400).json({ message: "sorry ! dye is not available" })
        }

    let l1 = await DyeLocation.findById(location)
    let d1 = await Dye.findById(dye)
    if (!d1) {
        return res.status(404).json({ message: "dye not found" })
    }
    if (!l1) {
        return res.status(404).json({ message: "location not found" })
    }
    dyeObj.remarks = remarks;
    dyeObj.dye = d1;
    dyeObj.location = l1;
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
            dyeObj.dye_photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    dyeObj.created_at = new Date()
    dyeObj.updated_at = new Date()
    if (req.user)
        dyeObj.created_by = req.user
    dyeObj.repair_required = repair_required;
    if (req.user)
        dyeObj.updated_by = req.user
    dyeObj.photo_time = new Date()
    await dyeObj.save()
    return res.status(201).json(dyeObj)
}
export const DeleteSpareDye = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let dye = await SpareDye.findById(id)
    if (!dye)
        return res.status(404).json({ message: "spare dye not found" })
    dye.updated_at = new Date()
    if (req.user)
        dye.updated_by = req.user
    if (dye.dye_photo && dye.dye_photo._id)
        await destroyFile(dye.dye_photo._id)
    await dye.remove()
    return res.status(200).json(dye)
}


export const GetDyeStatusReport = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let reports: GetDyeStatusReportDto[] = [];

    let dt1 = new Date(String(start_date))
    dt1.setHours(0)
    dt1.setMinutes(0)
    let dt2 = new Date(String(end_date))
    dt2.setHours(0)
    dt2.setMinutes(0)

    let sparedyes = await SpareDye.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate('dye').populate('created_by').populate('location').sort('-created_at')

    let weights = await ShoeWeight.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate('dye').populate('machine').populate('article').populate('created_by').populate('updated_by').sort("-created_at")

    for (let i = 0; i < sparedyes.length; i++) {
        let dye = sparedyes[i];
        if (dye) {
            reports.push({
                _id: dye._id,
                dye: dye.dye.dye_number,
                article: "",
                size: dye.dye.size,
                std_weight: dye.dye.stdshoe_weight,
                location: dye.location.name,
                repair_required: dye.repair_required ? "Need repair" : "no Need",
                remarks: dye.remarks,
                created_at: dye.created_at && moment(dye.created_at).format("DD/MM/YYYY"),
                created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username }
            })
        }
    }
    for (let i = 0; i < weights.length; i++) {
        let dye = weights[i];
        if (dye) {
            reports.push({
                _id: dye._id,
                dye: dye.dye.dye_number,
                article: dye.article.name || "",
                size: dye.dye.size,
                std_weight: dye.dye.stdshoe_weight,
                location: dye.machine.name || "",
                repair_required: "",
                remarks: "",
                created_at: dye.created_at && moment(dye.created_at).format("DD/MM/YYYY"),
                created_by: { id: dye.created_by._id, value: dye.created_by.username, label: dye.created_by.username }
            })
        }
    }

    return res.status(200).json(reports)
}