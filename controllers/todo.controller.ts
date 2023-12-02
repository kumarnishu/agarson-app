import { NextFunction, Request, Response } from "express"
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { ITodo, ITodoBody } from "../types/todo.types";
import { Todo } from "../models/todo/todo.model";

//get
export const GetTodos = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.query.id
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let todos: ITodo[] = []
    let count = 0
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            todos = await Todo.find({ is_hidden: false }).populate('person').populate('updated_by').populate('created_by').sort('-created_at').populate("replies.created_by").skip((page - 1) * limit).limit(limit)
            count = await Todo.find().countDocuments()
        }

        if (id) {
            todos = await Todo.find({ person: id, is_hidden: false }).populate('person').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
        }
        if (start_date && end_date) {
            let dt1 = new Date(String(start_date))
            let dt2 = new Date(String(end_date))
            todos = todos.filter((todo) => {
                if (todo.created_at >= dt1 && todo.created_at <= dt2)
                    return todo
            })
        }

        return res.status(200).json({
            todos,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let todos = await Todo.find({ person: req.user._id, is_hidden: false }).populate('person').populate('updated_by').populate('created_by').sort('-created_at')
    return res.status(200).json(todos)
}


//put/post/patch/delte
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
        person: user, staus: 'pending',
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

export const BulkHideTodos = async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body as { ids: string[] };
    ids.forEach(async (id) => {
        await Todo.findByIdAndUpdate(id, {
            is_hidden: true
        })
    })
    return res.status(200).json({ message: `todos hidden` });
}

export const UpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status, reply } = req.body as { status: string, reply: string }

    if (!status)
        return res.status(400).json({ message: " status not provided" })

    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let todo = await Todo.findById(id)
    if (!todo) {
        return res.status(404).json({ message: "todo not found" })
    }
    todo.status = status
    let replies = todo.replies
    replies.push({
        reply,
        created_by: req.user,
        timestamp: new Date()
    })
    todo.replies = replies
    await todo.save()
    return res.status(200).json({ message: `todo staus updated` });
}





