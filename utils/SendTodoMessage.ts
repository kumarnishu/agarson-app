import { Client } from "whatsapp-web.js"
import { ITodo, Todo } from "../models/todos/todo.model"
import { CronJob } from "cron"
import { clients } from "./CreateWhatsappClient"
import { IUser } from "../models/users/user.model"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []


export async function HandleDailyTodoTrigger(user: IUser) {
    let reminderClient = clients.find((client) => client.client_id === user.client_id)
    if (reminderClient) {
        let dt1 = new Date().getDate()
        let wd1 = new Date().getDay()
        if (wd1 === 0)
            wd1 = 7
        let m1 = new Date().getMonth() + 1
        let y1 = new Date().getFullYear()

        let todos = await Todo.find({ connected_user: user._id })

        todos.forEach((todo) => {
            let months = todo.months.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
            let years = todo.years.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
            if (todo.is_active) {
                let ok = true
                if (todo.weekdays && todo.weekdays.length > 0) {
                    let weekdays = todo.weekdays.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                    if (!weekdays.includes(wd1))
                        ok = false
                }
                else {
                    let dates = todo.dates.replace("[", "").replace("]", "").split(",").map((v) => { return Number(v.trim()) })
                    if (!dates.includes(dt1))
                        ok = false
                }
                if (!months.includes(m1))
                    ok = false
                if (!years.includes(y1))
                    ok = false
                if (ok && reminderClient) {
                    console.log(ok, todo.title)
                    let date = new Date()
                    date.setHours(Number(todo.start_time.replace("[", "").replace("]", "").split(":")[0]))
                    date.setMinutes(Number(todo.start_time.replace("[", "").replace("]", "").split(":")[1]))

                    if (date > new Date())
                        new CronJob(date, () => {
                            if (reminderClient?.client)
                                SendTodoMessage(todo, reminderClient?.client)
                        }).start()
                }

            }
        })
    }
}

export async function SendTodoMessage(todo: ITodo, client: Client) {
    if (todo && client) {
        let timeinsec = 2000
        let reports = todo.contacts
        for (let i = 0; i < reports.length; i++) {
            let report = reports[i]
            const timeout = setTimeout(async () => {
                let latest_todo = await Todo.findById(todo._id)

                if (latest_todo && latest_todo.is_active) {
                    let mobile = report.mobile
                    let title = todo.title && todo.title.replaceAll("\\n", "\n")
                    let contacts = todo.contacts
                    await client.sendMessage("91" + mobile + "@c.us", title)
                    contacts = contacts.map((contact) => {
                        if (contact.mobile === mobile) {
                            contact.is_sent = true
                            contact.timestamp = new Date()
                            return contact
                        }
                        else
                            return contact
                    })
                    await Todo.findByIdAndUpdate(latest_todo._id, {
                        contacts: contacts,
                        is_hidden: false
                    })
                }
            }, Number(timeinsec));
            todo_timeouts.push({ id: todo._id, timeout: timeout })
            timeinsec = timeinsec + 2000 + Math.ceil(Math.random() * 3) * 1000
        }
    }
}
