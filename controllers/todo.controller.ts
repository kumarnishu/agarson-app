import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import { IUser, User } from "../models/users/user.model"
import { ITodo, ITodoTemplate, Todo } from "../models/todos/todo.model"
import xlsx from "xlsx"

//get
export const GetMyTodos = async (req: Request, res: Response, next: NextFunction) => {
    let hidden = String(req.query.hidden)
    let todos: ITodo[] = []
    todos = await Todo.find({ is_hidden: false }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
    if (hidden === "true") {
        todos = await Todo.find({ is_hidden: true }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("serial_no")
    }

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
            todos = await Todo.find({ is_active: false, todo_type: type, created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else if (type) {
            todos = await Todo.find({ todo_type: type, created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else {
            todos = await Todo.find({ created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
    }
    if (mobile) {
        if (showStopped && type) {
            todos = await Todo.find({ is_active: false, todo_type: type, created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else if (type) {
            todos = await Todo.find({ todo_type: type, created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
        }
        else {
            todos = await Todo.find({ created_by: req.user?._id }).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user').populate('created_by').populate('updated_at').populate('updated_by').sort("start_date")
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
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i]
        let todo = await Todo.findById(id)
        let validated = true
        if (todo && !todo.is_active && todo.connected_user) {
            if (todo.start_time) {
                let hours = todo.start_time.replace("[", "").replace("]", "").split(":")[0].trim()
                let minutes = todo.start_time.replace("[", "").replace("]", "").split(":")[1].trim()
                if (Number.isNaN(Number(hours)) || Number(hours) > 23 || Number(hours) < 0) {
                    validated = false
                }
                if (Number.isNaN(Number(minutes)) || Number(minutes) > 59 || Number(minutes) < 0) {
                    validated = false
                }
            }
            if (todo.dates) {
                let dts = todo.dates.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (Number.isNaN(dts[i]) || dts[i] > 31 || dts[i] < 1) {
                        validated = false
                        break;
                    }
                }
            }

            if (todo.weekdays) {
                let dts = todo.weekdays.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (Number.isNaN(dts[i]) || dts[i] > 7 || dts[i] < 1) {
                        validated = false
                        break;
                    }
                }
            }
            if (todo.months) {
                let dts = todo.months.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (Number.isNaN(dts[i]) || dts[i] > 12 || dts[i] < 1) {
                        validated = false
                        break;
                    }
                }
            }
            if (todo.years) {
                let dts = todo.years.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                console.log(dts)
                for (let i = 0; i <= dts.length; i++) {
                    if (Number.isNaN(dts[i]) || dts[i] < 1970) {
                        validated = false
                        break;
                    }
                }
            }
            console.log(validated)
            if (validated)
                await Todo.findByIdAndUpdate(id, {
                    is_active: true
                })
        }

    }
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
    let todo = await Todo.findById(id).populate({
                    path: 'replies',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        }
                    ]
                }).populate('connected_user')
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
            let _id: string | null = String(todo._id)
            let serial_no: number | null = Number(todo.serial_no)
            let title: string | null = todo.title
            let sheet_url: string | null = todo.sheet_url
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
            if (!start_time || !months || !years) {
                validated = false
                statusText = "fill all required fields"
            }
            if (!dates && !weekdays) {
                validated = false
                statusText = "required dates or weekdays"
            }

            if (serial_no && Number.isNaN(serial_no)) {
                validated = false
                statusText = "invalid serial number"
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
                let newConNuser: IUser | null = null

                if (connected_user && req.user) {
                    let user = await User.findOne({ username: connected_user, _id: req.user._id })
                    if (user && user.connected_number) {
                        newConNuser = user
                    }
                }

                if (todo._id || isMongoId(String(todo._id))) {
                    let newtodo = await Todo.findById(_id)
                    if (newtodo) {
                        let replies = newtodo.replies
                        let remark = newtodo?.replies && newtodo.replies.length > 0 && newtodo.replies[newtodo.replies.length - 1].reply || ""
                        if (req.user && remark !== todo.reply) {
                            replies.push({ reply: reply || "", created_by: req.user, timestamp: new Date() })
                        }
                        await Todo.findByIdAndUpdate(newtodo._id, {
                            serial_no: Number(serial_no) || 0,
                            title: title || "",
                            sheet_url: sheet_url || "",
                            category: category || "",
                            category2: category2 || "",
                            connected_user: newConNuser?._id || null,
                            todo_type: todo_type,
                            replies: replies,
                            start_time: start_time,
                            dates: dates,
                            months: months,
                            weekdays: weekdays,
                            is_active: false,
                            years: years,
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
                        sheet_url: sheet_url || "",
                        category: category || "",
                        category2: category2 || "",
                        connected_user: newConNuser?._id || undefined,
                        replies: [],
                        todo_type: todo_type,
                        contacts: newContacts,
                        start_time: start_time,
                        dates: dates,
                        is_active: false,
                        is_hidden: false,
                        months: months,
                        weekdays: weekdays,
                        years: years,
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

