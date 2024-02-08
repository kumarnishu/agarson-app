import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { User } from "../models/users/user.model"
import { ITodo, ITodoTemplate } from "../types/todo.types"
import { Todo } from "../models/todos/todo.model"
import xlsx from "xlsx"
import { IUser } from "../types/user.types"

//get
export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let todos = await Todo.find({ is_hidden: false }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("title")
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
        await Todo.findByIdAndUpdate(id, {
            is_active: true
        })
    })
    return res.status(200).json({ message: "all todo started" })
}

export const DeleteTodos = async (req: Request, res: Response, next: NextFunction) => {
    let { ids } = req.body as { ids: string[] }
    ids.forEach(async (id) => {
        await Todo.findByIdAndDelete(id)
    })
    return res.status(200).json({ message: "all selected todos deleted" })
}

export const StopTodos = async (req: Request, res: Response, next: NextFunction) => {
    let { ids } = req.body as { ids: string[] }
    ids.forEach(async (id) => {
        await Todo.findByIdAndUpdate(id, {
            is_active: false
        })
    })
    return res.status(200).json({ message: "all todos stopped" })
}

export const AddTodoReply = async (req: Request, res: Response, next: NextFunction) => {
    let { reply } = req.body as { reply: string }
    const id = req.params.id
    let todo = await Todo.findById(id).populate('connected_user')
    if (!todo)
        return res.status(404).json({ message: "no todo exists" })
    let replies = todo.replies
    if (req.user && reply)
        replies.push({ reply: reply, created_by: req.user, timestamp: new Date() })
    todo.is_hidden = true
    todo.replies = replies
    await todo.save()
    return res.status(200).json({ message: "reply added" })
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

        for (let i = 0; i < workbook_response.length; i++) {
            let todo = workbook_response[i]
            console.log(todo)
            let _id: string | null = String(todo._id)
            let serial_no: number | null = Number(todo.serial_no)
            let title: string | null = todo.title
            let subtitle: string | null = todo.subtitle
            let category: string | null = todo.category
            let category2: string | null = todo.category2
            let contacts: string | null = String(todo.contacts).toLowerCase()
            let reply: string | null = todo.reply
            let start_time: string | null = todo.start_time
            let dates: string | null = todo.dates
            let weekdays: string | null = todo.weekdays
            let months: string | null = todo.months
            let years: string | null = todo.years
            let todo_type: string | null = todo.todo_type ? String(todo.todo_type).toLowerCase() : ""
            let connected_user: string | null = String(todo.connected_user).toLowerCase()

            let validated = true
            if (!start_time || !dates || !weekdays || !months || !years) {
                validated = false
                statusText = "fill all required fields"
            }

            if (serial_no && Number.isNaN(serial_no)) {
                validated = false
                statusText = "invalid serial number"
            }
            if (start_time) {
                let hours = start_time.split(",")[0].trim()
                let minutes = start_time.split(",")[1].trim()
                if (Number.isNaN(Number(hours)) || Number(hours) > 23 || Number(hours) < 1) {
                    validated = false
                    statusText = "invalid start time"
                }
                if (Number.isNaN(Number(minutes)) || Number(minutes) > 59 || Number(minutes) < 1) {
                    validated = false
                    statusText = "invalid start time"
                }
            }
            if (dates) {
                let dts = dates.split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (dts[i] > 31 || dts[i] < 1) {
                        validated = false
                        statusText = "invalid dates"
                        break;
                    }
                }
            }

            if (weekdays) {
                let dts = weekdays.split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (dts[i] > 7 || dts[i] < 1) {
                        validated = false
                        statusText = "invalid weekdays"
                        break;
                    }
                }
            }
            if (months) {
                let dts = months.split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (dts[i] > 12 || dts[i] < 1) {
                        validated = false
                        statusText = "invalid months"
                        break;
                    }
                }
            }
            if (years) {
                let dts = years.split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (dts[i] < 1970) {
                        validated = false
                        statusText = "invalid years"
                        break;
                    }
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
                let st_time = start_time
                let dts = dates.split(",").map((v) => { return Number(v) })
                let wdays = weekdays.split(",").map((v) => { return Number(v) })
                let mths = months.split(",").map((v) => { return Number(v) })
                let yrs = years.split(",").map((v) => { return Number(v) })
                let newConNuser: IUser | null = null

                if (connected_user) {
                    let user = await User.findOne({ username: connected_user })
                    if (user && user.connected_number) {
                        newConNuser = user
                    }
                }

                if (todo._id || isMongoId(String(todo._id))) {
                    let newtodo = await Todo.findById(_id)
                    if (newtodo) {
                        let replies = newtodo.replies
                        if (req.user) {
                            replies.push({ reply: reply || "", created_by: req.user, timestamp: new Date() })
                        }
                        await Todo.findByIdAndUpdate(newtodo._id, {
                            serial_no: Number(serial_no) || 0,
                            title: title || "",
                            subtitle: subtitle || "",
                            category: category || "",
                            category2: category2 || "",
                            connected_user: newConNuser?._id || null,
                            todo_type: todo_type,
                            replies: replies,
                            start_time: st_time,
                            dates: dts,
                            months: mths,
                            weekdays: wdays,
                            years: yrs,
                            contacts: newContacts,
                            updated_by: req.user,
                            updated_at: new Date()
                        })
                    }
                }
                if (!todo._id || !isMongoId(String(todo._id))) {
                    await new Todo({
                        serial_no: Number(serial_no) || 0,
                        title: title || "",
                        subtitle: subtitle || "",
                        category: category || "",
                        category2: category2 || "",
                        connected_user: newConNuser?._id || undefined,
                        replies: [],
                        todo_type: todo_type,
                        contacts: newContacts,
                        start_time: st_time,
                        dates: dts,
                        months: mths,
                        weekdays: wdays,
                        years: yrs,
                        created_by: req.user,
                        updated_by: req.user,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).save()

                }
            }
        }
    }
    return res.status(200).json(result);
}

