import { NextFunction, Request, Response } from "express"
import { MessageTemplate } from "../models/watemplates/watemplate.model"
import isMongoId from "validator/lib/isMongoId"
import { User } from "../models/users/user.model"
import { clients } from "../utils/CreateWhatsappClient"
import { clearTimeout } from "timers"
import { isvalidDate } from "../utils/isValidDate"
import cron from "cron"
import { TodoManager } from "../app"
import { GetRunningCronString } from "../utils/GetRunningCronString"
import { GetRefreshCronString } from "../utils/GetRefreshCronString"
import { ITodo, ITodoBody } from "../types/todo.types"
import { Todo } from "../models/todos/todo.model"
import { IUser } from "../types/user.types"
import { todo_timeouts } from "../utils/handleTodo"


//get
export const GetTodos = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let todos: ITodo[] = []
    if (hidden === "true")
        todos = await Todo.find({ is_hidden: true }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
    else
        todos = await Todo.find({ is_hidden: false }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
    return res.status(200).json(todos)
}
//post/put/delete/patch
export const CreateTodo = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let {
        serial_no,
        title,
        subtitle,
        category,
        contacts,
        run_once,
        frequency_type,
        frequency_value,
        start_date,
        connected_user } = body as
        {
            serial_no: number,
            title: string,
            subtitle: string,
            category: string,
            contacts: {
                mobile: string,
                name: string,
                is_sent: boolean,
                is_completed: false
            }[],
            run_once: boolean,
            frequency_type: string,
            frequency_value: string,

            cron_string: string,
            refresh_cron_string: string,
            next_run_date: Date,
            next_refresh_date: Date,
            start_date: Date,
            connected_user: string
        }

    if (!title || !subtitle || !contacts || !frequency_type || !start_date || !frequency_value)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(start_date)) {
        return res.status(400).json({ message: "provide valid start date" })
    }

    if (contacts.length == 0)
        return res.status(400).json({ "message": "must provide one contact" })
    let count = await Todo.countDocuments()
    serial_no = serial_no || count + 1
    let todo = new Todo({
        serial_no: serial_no,
        title: title,
        subtitle: subtitle,
        category: category,
        contacts: contacts,
        connected_user: connected_user,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
    })
    todo.run_once = Boolean(run_once)
    todo.cron_string = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.start_date = new Date(start_date)
    todo.refresh_cron_string = GetRefreshCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.frequency_value = frequency_value
    todo.frequency_type = frequency_type
    todo.is_active = false
    todo.next_run_date = new Date(cron.sendAt(todo.cron_string))
    todo.next_refresh_date = new Date(cron.sendAt(todo.refresh_cron_string))
    todo.running_key = String(todo._id) + "todo"
    todo.refresh_key = String(todo._id) + "refresh"
    await todo.save()
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    return res.status(201).json({ "message": "todo created" })
}
export const UpdateTodo = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let {
        serial_no,
        title,
        subtitle,
        category,
        contacts,
        run_once,
        frequency_type,
        frequency_value,
        start_date,
        connected_user } = body as
        {
            serial_no: number,
            title: string,
            subtitle: string,
            category: string,
            contacts: {
                mobile: string,
                name: string,
                is_sent: boolean,
                is_completed: false
            }[],
            run_once: boolean,
            frequency_type: string,
            frequency_value: string,

            cron_string: string,
            refresh_cron_string: string,
            next_run_date: Date,
            next_refresh_date: Date,
            start_date: Date,
            connected_user: string
        }

    if (!title || !subtitle || !contacts || !frequency_type || !start_date || !frequency_value)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(start_date)) {
        return res.status(400).json({ message: "provide valid start date" })
    }

    if (contacts.length == 0)
        return res.status(400).json({ "message": "must provide one contact" })
    const id = req.params.id
    let todo = await Todo.findById(id)
    if (!todo)
        return res.status(400).json({ message: `todo not found` });
    let user = await User.findById(connected_user)
    if (user)
        todo.connected_user = user
    todo.serial_no = serial_no
    todo.title = title
    todo.subtitle = subtitle
    todo.category = category
    todo.contacts = contacts
    todo.updated_at = new Date()
    todo.updated_by = req.user
    todo.run_once = Boolean(todo.run_once)
    todo.cron_string = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.start_date = new Date(start_date)
    todo.refresh_cron_string = GetRefreshCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.frequency_value = frequency_value
    todo.frequency_type = frequency_type
    todo.next_run_date = new Date(cron.sendAt(todo.cron_string))
    todo.next_refresh_date = new Date(cron.sendAt(todo.refresh_cron_string))
    await todo.save()
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    return res.status(201).json({ "message": "todo created" })
}

export const StartTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todo = await Todo.findById(id)
    if (!todo)
        return res.status(400).json({ message: "not found" })

    todo_timeouts.forEach((item) => {
        if (String(item.id) === String(todo?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    todo.is_active = false
    todo.is_paused = false
    await todo.save()
    return res.status(200).json({ message: "all todo stopped" })
}
export const StartAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todos = await Todo.find()
    todos.forEach(async (todo) => {
        todo_timeouts.forEach((item) => {
            if (String(item.id) === String(todo?._id)) {
                clearTimeout(item.timeout)
            }
        })
        if (TodoManager.exists(todo.running_key))
            TodoManager.deleteJob(todo.running_key)
        if (TodoManager.exists(todo.refresh_key))
            TodoManager.deleteJob(todo.refresh_key)
        todo.is_active = false
        todo.is_paused = false
        await todo.save()
    })

    return res.status(200).json({ message: "all todo stopped" })
}

export const StopTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todo = await Todo.findById(id)
    if (!todo)
        return res.status(400).json({ message: "not found" })

    todo_timeouts.forEach((item) => {
        if (String(item.id) === String(todo?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    todo.is_active = false
    todo.is_paused = false
    await todo.save()
    return res.status(200).json({ message: "all todo stopped" })
}
export const StopAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todos = await Todo.find()
    todos.forEach(async (todo) => {
        todo_timeouts.forEach((item) => {
            if (String(item.id) === String(todo?._id)) {
                clearTimeout(item.timeout)
            }
        })
        if (TodoManager.exists(todo.running_key))
            TodoManager.deleteJob(todo.running_key)
        if (TodoManager.exists(todo.refresh_key))
            TodoManager.deleteJob(todo.refresh_key)
        todo.is_active = false
        todo.is_paused = false
        await todo.save()
    })

    return res.status(200).json({ message: "all todo stopped" })
}

export const ToogleHideTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todo = await Todo.findById(id)
    if (!todo)
        return res.status(400).json({ message: "not found" })
    await Todo.findByIdAndUpdate(todo._id, {
        is_hidden: !todo.is_hidden
    })
    return res.status(200).json({ message: "todo hidden" })
}
