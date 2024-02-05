import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { User } from "../models/users/user.model"
import { clearTimeout } from "timers"
import cron from "cron"
import { TodoManager } from "../app"
import { GetRunningCronString } from "../utils/GetRunningCronString"
import { ITodo, ITodoTemplate } from "../types/todo.types"
import { Todo } from "../models/todos/todo.model"
import { HandleTodoMessage, todo_timeouts } from "../utils/handleTodo"
import { clients } from "../utils/CreateWhatsappClient"
import xlsx from "xlsx"
import { IUser } from "../types/user.types"
import { isvalidDate } from "../utils/isValidDate"

//get
export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let todos = await Todo.find().populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("title")
    todos = todos.filter((todo) => {
        let numbers = todo.contacts.map((c) => { return c.mobile })

        if (numbers.includes(String(req.user?.mobile)))
            return todo
    })
    return res.status(200).json(todos)
}
export const GetTodos = async (req: Request, res: Response, next: NextFunction) => {
    let type = req.query.type
    let stopped = req.query.stopped
    let mobile = req.query.mobile
    let todos: ITodo[] = []
    let showStopped = false
    if (stopped === "true")
        showStopped = true
    if (!mobile) {
        if (showStopped && type) {
            todos = await Todo.find({ is_active: false, todo_type: type, created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else if (type) {
            todos = await Todo.find({ todo_type: type, created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else {
            todos = await Todo.find({ created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
    }
    if (mobile) {
        if (showStopped && type) {
            todos = await Todo.find({ is_active: false, todo_type: type, created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else if (type) {
            todos = await Todo.find({ todo_type: type, created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else {
            todos = await Todo.find({ created_by: req.user?._id }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        todos = todos.filter((todo) => {
            let numbers = todo.contacts.map((c) => { return c.mobile })

            if (numbers.includes(String(mobile)))
                return todo
        })
    }

    return res.status(200).json(todos)
}

export const StartTodos = async (req: Request, res: Response, next: NextFunction) => {
    let { ids } = req.body as { ids: string[] }
    ids.forEach(async (id) => {
        let todo = await Todo.findById(id).populate('connected_user')
        if (todo && !todo.is_active && todo.connected_user) {
            let dt1 = new Date(todo.start_date).getDate()
            let dt2 = new Date().getDate()
            let m1 = new Date(todo.start_date).getMonth() + 1
            let m2 = new Date().getMonth() + 1
            let y1 = new Date(todo.start_date).getFullYear()
            let y2 = new Date().getFullYear()
            let client = clients.find((c) => c.client_id === todo?.connected_user.client_id)
            if (new Date(todo.start_date) > new Date() && client) {
                todo_timeouts.forEach((item) => {
                    if (String(item.id) === String(todo?._id)) {
                        clearTimeout(item.timeout)
                    }
                })
                if (TodoManager.exists(todo.running_key))
                    TodoManager.deleteJob(todo.running_key)
                todo.next_run_date = new Date(cron.sendAt(todo.cron_string))
                if (todo.run_once)
                    todo.next_run_date = new Date(cron.sendAt(new Date(todo.start_date)))
                if (dt1 === dt2 && m1 === m2 && y1 === y2) {
                    todo.is_active = true
                    await todo.save()
                    await HandleTodoMessage(todo, client.client)
                }
                else {
                    todo.is_active = true
                    //@ts-ignore
                    todo.next_run_date = undefined
                    await todo.save()
                }

            }
        }
    })
    return res.status(200).json({ message: "all todo started" })
}

export const DeleteTodos = async (req: Request, res: Response, next: NextFunction) => {
    let { ids } = req.body as { ids: string[] }
    ids.forEach(async (id) => {
        let todo = await Todo.findById(id)
        if (todo) {
            todo_timeouts.forEach((item) => {
                if (String(item.id) === String(todo?._id)) {
                    clearTimeout(item.timeout)
                }
            })
            if (TodoManager.exists(todo.running_key))
                TodoManager.deleteJob(todo.running_key)
            await Todo.findByIdAndDelete(id)
        }
    })
    return res.status(200).json({ message: "all selected todos deleted" })
}

export const StopTodos = async (req: Request, res: Response, next: NextFunction) => {
    let { ids } = req.body as { ids: string[] }
    ids.forEach(async (id) => {
        let todo = await Todo.findById(id).populate('connected_user')
        if (todo) {
            todo_timeouts.forEach((item) => {
                if (String(item.id) === String(todo?._id)) {
                    clearTimeout(item.timeout)
                }
            })
            if (TodoManager.exists(todo.running_key))
                TodoManager.deleteJob(todo.running_key)
            todo.is_active = false
            await todo.save()
        }
    })
    return res.status(200).json({ message: "all todos stopped" })
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

        let statusText = ""
        let newContacts: {
            name: string,
            mobile: string,
            is_sent: boolean,
            status: string
        }[] = []
        let frequencies = ["minutes", "hours", "months", "days", "weekdays", "every-month-days", "selected-month-days"]
        for (let i = 0; i < workbook_response.length; i++) {
            let todo = workbook_response[i]
            let _id: string | null = String(todo._id)
            let serial_no: number | null = Number(todo.serial_no)
            let title: string | null = todo.title
            let subtitle: string | null = todo.subtitle
            let category: string | null = todo.category
            let category2: string | null = todo.category2
            let contacts: string | null = String(todo.contacts).toLowerCase()
            let frequency_type: string | null = String(todo.frequency_type).toLowerCase().trim()
            let frequency_value: string | null = todo.frequency_value
            let start_date: string | null = todo.start_date
            let run_once: string | null = String(todo.run_once).toLowerCase()
            let todo_type: string | null = todo.todo_type ? String(todo.todo_type).toLowerCase() : ""
            let connected_user: string | null = String(todo.connected_user).toLowerCase()

            let validated = true
            let newStartDate = new Date()
            if (isvalidDate(new Date(start_date)))
                newStartDate = new Date(start_date)

            if (serial_no && Number.isNaN(serial_no)) {
                validated = false
                statusText = "invalid serial number"
            }
            if (!frequencies.includes(todo.frequency_type)) {
                validated = false
                statusText = "invalid frequency type"
            }
            if (frequencies.includes(frequency_type) && frequency_type && frequency_value) {
                let ftype = frequency_type
                let value = frequency_value

                if (ftype === "minutes") {
                    if (Number.isNaN(Number(value)) || Number(value) > 59 || Number(value) < 1) {
                        validated = false
                        statusText = "invalid frequency"
                    }
                }
                if (ftype === "hours") {
                    if (Number.isNaN(Number(value)) || Number(value) > 23 || Number(value) < 1) {
                        validated = false
                        statusText = "invalid frequency"
                    }
                }
                if (ftype === "days") {
                    if (Number.isNaN(Number(value)) || Number(value) > 31 || Number(value) < 1) {
                        validated = false
                        statusText = "invalid frequency"
                    }
                }
                if (ftype === "months") {
                    if (Number.isNaN(Number(value)) || Number(value) > 12 || Number(value) < 1) {
                        validated = false
                        statusText = "invalid frequency"
                    }
                }

                if (ftype === "weekdays" && value && value.length > 0) {
                    value.split(",").map((v) => {
                        if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 7) {
                            validated = false
                            statusText = "invalid frequency"
                        }
                    })
                }

                if (ftype === "selected-month-days" && value && value.length > 0) {
                    value.split(",").map((v) => {
                        if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 31) {
                            validated = false
                            statusText = "invalid frequency"
                        }
                    })
                }
                if (ftype === "every-month-days" && value && value.length > 0) {
                    value.split(",").map((v) => {
                        if (Number.isNaN(Number(v)) || Number(v) < 1 || Number(v) > 31) {
                            validated = false
                            statusText = "invalid frequency"
                        }
                    })
                }
            }

            if (contacts) {
                newContacts = []
                for (let i = 0; i <= contacts.split(",").length; i++) {
                    let contact = contacts.split(",")[i]
                    let user = await User.findOne({ mobile: contact })
                    let user2 = await User.findOne({ username: contact })
                    if (user) {
                        newContacts.push({
                            name: user.username,
                            mobile: user.mobile,
                            is_sent: false,
                            status: 'pending'
                        })
                    }
                    if (!user) {
                        if (user2)
                            newContacts.push({
                                name: user2.username,
                                mobile: user2.mobile,
                                is_sent: false,
                                status: 'pending'
                            })
                    }
                    if (!user && !user2) {
                        if (String(contact).length === 10) {
                            newContacts.push({
                                name: "",
                                mobile: contact,
                                is_sent: false,
                                status: 'pending'
                            })
                        }
                    }
                }

            }

            if (!validated) {
                result.push({
                    ...todo,
                    status: statusText
                })
            }

            if (validated) {
                if (todo._id || isMongoId(String(todo._id))) {
                    let newtodo = await Todo.findById(_id)
                    let newConNuser: IUser | null = null
                    if (connected_user) {
                        let user = await User.findOne({ username: connected_user })
                        if (user && user.connected_number) {
                            newConNuser = user
                        }
                    }
                    if (newtodo) {
                        let new_run_once = false
                        if (run_once === "true")
                            new_run_once = true
                        else
                            new_run_once = false

                        let cronstring = GetRunningCronString(frequency_type, frequency_value, new Date(start_date)) || ""



                        await Todo.findByIdAndUpdate(newtodo._id, {
                            serial_no: Number(serial_no) || 0,
                            title: title || "",
                            subtitle: subtitle || "",
                            category: category || "",
                            category2: category2 || "",
                            connected_user: newConNuser?._id || null,
                            run_once: new_run_once,
                            start_date: newStartDate,
                            cron_string: cronstring,
                            frequency_type: frequency_type,
                            frequency_value: frequency_value,
                            todo_type: todo_type,
                            is_active: false,
                            is_paused: false,
                            running_key: String(newtodo._id) + "todo",
                            refresh_key: String(newtodo._id) + "refresh",
                            contacts: newContacts,
                            updated_by: req.user,
                            updated_at: new Date()
                        })
                        if (TodoManager.exists(newtodo.running_key))
                            TodoManager.deleteJob(newtodo.running_key)

                    }
                }
                if (!todo._id || !isMongoId(String(todo._id))) {
                    let tmptodo = await Todo.findOne({ title: title })
                    let newConNuser: IUser | null = null
                    if (connected_user) {
                        let user = await User.findOne({ username: connected_user })
                        if (user && user.connected_number) {
                            newConNuser = user
                        }
                    }
                    if (!tmptodo) {
                        let new_run_once = false
                        if (run_once === "true")
                            new_run_once = true
                        else
                            new_run_once = false
                        let cronstring = GetRunningCronString(frequency_type, frequency_value, new Date(start_date))



                        let newtodo = new Todo({
                            serial_no: Number(serial_no) || 0,
                            title: title || "",
                            subtitle: subtitle || "",
                            category: category || "",
                            category2: category2 || "",
                            frequency_type: frequency_type,
                            frequency_value: frequency_value,
                            run_once: new_run_once,
                            start_date: newStartDate,
                            cron_string: cronstring,
                            connected_user: newConNuser?._id || undefined,
                            replies: [],
                            todo_type: todo_type,
                            is_active: false,
                            is_paused: false,
                            contacts: newContacts,
                            created_by: req.user,
                            updated_by: req.user,
                            created_at: new Date(),
                            updated_at: new Date()
                        })
                        newtodo.running_key = String(newtodo._id) + "todo"
                        await newtodo.save()
                        if (TodoManager.exists(newtodo.running_key))
                            TodoManager.deleteJob(newtodo.running_key)
                    }
                }
            }
        }
    }
    return res.status(200).json(result);
}

