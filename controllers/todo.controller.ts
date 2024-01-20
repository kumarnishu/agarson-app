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
    let create_operation = true
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

        // workbook_response.forEach(async (lead) => {
        //     let mobile: number | null = Number(lead.mobile)
        //     let alternate_mobile1: number | null = Number(lead.alternate_mobile1)
        //     let alternate_mobile2: number | null = Number(lead.alternate_mobile2)

        //     let validated = true

        //     //important
        //     if (mobile && Number.isNaN(mobile)) {
        //         validated = false
        //         statusText = "invalid mobile"
        //     }
        //     if (alternate_mobile1 && Number.isNaN(alternate_mobile1)) {
        //         validated = false
        //         statusText = "invalid alternate mobile 1"
        //     }
        //     if (alternate_mobile2 && Number.isNaN(alternate_mobile2)) {
        //         validated = false
        //         statusText = "invalid alternate mobile 2"
        //     }
        //     if (alternate_mobile1 && String(alternate_mobile1).length !== 10)
        //         alternate_mobile1 = null
        //     if (alternate_mobile2 && String(alternate_mobile2).length !== 10)
        //         alternate_mobile2 = null

        //     if (lead.is_customer && typeof (lead.is_customer) !== "boolean") {
        //         validated = false
        //         statusText = "invalid is icustomer"
        //     }
        //     if (mobile && String(mobile).length !== 10) {
        //         validated = false
        //         statusText = "invalid mobile"
        //     }

        //     if (lead.created_at && !isvalidDate(new Date(lead.created_at))) {
        //         validated = false
        //         statusText = "invalid date"
        //     }
        //     if (lead.updated_at && !isvalidDate(new Date(lead.updated_at))) {
        //         validated = false
        //         statusText = "invalid date"
        //     }

        //     // duplicate number checker
        //     let uniqueNumbers: number[] = []
        //     if (mobile && !OldNumbers.includes(mobile)) {
        //         uniqueNumbers.push(mobile)
        //         OldNumbers.push(mobile)

        //     }
        //     else
        //         statusText = "duplicate"
        //     if (alternate_mobile1 && !OldNumbers.includes(alternate_mobile1)) {
        //         uniqueNumbers.push(alternate_mobile1)
        //         OldNumbers.push(alternate_mobile1)
        //     }
        //     if (alternate_mobile2 && !OldNumbers.includes(alternate_mobile2)) {
        //         uniqueNumbers.push(alternate_mobile2)
        //         OldNumbers.push(alternate_mobile2)
        //     }
        //     if (uniqueNumbers.length === 0)
        //         validated = false

        //     if (!isMongoId(String(lead._id)) && !validated) {
        //         result.push({
        //             ...lead,
        //             status: statusText
        //         })
        //     }

        //     if (lead.lead_owners) {
        //         let names = String((lead.lead_owners)).split(",")
        //         for (let i = 0; i < names.length; i++) {
        //             let owner = await User.findOne({ username: names[i] })
        //             if (owner)
        //                 new_lead_owners.push(owner)
        //         }

        //     }
        //     //update and create new nead
        //     console.log(validated)
        //     if (lead._id && isMongoId(String(lead._id))) {
        //         console.log(new_lead_owners)
        //         create_operation = false
        //         let targetLead = await Lead.findById(lead._id)
        //         if (targetLead) {
        //             if (lead.remarks) {
        //                 if (!lead.remarks.length) {
        //                     let new_remark = new Remark({
        //                         remark: lead.remarks,
        //                         lead: lead,
        //                         created_at: new Date(),
        //                         created_by: req.user,
        //                         updated_at: new Date(),
        //                         updated_by: req.user
        //                     })
        //                     await new_remark.save()
        //                     targetLead.last_remark = lead.remarks
        //                     targetLead.remarks = [new_remark]
        //                 }
        //                 else {
        //                     let last_remark = targetLead.remarks[targetLead.remarks.length - 1]
        //                     await Remark.findByIdAndUpdate(last_remark._id, {
        //                         remark: lead.remarks,
        //                         lead: lead,
        //                         updated_at: new Date(),
        //                         updated_by: req.user
        //                     })
        //                     targetLead.last_remark = last_remark.remark
        //                 }

        //             }

        //             await Lead.findByIdAndUpdate(lead._id, {
        //                 ...lead,
        //                 remarks: targetLead.remarks,
        //                 mobile: uniqueNumbers[0] || mobile,
        //                 alternate_mobile1: uniqueNumbers[1] || alternate_mobile1 || null,
        //                 alternate_mobile2: uniqueNumbers[2] || alternate_mobile2 || null,
        //                 lead_owners: new_lead_owners,
        //                 updated_by: req.user,
        //                 updated_at: new Date(Date.now())
        //             })
        //         }

        //     }

        //     if (validated) {
        //         if (!lead._id || !isMongoId(String(lead._id))) {
        //             let newlead = new Lead({
        //                 ...lead,
        //                 _id: new Types.ObjectId(),
        //                 mobile: uniqueNumbers[0] || null,
        //                 alternate_mobile1: uniqueNumbers[1] || null,
        //                 alternate_mobile2: uniqueNumbers[2] || null,
        //                 lead_owners: new_lead_owners,
        //                 created_by: req.user,
        //                 updated_by: req.user,
        //                 updated_at: new Date(Date.now()),
        //                 created_at: new Date(Date.now()),
        //                 remarks: undefined
        //             })
        //             if (lead.remarks) {
        //                 let new_remark = new Remark({
        //                     remark: lead.remarks,
        //                     lead: newlead,
        //                     created_at: new Date(),
        //                     created_by: req.user,
        //                     updated_at: new Date(),
        //                     updated_by: req.user
        //                 })
        //                 await new_remark.save()
        //                 newlead.last_remark = lead.remarks
        //                 newlead.remarks = [new_remark]
        //             }
        //             await newlead.save()

        //         }
        //     }
        // })

    }
    // if (!create_operation && String(req.user?._id) !== String(req.user?.created_by._id))
    //     return res.status(403).json({ message: "not allowed this operation" })
    return res.status(200).json(result);
}

