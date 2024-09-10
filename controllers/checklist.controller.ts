import { NextFunction, Request, Response } from "express"
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { isvalidDate } from "../utils/isValidDate";
import { Checklist, ChecklistBox, ChecklistCategory, IChecklist } from "../models/checklist/checklist.model";
import { CreateOrEditDropDownDto, DropDownDto } from "../dtos/common/dropdown.dto";
import { CreateOrEditChecklistDto, GetChecklistDto } from "../dtos/checklist/checklist.dto";


export const GetAllChecklistCategory = async (req: Request, res: Response, next: NextFunction) => {
    let result = await ChecklistCategory.find();
    let data: DropDownDto[];
    data = result.map((r) => { return { id: r._id, label: r.category, value: r.category } });
    return res.status(200).json(data)
}

export const CreateChecklistCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.body as CreateOrEditDropDownDto
    if (!key) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await ChecklistCategory.findOne({ category: key.toLowerCase() }))
        return res.status(400).json({ message: "already exists this category" })
    let result = await new ChecklistCategory({
        category: key,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateChecklistCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.body as {
        key: string,
    }
    if (!key) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldlocation = await ChecklistCategory.findById(id)
    if (!oldlocation)
        return res.status(404).json({ message: "category not found" })
    console.log(key, oldlocation.category)
    if (key !== oldlocation.category)
        if (await ChecklistCategory.findOne({ category: key.toLowerCase() }))
            return res.status(400).json({ message: "already exists this category" })
    oldlocation.category = key
    oldlocation.updated_at = new Date()
    if (req.user)
        oldlocation.updated_by = req.user
    await oldlocation.save()
    return res.status(200).json(oldlocation)

}
export const DeleteChecklistCategory = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "category id not valid" })
    let category = await ChecklistCategory.findById(id);
    if (!category) {
        return res.status(404).json({ message: "category not found" })
    }
    await category.remove();
    return res.status(200).json({ message: "category deleted successfully" })
}
//get
export const GetChecklists = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let category = req.query.category
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let checklists: IChecklist[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let ids = req.user?.assigned_users.map((id) => { return id._id })
    let result: GetChecklistDto[] = []

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (req.user?.is_admin && !id) {
            {
                checklists = await Checklist.find().populate('created_by').populate('updated_by').populate('category').populate('user').sort('updated_at').skip((page - 1) * limit).limit(limit)
                count = await Checklist.find().countDocuments()
            }
        }
        else if (ids && ids.length > 0 && !id) {
            {
                checklists = await Checklist.find({ created_by: { $in: ids } }).populate('created_by').populate('updated_by').populate('category').populate('user').sort('updated_at').skip((page - 1) * limit).limit(limit)
                count = await Checklist.find({ created_by: { $in: ids } }).countDocuments()
            }
        }
        else if (!id) {
            checklists = await Checklist.find({ created_by: req.user?._id }).populate('created_by').populate('updated_by').populate('category').populate('user').sort('updated_at').skip((page - 1) * limit).limit(limit)
            count = await Checklist.find({ created_by: req.user?._id }).countDocuments()
        }

        else {
            checklists = await Checklist.find({ created_by: id }).populate('created_by').populate('updated_by').populate('category').populate('user').sort('updated_at').skip((page - 1) * limit).limit(limit)
            count = await Checklist.find({ created_by: id }).countDocuments()
        }



        for (let i = 0; i < checklists.length; i++) {
            let ch = checklists[i];
            if (ch && ch.category) {
                let boxes = await ChecklistBox.find({ checklist: ch._id, date: { $gte: dt1, $lt: dt2 } }).sort('date');
                let dtoboxes = boxes.map((b) => { return { _id: b._id, checked: b.checked, date: b.date.toString() } });
                result.push({
                    _id: ch._id,
                    work_title: ch.work_title,
                    details1: ch.details1,
                    details2: ch.details2,
                    end_date: ch.end_date.toString(),
                    category: { id: ch.category._id, label: ch.category.category, value: ch.category.category },
                    frequency: ch.frequency,
                    user: { id: ch.user._id, label: ch.user.username, value: ch.user.username },
                    created_at: ch.created_at.toString(),
                    updated_at: ch.updated_at.toString(),
                    boxes: dtoboxes,
                    created_by: { id: ch.created_by._id, value: ch.created_by.username, label: ch.created_by.username },
                    updated_by: { id: ch.updated_by._id, value: ch.updated_by.username, label: ch.updated_by.username }
                })
            }
        }

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



//post/put/delete/patch
export const CreateChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const { category,
        work_title,
        details1,
        details2,
        user_id,
        frequency,
        end_date } = req.body as CreateOrEditChecklistDto
    console.log(req.body)
    if (!category || !work_title || !user_id || !frequency || !end_date)
        return res.status(400).json({ message: "please provide all required fields" })

    if (!isvalidDate(new Date(end_date)) || new Date(end_date) <= new Date())
        return res.status(400).json({
            message: "please provide valid end date"
        })
    let user = await User.findById(user_id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })

    let checklist = new Checklist({
        category: category,
        work_title: work_title,
        details1: details1,
        end_date: new Date(end_date),
        details2: details2,
        user: user._id,
        frequency: frequency,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })
    await checklist.save();

    if (end_date && frequency == "daily") {
        let current_date = new Date()
        current_date.setDate(1)
        while (current_date <= new Date(end_date)) {
            await new ChecklistBox({
                date: new Date(current_date),
                checked: false,
                checklist: checklist._id,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: req.user,
                updated_by: req.user
            }).save()
            current_date.setDate(new Date(current_date).getDate() + 1)
        }
    }
    if (end_date && frequency == "weekly") {
        let current_date = new Date()
        current_date.setDate(1)
        while (current_date <= new Date(end_date)) {
            await new ChecklistBox({
                date: new Date(current_date),
                checked: false,
                checklist: checklist._id,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: req.user,
                updated_by: req.user
            }).save()
            current_date.setDate(new Date(current_date).getDate() + 6)
        }
    }
    return res.status(201).json({ message: `new Checklist added` });
}

export const EditChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const {
        work_title,
        details1,
        details2,
        user_id } = req.body as CreateOrEditChecklistDto
    if (!work_title || !user_id)
        return res.status(400).json({ message: "please provide all required fields" })

    let id = req.params.id

    let checklist = await Checklist.findById(id)
    if (!checklist)
        return res.status(404).json({ message: 'checklist not exists' })

    if (user_id) {
        let user = await User.findById(user_id)
        if (user)
            checklist.user = user
    }
    checklist.work_title = work_title
    checklist.details1 = details1
    checklist.details2 = details2

    await checklist.save()
    return res.status(200).json({ message: `Checklist updated` });
}


export const DeleteChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await Checklist.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" })
    }
    await ChecklistBox.deleteMany({ checklist: checklist._id })
    await checklist.remove()
    return res.status(200).json({ message: `Checklist deleted` });
}


export const ToogleChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await ChecklistBox.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist box not found" })
    }

    await ChecklistBox.findByIdAndUpdate(id, { checked: !checklist.checked })
    return res.status(200).json("successfully marked")
}