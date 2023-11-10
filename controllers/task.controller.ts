import { NextFunction, Request, Response } from "express"
import { ITaskBody } from "../types/task.types";
import { Task } from "../models/tasks/task.model";
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";


export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    const { task_description, frequency_type } = req.body as ITaskBody
    let id = req.params.id
    if (!task_description || !frequency_type || !id)
        return res.status(400).json({ message: "please provide all required fields" })
    let user = await User.findById(id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })
    if (user) {
        let boxes = [{ date: new Date(), is_completed: false }]
        await new Task({
            task_description, frequency_type, boxes, created_at: new Date(), updated_at: new Date(), created_by: user, updated_by: user
        }).save()
    }
    return res.status(201).json({ message: `new Task added` });
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

export const GetTasks = async (req: Request, res: Response, next: NextFunction) => {
    let tasks = await Task.find().populate('updated_by').populate('created_by')
    return res.status(200).json(tasks);
}


