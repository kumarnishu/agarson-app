import { NextFunction, Request, Response } from "express";
import xlsx from "xlsx"
import { Article } from "../models/stocks/article.model";
import { uploadFileToCloud } from "../utils/uploadFile.util";
import isMongoId from "validator/lib/isMongoId";
import { Stock } from "../models/stocks/stock.model";
import { IArticle, IStock } from "../types/stock.types";

export const GetArticles = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let articles: IArticle[] = []
    let count = 0

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        articles = await Article.find().populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
        count = await Article.find().countDocuments()
        return res.status(200).json({
            articles,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetStocks = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let stocks: IStock[] = []
    let count = 0

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        stocks = await Stock.find().populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
        count = await Stock.find().countDocuments()
        return res.status(200).json({
            stocks,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetArticleStocks = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.params.id
    let stocks: IStock[] = []
    let count = 0
    let article = await Article.findById(id)
    if (!article)
        return res.status(404).json({ message: "article not found" })

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        stocks = await Stock.find({ article: id }).populate('created_by').populate('updated_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
        count = await Stock.find({ article: id }).countDocuments()
        return res.status(200).json({
            stocks,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}
export const FuzzySearchArticles = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let articles: IArticle[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {
            articles = await Article.find({
                $or: [
                    { name: { $regex: key[0], $options: 'i' } },
                    { hsn: { $regex: key[0], $options: 'i' } },
                    { sole: { $regex: key[0], $options: 'i' } },
                    { upper: { $regex: key[0], $options: 'i' } },
                    { toe: { $regex: key[0], $options: 'i' } },
                    { lining: { $regex: key[0], $options: 'i' } },
                    { socks: { $regex: key[0], $options: 'i' } },
                    { sizes: { $regex: key[0], $options: 'i' } },
                ]

            }
            ).populate('updated_by').populate('created_by').sort('-created_at')
        }
        if (key.length == 2) {
            articles = await Article.find({
                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },

                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at')
        }
        if (key.length == 3) {
            articles = await Article.find({
                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },

                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at')
        }
        if (key.length == 4) {
            articles = await Article.find({
                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },

                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { hsn: { $regex: key[0], $options: 'i' } },
                            { sole: { $regex: key[0], $options: 'i' } },
                            { upper: { $regex: key[0], $options: 'i' } },
                            { toe: { $regex: key[0], $options: 'i' } },
                            { lining: { $regex: key[0], $options: 'i' } },
                            { socks: { $regex: key[0], $options: 'i' } },
                            { sizes: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at')
        }
        let count = articles.length
        articles = articles.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            articles,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })

}


export const ActivateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let article = await Article.findById(id);

    if (!article) {
        return res.status(404).json({ message: "article not found" })
    }
    article.is_active = true
    await article.save()
    return res.status(400).json({ message: "article activated" })
}

export const DeactivateArticle = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let article = await Article.findById(id);

    if (!article) {
        return res.status(404).json({ message: "article not found" })
    }
    article.is_active = false
    await article.save()
    return res.status(400).json({ message: "article deactivated" })
}

export const ActivateStock = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const size = req.query.size
    if (!size)
        return res.status(400).json({ message: "provide all required fields" })
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let stock = await Stock.findById({ article: id, size: size });

    if (!stock) {
        return res.status(404).json({ message: "stock not found" })
    }
    stock.is_active = true
    await stock.save()
    return res.status(400).json({ message: "stock activated" })
}
export const DeactivateStock = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const size = req.query.size
    if (!size)
        return res.status(400).json({ message: "provide all required fields" })
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let stock = await Stock.findById({ article: id, size: size });

    if (!stock) {
        return res.status(404).json({ message: "stock not found" })
    }
    stock.is_active = false
    await stock.save()
    return res.status(400).json({ message: "stock deactivated" })
}
export const CreateArticle = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name } = body as {
        name: string,
        sole: string,
        upper: string,
        toe: string,
        lining: string,
        socks: string,
        sizes: string
    }
    if (!name) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (await Article.findOne({ name: name.toLowerCase().trim() }))
        return res.status(403).json({ message: `${name} already exists` });


    let article = new Article({
        ...body,
        created_by: req.user,
        updated_by: req.user,
        created_at: new Date(),
        updated_at: new Date()
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
            article.photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    await article.save()
    return res.status(201).json(article)
}
export const UpdateArticle = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { name } = body as {
        name: string,
        sole: string,
        upper: string,
        toe: string,
        lining: string,
        socks: string,
        sizes: string
    }

    if (!name) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let article = await Article.findById(id);

    if (!article) {
        return res.status(404).json({ message: "article not found" })
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
            article.photo = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    if (name !== article.name)
        if (await Article.findOne({ name: name.toLowerCase().trim() }))
            return res.status(403).json({ message: `${name} already exists` });

    await Article.findByIdAndUpdate(article._id, {
        ...body,
        photo: article.photo,
        created_by: req.user,
        updated_by: req.user,
        created_at: new Date(),
        updated_at: new Date()
    })
    return res.status(200).json({ message: "article updated" })
}

export const CreateArticleStock = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { stock, size, color, weight } = body as {
        stock: number,
        size: string,
        color: string,
        weight: string
    }

    if (!stock || !size || !color || !weight) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let article = await Article.findById(id);

    if (!article) {
        return res.status(404).json({ message: "article not found" })
    }


    let getstock = await Stock.findOne({ article: id, size: size })
    if (getstock)
        return res.status(400).json({ message: `stock already exists` });
    else {
        await new Stock({
            ...body,
            article: article,
            created_by: req.user,
            updated_by: req.user,
            created_at: new Date(),
            updated_at: new Date()
        }).save()
    }

}
export const UpdateArticleStock = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { stock, size, color, weight } = body as {
        stock: number,
        size: string,
        color: string,
        weight: string
    }

    if (!stock || !size || !color || !weight) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "article id not valid" })
    let article = await Article.findById(id);

    if (!article) {
        return res.status(404).json({ message: "article not found" })
    }


    let getstock = await Stock.findOne({ article: id, size: size })
    if (!getstock)
        return res.status(400).json({ message: `stock not avaialble to update` });

    await Stock.findByIdAndUpdate(getstock._id, {
        ...body,
        updated_by: req.user,
        updated_at: new Date()
    })
    return res.status(200).json({ message: "stock updated" })
}

export const BulkUploadStockFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: any[] = []
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
        let workbook_response: any[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response)
    }
    return res.status(200).json(result);
}