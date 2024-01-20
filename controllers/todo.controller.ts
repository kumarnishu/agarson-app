import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { User } from "../models/users/user.model"
import { clearTimeout } from "timers"
import { isvalidDate } from "../utils/isValidDate"
import cron from "cron"
import { TodoManager } from "../app"
import { GetRunningCronString } from "../utils/GetRunningCronString"
import { GetRefreshCronString } from "../utils/GetRefreshCronString"
import { ITodo, ITodoTemplate } from "../types/todo.types"
import { Todo } from "../models/todos/todo.model"
import { HandleTodoMessage, todo_timeouts } from "../utils/handleTodo"
import { clients } from "../utils/CreateWhatsappClient"
import xlsx from "xlsx"

//get
export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = req.query.hidden
    let todos = await Todo.find({ is_hidden: hidden }).populate('connected_user').populate('replies.created_by').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
    todos = todos.filter((todo) => {
        let numbers = todo.contacts.map((c) => { return c.mobile })
        console.log(numbers)
        if (numbers.includes(String(req.user.mobile)))
            return todo
    })
    console.log(todos.length)
    return res.status(200).json(todos)
}
export const GetTodos = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = req.query.hidden
    let visible = req.query.visible
    let mobile = req.query.mobile
    let showall = false
    if (String(hidden) === "false" && String(visible) === "false") {
        showall = true
    }
    if (String(hidden) !== "false" && String(visible) !== "false") {
        showall = true
    }

    let todos: ITodo[] = []
    if (showall) {
        if (!mobile) {
            todos = await Todo.find().populate('connected_user').populate('replies.created_by').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
        }
        if (mobile) {
            todos = await Todo.find().populate('connected_user').populate('replies.created_by').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
            todos = todos.filter((todo) => {
                let numbers = todo.contacts.map((c) => { return c.mobile })
                console.log(numbers)
                if (numbers.includes(String(mobile)))
                    return todo
            })
        }
    }
    if (!showall) {
        if (!mobile) {
            todos = await Todo.find({ is_hidden: hidden }).populate('connected_user').populate('replies.created_by').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
        }
        if (mobile) {
            todos = await Todo.find({ is_hidden: hidden }).populate('connected_user').populate('replies.created_by').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
            todos = todos.filter((todo) => {
                let numbers = todo.contacts.map((c) => { return c.mobile })
                console.log(numbers)
                if (numbers.includes(String(mobile)))
                    return todo
            })
        }
    }

    return res.status(200).json(todos)
}

//post/put/delete/patch
export const CreateTodo = async (req: Request, res: Response, next: NextFunction) => {
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
        connected_user } = req.body as
        {
            serial_no: number,
            title: string,
            subtitle: string,
            category: string,
            contacts: {
                mobile: string,
                name: string,
                is_sent: boolean,
                status: string
            }[],
            run_once: boolean,
            frequency_type: string,
            frequency_value: string,
            start_date: Date,
            connected_user: string
        }

    if (!title || !subtitle || !contacts || !frequency_type || !start_date || !frequency_value)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(new Date(start_date))) {
        return res.status(400).json({ message: "provide valid start date" })
    }

    if (contacts.length == 0)
        return res.status(400).json({ "message": "must provide one contact" })
    if (run_once && new Date(start_date) <= new Date()) {
        return res.status(400).json({ message: "date is in the past" })
    }
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
    if (run_once)
        todo.next_run_date = new Date(cron.sendAt(new Date(start_date)))
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
        connected_user } = req.body as
        {
            serial_no: number,
            title: string,
            subtitle: string,
            category: string,
            contacts: {
                mobile: string,
                name: string,
                is_sent: boolean,
                status: string
            }[],
            run_once: boolean,
            frequency_type: string,
            frequency_value: string,
            start_date: Date,
            connected_user: string
        }

    if (!title || !subtitle || !contacts || !frequency_type || !start_date || !frequency_value)
        return res.status(400).json({ message: "fill all required fields" })

    if (!isvalidDate(new Date(start_date))) {
        return res.status(400).json({ message: "provide valid start date" })
    }

    if (contacts.length == 0)
        return res.status(400).json({ "message": "must provide one contact" })
    if (run_once && new Date(start_date) <= new Date()) {
        return res.status(400).json({ message: "date is in the past" })
    }
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
    todo.run_once = Boolean(run_once)
    todo.cron_string = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.start_date = new Date(start_date)
    todo.refresh_cron_string = GetRefreshCronString(frequency_type, frequency_value, new Date(start_date)) || ""
    todo.frequency_value = frequency_value
    todo.frequency_type = frequency_type
    todo.next_run_date = new Date(cron.sendAt(todo.cron_string))
    if (run_once)
        todo.next_run_date = new Date(cron.sendAt(new Date(start_date)))
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
    let todo = await Todo.findById(id).populate('connected_user')
    if (!todo)
        return res.status(400).json({ message: "not found" })
    if (todo.run_once && new Date(todo.start_date) <= new Date()) {
        return res.status(400).json({ message: "date is in the past" })
    }
    todo_timeouts.forEach((item) => {
        if (String(item.id) === String(todo?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    let client = clients.find((c) => c.client_id === todo?.connected_user.client_id)
    if (!client)
        return res.status(400).json({ message: "no whatsapp connected with the connected number" })

    todo.is_active = true
    todo.is_paused = false
    let contacts = todo.contacts
    contacts = contacts.map((contact) => {
        return {
            ...contact,
            is_sent: false,
            status: 'pending'
        }
    })
    await todo.save()
    await HandleTodoMessage(todo, client.client)
    return res.status(200).json({ message: "todo started" })
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
        todo.is_active = true
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
    return res.status(200).json({ message: "todo stopped" })
}

export const DeleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(400).json({ message: "please provide correct todo id" })
    }
    let todo = await Todo.findById(id)
    if (!todo)
        return res.status(400).json({ message: "not found todo" })
    todo_timeouts.forEach((item) => {
        if (String(item.id) === String(todo?._id)) {
            clearTimeout(item.timeout)
        }
    })
    if (TodoManager.exists(todo.running_key))
        TodoManager.deleteJob(todo.running_key)
    if (TodoManager.exists(todo.refresh_key))
        TodoManager.deleteJob(todo.refresh_key)
    await Todo.findByIdAndDelete(id)
    return res.status(200).json({ message: "todo deleted" })
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

export const UpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status, reply } = req.body as { status: string, reply: string }

    if (!reply || !status)
        return res.status(400).json({ message: " fill all required fields" })

    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let todo = await Todo.findById(id)
    if (!todo) {
        return res.status(404).json({ message: "todo not found" })
    }
    let contacts = todo.contacts
    contacts = contacts.map((contact) => {
        if (contact.mobile === req.user.mobile) {
            contact.status = status
            return contact
        }
        else
            return contact
    })
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

export const BulkCreateTodoFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: ITodoTemplate[] = []
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
        let workbook_response: ITodoTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response[0].start_date)
        console.log(new Date(workbook_response[0].start_date))
        let statusText = ""
        workbook_response.forEach(async (todo) => {
            let _id: string | null = String(todo._id)
            let serial_no: number | null = Number(todo.serial_no)
            let title: string | null = todo.title
            let subtitle: string | null = todo.subtitle
            let category: string | null = todo.category
            let contacts: string | null = todo.contacts
            let last_reply: string | null = todo.last_reply
            let frequency_type: string | null = todo.frequency_type
            let frequency_value: string | null = todo.frequency_value
            let start_date: string | null = todo.start_date
            let run_once: string | null = String(todo.run_once).toLowerCase()

            let validated = true
            if (serial_no && Number.isNaN(serial_no)) {
                validated = false
                statusText = "invalid serial number"
            }
            if (frequency_type && frequency_value) {
                if (frequency_type === "minutes" && Number(frequency_value) > 59 || Number(frequency_value) < 1) {
                    validated = false
                    statusText = "invalid frquency value"
                }
                if (frequency_type === "hours" && Number(frequency_value) > 23 || Number(frequency_value) < 1) {
                    validated = false
                    statusText = "invalid frquency value"
                }
                if (frequency_type === "days" && Number(frequency_value) > 31 || Number(frequency_value) < 1) {
                    validated = false
                    statusText = "invalid frquency value"
                }

                if (frequency_type === "months" && frequency_value && frequency_value.length > 0) {
                    frequency_value.split(",").map((v) => {
                        if (Number(v) < 1 || Number(v) > 31) {
                            validated = false
                            statusText = "invalid frquency value"
                        }
                    })

                }

                if (frequency_type === "weekdays" && frequency_value && frequency_value.length > 0) {
                    frequency_value.split(",").map((v) => {
                        if (Number(v) < 1 || Number(v) > 7) {
                            validated = false
                            statusText = "invalid frquency value"
                        }
                    })
                }

                if (frequency_type === "monthdays" && frequency_value && frequency_value.length > 0) {
                    frequency_value.split(",").map((v) => {
                        if (Number(v) < 1 || Number(v) > 31) {
                            validated = false
                            statusText = "invalid frquency value"
                        }
                    })
                }
                if (frequency_type === "yeardays" && frequency_value && frequency_value.length > 0) {
                    frequency_value.split(",").map((v) => {
                        if (Number(v) < 1 || Number(v) > 31) {
                            validated = false
                            statusText = "invalid frquency value"
                        }
                    })
                }
            }
            if (run_once === "true") {

            }
            else {

            }
        })

    }
    return res.status(200).json(result);
}

