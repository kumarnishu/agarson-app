import { Client } from "whatsapp-web.js"
import { Todo } from "../models/todos/todo.model"
import { ITodo } from "../types/todo.types"
import { CronJob } from "cron"
import { IUser } from "../types/user.types"
import { clients } from "./CreateWhatsappClient"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []


export async function HandleDailyTodoTrigger(user: IUser) {
    let cronstring = "0" + " 0" + " *" + " *" + " 1,2,3,4,5,6,7"
    console.log(cronstring)
    new CronJob(cronstring, async () => {
        let reminderClient = clients.find((client) => client.client_id === user.client_id)
        if (reminderClient) {
            let dt1 = new Date().getDate()
            let wd1 = new Date().getDay()
            let m1 = new Date().getMonth() + 1
            let y1 = new Date().getFullYear()
            console.log("handling todos")
            let todos = await Todo.find({ connected_user: user._id })
            todos.forEach(async (todo) => {
                let ok = true
                if (todo.weekdays.length > 0) {
                    if (!todo.weekdays.includes(wd1))
                        ok = false
                }
                else {
                    if (!todo.dates.includes(dt1))
                        ok = false
                }
                if (!todo.months.includes(m1))
                    ok = false
                if (!todo.years.includes(y1))
                    ok = false
                if (ok && reminderClient?.client) {
                    await SendTodoMessage(todo, reminderClient?.client)
                }
            })
        }

    }).start()
}

export async function SendTodoMessage(todo: ITodo, client: Client) {
    if (todo && client) {
        let date = new Date()
        date.setHours(Number(todo.start_time.split(":")[0]))
        date.setMinutes(Number(todo.start_time.split(":")[1]))
        new CronJob(date, async () => {
            console.log("running todos")
            let latest_todo = await Todo.findById(todo._id)
            if (latest_todo && latest_todo.is_active) {
                let timeinsec = 5000
                let reports = latest_todo.contacts
                for (let i = 0; i < reports.length; i++) {
                    let report = reports[i]
                    const timeout = setTimeout(async () => {
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
                        if (latest_todo) {
                            latest_todo.contacts = contacts
                            latest_todo.is_hidden = false
                            await latest_todo?.save()
                        }
                    }, Number(timeinsec));
                    todo_timeouts.push({ id: todo._id, timeout: timeout })
                    timeinsec = timeinsec + 1000 + Math.ceil(Math.random() * 3) * 1000

                }
            }
        }).start()
    }
}
