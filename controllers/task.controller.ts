import { NextFunction, Request, Response } from "express"
import { ITask, ITaskBody } from "../types/task.types";
import { Task } from "../models/tasks/task.model";
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { isvalidDate } from "../utils/isValidDate";

//get
export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let tasks: ITask[] = []
    let count = 0

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (id) {
            tasks = await Task.find({ created_by: req.user._id, person: id }).populate('person').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Task.find({ created_by: req.user._id, person: id }).countDocuments()
        }
        if (!id) {
            tasks = await Task.find({ created_by: req.user._id }).populate('person').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Task.find({ created_by: req.user._id }).countDocuments()
        }

        if (start_date && end_date) {
            let dt1 = new Date(String(start_date))
            let dt2 = new Date(String(end_date))
            tasks = tasks.map((task) => {
                let updated_task_boxes = task.boxes
                updated_task_boxes = task.boxes.filter((box) => {
                    if (box.date >= dt1 && box.date <= dt2)
                        return box
                })
                task.boxes = updated_task_boxes
                return task
            })
        }

        return res.status(200).json({
            tasks,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetMyTasks = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find({ person: req.user._id }).populate('person').populate('updated_by').populate('created_by').sort('-created_at')
    return res.status(200).json(tasks)
}


//post/put/delete/patch
export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { task_description, frequency_type, upto_date, frequency_value, start_date } = req.body as ITaskBody & { upto_date: string, start_date: string }

    let id = req.params.id
    if (!task_description || !frequency_type || !id || !upto_date)
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

    let boxes: ITask['boxes'] = []
    if (upto_date) {
        if (frequency_type === "daily") {
            let current_date = new Date(start_date)
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + 1)
            }
        }
        if (frequency_type === "custom days") {
            let current_date = new Date(start_date)
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + frequency_value)
            }
        }
        if (frequency_type === "weekly") {
            let current_date = new Date(start_date)
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setDate(new Date(current_date).getDate() + 7)
            }
        }
        if (frequency_type === "monthly") {
            let current_date = new Date(start_date)
            while (current_date <= new Date(upto_date)) {
                boxes.push({ date: new Date(current_date), is_completed: false })
                current_date.setMonth(new Date(current_date).getMonth() + 1)
            }
        }
    }
    if (user) {
        let task = await new Task({
            person: user,
            task_description, frequency_type, boxes, created_at: new Date(), updated_at: new Date(), created_by: req.user, updated_by: req.user
        })
        if (frequency_value)
            task.frequency_value = frequency_value
        await task.save()
    }
    return res.status(201).json({ message: `new Task added` });
}

export const EditTask = async (req: Request, res: Response, next: NextFunction) => {
    const { task_description, user_id } = req.body as ITaskBody & { upto_date: string, user_id: string }

    let id = req.params.id
    if (!task_description)
        return res.status(400).json({ message: "please provide all required fields" })

    let user = await User.findById(user_id)
    let task = await Task.findById(id)
    if (!task)
        return res.status(404).json({ message: 'task not exists' })

    task.task_description = task_description
    if (user) {
        task.person = user
    }
    await task.save()
    return res.status(200).json({ message: `Task updated` });
}


export const AddMoreBoxes = async (req: Request, res: Response, next: NextFunction) => {
    const { upto_date } = req.body as ITaskBody & { upto_date: string }
    let id = req.params.id
    if (!id || !upto_date)
        return res.status(400).json({ message: "please provide all required fields" })

    if (!isvalidDate(new Date(upto_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    let task = await Task.findById(id)
    if (!task)
        return res.status(404).json({ message: 'task not exists' })
    let boxes: ITask['boxes'] = task.boxes
    if (upto_date) {
        if (task.frequency_type === "daily") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + 1)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + 1)
                }
            }
        }
        if (task.frequency_type === "custom days") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + task.frequency_value)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + task.frequency_value)
                }
            }
        }
        if (task.frequency_type === "weekly") {
            if (boxes.length > 0) {
                let current_date = new Date(boxes[boxes.length - 1].date)
                current_date.setDate(new Date(current_date).getDate() + 7)
                while (current_date <= new Date(upto_date)) {
                    boxes.push({ date: new Date(current_date), is_completed: false })
                    current_date.setDate(new Date(current_date).getDate() + 7)
                }
            }
        }
        if (task.frequency_type === "monthly") {
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
    task.boxes = boxes
    task.updated_by = req.user
    task.updated_at = new Date()
    await task.save()
    return res.status(201).json({ message: `more boxes added successfully` });
}

export const DeleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let task = await Task.findById(id)
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }
    await task.remove()
    return res.status(200).json({ message: `Task deleted` });
}


export const ToogleMyTask = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let date = new Date(String(req.query.date))
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let task = await Task.findById(id)
    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }

    let updated_task_boxes = task.boxes
    updated_task_boxes = task.boxes.map((box) => {
        let updated_box = box
        if (updated_box.date.getDate() === date.getDate() && updated_box.date.getMonth() === date.getMonth() && updated_box.date.getFullYear() === date.getFullYear())
            updated_box.is_completed = !updated_box.is_completed
        return updated_box
    })
    task.boxes = updated_task_boxes
    await task.save()
    return res.status(200).json("successfully changed")
}