import { NextFunction, Request, Response } from "express"
import { IChecklist, IChecklistkBody } from "../types/checklist.types";
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { isvalidDate } from "../utils/isValidDate";
import { Checklist } from "../models/checklist/checklist.model";


export const CreateChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const { checklist_description, frequency_type, upto_date, frequency_value } = req.body as IChecklistkBody & { upto_date: string }

    let id = req.params.id
    if (!checklist_description || !frequency_type || !id || !upto_date)
        return res.status(400).json({ message: "please provide all required fields" })
    if (frequency_type === "custom days" && !frequency_value) {
        return res.status(400).json({ message: "please provide valid frequency value" })
    }
    if (!isvalidDate(new Date(upto_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    let user = await User.findById(id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })

    let boxes: IChecklist['boxes'] = []
    if (upto_date) {
        if (frequency_type === "daily") {
            let current_date = new Date()
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + 1)
            }
        }
        if (frequency_type === "custom days") {
            let current_date = new Date()
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + frequency_value)
            }
        }
        if (frequency_type === "weekly") {
            let current_date = new Date()
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + 7)
            }
        }
        if (frequency_type === "monthly") {
            let current_date = new Date()
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setMonth(new Date(current_date).getMonth() + 1)
            }
        }
    }
    if (user) {
        let checklist = await new Checklist({
            person: user,
            checklist_description, frequency_type, boxes, created_at: new Date(), updated_at: new Date(), created_by: req.user, updated_by: req.user
        })
        if (frequency_value)
            checklist.frequency_value = frequency_value
        await checklist.save()
    }
    return res.status(201).json({ message: `new Checklist added` });
}

export const EditChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const { checklist_description, user_id } = req.body as IChecklistBody & { upto_date: string, user_id: string }

    let id = req.params.id
    if (!checklist_description)
        return res.status(400).json({ message: "please provide all required fields" })

    let user = await User.findById(user_id)
    let checklist = await Checklist.findById(id)
    if (!checklist)
        return res.status(404).json({ message: 'checklist not exists' })

    checklist.checklist_description = checklist_description
    if (user) {
        checklist.person = user
    }
    await checklist.save()
    return res.status(200).json({ message: `Checklist updated` });
}


export const AddMoreBoxes = async (req: Request, res: Response, next: NextFunction) => {
    const { upto_date } = req.body as IChecklistBody & { upto_date: string }
    let id = req.params.id
    if (!id || !upto_date)
        return res.status(400).json({ message: "please provide all required fields" })

    if (!isvalidDate(new Date(upto_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    let checklist = await Checklist.findById(id)
    if (!checklist)
        return res.status(404).json({ message: 'checklist not exists' })
    let boxes: IChecklist['boxes'] = checklist.boxes
    if (upto_date) {
        if (checklist.frequency_type === "daily") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + 1)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + 1)
                }
            }
        }
        if (checklist.frequency_type === "custom days") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + checklist.frequency_value)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + checklist.frequency_value)
                }
            }
        }
        if (checklist.frequency_type === "weekly") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + 7)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + 7)
                }
            }
        }
        if (checklist.frequency_type === "monthly") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setMonth(new Date(current_date).getMonth() + 1)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setMonth(new Date(current_date).getMonth() + 1)
                }
            }
        }
    }
    checklist.boxes = boxes
    checklist.updated_by = req.user
    checklist.updated_at = new Date()
    await checklist.save()
    return res.status(201).json({ message: `more boxes added successfully` });
}

export const DeleteChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await Checklist.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" })
    }
    await checklist.remove()
    return res.status(200).json({ message: `Checklist deleted` });
}

export const GetCheckLists = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let checklists = await Checklist.find().populate('person').populate('updated_by').populate('created_by').sort('-created_at')

        if (start_date && end_date) {
            let dt1 = new Date(String(start_date))
            let dt2 = new Date(String(end_date))
            checklists = checklists.map((checklist) => {
                let updated_checklist_boxes = checklist.boxes
                updated_checklist_boxes = checklist.boxes.filter((box) => {
                    if (box.date >= dt1 && box.date <= dt2)
                        return box
                })
                checklist.boxes = updated_checklist_boxes
                return checklist
            })
        }


        if (id) {
            let user = await User.findById(id)
            if (user) {
                checklists = checklists.filter((checklist) => {
                    return checklist.person.username === user?.username
                })
            }
        }

        let count = checklists.length
        checklists = checklists.slice((page - 1) * limit, limit * page)

        return res.status(200).json({
            checklists,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetMyCheckLists = async (req: Request, res: Response, next: NextFunction) => {
    let checklists = await Checklist.find().populate('person').populate('updated_by').populate('created_by').sort('-created_at')
    checklists = checklists.filter((checklist) => {
        return checklist.person.username === req.user?.username
    })
    let tmpCheckLists: {
        checklist: IChecklist,
        previous_date: Date,
        next_date: Date,
        box: {
            date: Date,
            is_completed: boolean
        }

    }[] = []

    checklists.map((checklist) => {
        let small_dates = checklist.boxes.filter((box) => {
            return new Date(box.date) <= new Date()
        })
        let large_dates = checklist.boxes.filter((box) => {
            return new Date(box.date) > new Date()
        })
        tmpCheckLists.push({
            checklist: checklist,
            previous_date: small_dates[small_dates.length - 1].date,
            next_date: large_dates[0].date,
            box: small_dates[small_dates.length - 1]
        })
    })
    return res.status(200).json(tmpCheckLists)
}

export const ToogleMyChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let date = new Date(String(req.query.date))
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await Checklist.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" })
    }

    let updated_checklist_boxes = checklist.boxes
    updated_checklist_boxes = checklist.boxes.map((box) => {
        let updated_box = box
        console.log(updated_box.date)
        console.log(date)
        if (updated_box.date === date)
            updated_box.is_completed = !updated_box.is_completed
        return updated_box
    })
    checklist.boxes = updated_checklist_boxes
    await checklist.save()
    return res.status(200).json("successfully changed")
}