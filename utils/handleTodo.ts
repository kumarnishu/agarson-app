import { TodoManager } from "../app"
import { Todo } from "../models/todos/todo.model"
import { ITodo } from "../types/todo.types"
import cron, { CronJob } from "cron"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function HandleTodoMessage(todo: ITodo, client: any) {
    if (todo && client) {
        if (!todo.run_once) {
            TodoManager.add(todo.running_key
                , todo.cron_string, async () => {
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
                                client.sendMessage("91" + mobile + "@s.whatsapp.net", { text: title + "\n" + subtitle })
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
                    await Todo.findByIdAndUpdate(todo._id, {
                        next_run_date: new Date(cron.sendAt(todo.cron_string)),
                    })

                })
            TodoManager.start(todo.running_key)
        }
        // run once job
        if (todo?.run_once && new Date(todo.start_date) <= new Date()) {
            await Todo.findByIdAndUpdate(todo._id, {
                is_active: false
            })
        }
        if (todo?.run_once && new Date(todo.start_date) > new Date()) {
            new CronJob(new Date(todo.start_date), async () => {
                let latest_todo = await Todo.findById(todo._id)
                if (latest_todo && latest_todo.is_active) {
                    let timeinsec = 5000
                    let reports = latest_todo.contacts
                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        const timeout = setTimeout(async () => {
                            let mobile = report.mobile
                            let contacts = todo.contacts
                            let title = todo.title && todo.title.replaceAll("\\n", "\n")
                            let subtitle = todo.subtitle && todo.subtitle.replaceAll("\\n", "\n")
                            console.log("sending run once todo")
                            client.sendMessage("91" + mobile + "@s.whatsapp.net", { text: title + "\n" + subtitle })
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
                        const timeout2 = setTimeout(async () => {
                            await Todo.findByIdAndUpdate(todo._id, {
                                is_active: false
                            })
                        }, Number(timeinsec));
                        todo_timeouts.push({ id: todo._id, timeout: timeout2 })
                        timeinsec = timeinsec + 1000 + Math.ceil(Math.random() * 3) * 1000
                    }
                }
            }).start()
        }
    }
}
