import { NextFunction, Request, Response } from "express"
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { isvalidDate } from "../utils/isValidDate";
import { ITodoBody } from "../types/todo.types";
import { Todo } from "../models/todo/todo.model";


export const CreateTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { work_title, work_description, category } = req.body as ITodoBody
    let id = req.params.id
    if (!work_title || !work_description || !id)
        return res.status(400).json({ message: "please provide all required fields" })

    let user = await User.findById(id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })
    let todo = new Todo({
        work_title, work_description, category,
        person: user,
        created_at: new Date(), updated_at: new Date(), created_by: req.user, updated_by: req.user
    })
    await todo.save()
    return res.status(201).json(todo);
}
export const EditTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { work_title, work_description, category, user_id, status } = req.body as ITodoBody & { user_id: string }

    let id = req.params.id
    if (!work_title || !work_description || !id)
        return res.status(400).json({ message: "please provide all required fields" })
    let user = await User.findById(user_id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })

    await Todo.findByIdAndUpdate(id, {
        work_title, work_description, category,
        person: user, status
    })
    return res.status(200).json({ message: `Todo updated` });
}

export const DeleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let todo = await Todo.findById(id)
    if (!todo) {
        return res.status(404).json({ message: "todo not found" })
    }
    await todo.remove()
    return res.status(200).json({ message: `todo deleted` });
}

export const HideTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let todo = await Todo.findById(id)
    if (!todo) {
        return res.status(404).json({ message: "todo not found" })
    }
    todo.is_hidden = true
    await todo.remove()
    return res.status(200).json({ message: `todo hidden` });
}

export const GetTodos = async (req: Request, res: Response, next: NextFunction) => {
    let show_hidden = Number(req.query.show_hidden)
    let staus = Number(req.query.staus)
    let id = req.query.id
    let todos = await Todo.find().populate('person').populate('updated_by').populate('created_by').sort('-created_at')

    if (id) {
        let user = await User.findById(id)
        if (user) {
            todos = todos.filter((todo) => {
                return todo.person.username === user?.username
            })
        }
    }
    return res.status(200).json(todos)
}
export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let todos = await Todo.find().populate('person').populate('updated_by').populate('created_by').sort('-created_at')

    todos = todos.filter((todo) => {
        return todo.person.username === req.user?.username && todo.status === "pending" || todo.status === "pending"
    })
    return res.status(200).json(todos)
}



