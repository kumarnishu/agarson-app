import { Client } from "whatsapp-web.js"
import { Todo } from "../models/todos/todo.model"
import { ITodo } from "../types/todo.types"
import { CronJob } from "cron"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function HandleTodoMessage(todo: ITodo, client: Client) {
    if (todo && client) {
        let date = new Date()
        date.setHours(Number(todo.start_time.split(":")[0]))
        date.setMinutes(Number(todo.start_time.split(":")[1]))
        new CronJob(todo.start_time, async () => {
            console.log("running reminders")
            let latest_todo = await Todo.findById(todo._id)
            if (latest_todo && latest_todo.is_active) {
                let timeinsec = 5000
                let reports = latest_todo.contacts
                for (let i = 0; i < reports.length; i++) {
                    let report = reports[i]
                    const timeout = setTimeout(async () => {
                        let mobile = report.mobile
                        let title = todo.title && todo.title.replaceAll("\\n", "\n")
                        let subtitle = todo.subtitle && todo.subtitle.replaceAll("\\n", "\n")
                        console.log("sending message to", mobile)
                        let contacts = todo.contacts
                        await client.sendMessage("91" + mobile + "@c.us", title + "\n" + subtitle)
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
