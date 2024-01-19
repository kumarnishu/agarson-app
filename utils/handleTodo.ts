import { TodoManager } from "../app"
import { Todo } from "../models/todos/todo.model"
import { ITodo } from "../types/todo.types"
import cron from "cron"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function HandleTodoMessage(todo: ITodo, client: any) {
    if (todo && client) {
        TodoManager.add(todo.running_key
            , todo.cron_string, async () => {
                console.log("running reminders")
                let latest_todo = await Todo.findById(todo._id)
                if (latest_todo && latest_todo.is_active) {
                    let timeinsec = 5000
                    let reports = latest_todo.contacts
                    for (let i = 0; i < reports.length; i++) {
                        let report = reports[i]
                        if (report?.status !== "done") {
                            const timeout = setTimeout(async () => {
                                let mobile = report.mobile
                                console.log("sending message to", mobile)
                                let contacts = todo.contacts
                                client.sendMessage("91" + mobile + "@s.whatsapp.net", { text: todo.title + "\n" + todo.subtitle })
                                contacts = contacts.map((contact) => {
                                    if (contact.mobile === mobile) {
                                        contact.is_sent = true
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
                }
                await Todo.findByIdAndUpdate(todo._id, {
                    next_run_date: new Date(cron.sendAt(todo.cron_string)),
                    is_paused: true
                })

            })

        TodoManager.add(todo.refresh_key, todo.refresh_cron_string, async () => {
            console.log("refreshing reminders")
            await Todo.findByIdAndUpdate(todo._id, { is_active: true, is_paused: false })
            let latest_todo = await Todo.findById(todo._id)
            if (latest_todo) {
                let contacts = latest_todo.contacts
                contacts = contacts.map((contact) => {
                    return {
                        ...contact,
                        is_sent: false,
                        status: 'pending'
                    }
                })
                latest_todo.contacts = contacts
                await latest_todo?.save()

            }
            await Todo.findByIdAndUpdate(todo._id, {
                next_run_date: todo.next_run_date = new Date(cron.sendAt(todo.cron_string))
            })
        })
        if (!todo.run_once) {
            TodoManager.start(todo.refresh_key)
            TodoManager.start(todo.running_key)
        }
        // run once job
        if (todo?.run_once && new Date(todo.start_date)) {
            let latest_todo = await Todo.findById(todo._id)
            if (latest_todo && latest_todo.is_active) {
                let timeinsec = 5000
                let reports = latest_todo.contacts
                for (let i = 0; i < reports.length; i++) {
                    let report = reports[i]
                    if (report?.status !== "done") {
                        const timeout = setTimeout(async () => {
                            let mobile = report.mobile
                            let contacts = todo.contacts
                            client.sendMessage("91" + mobile + "@s.whatsapp.net", { text: todo.title + "\n" + todo.subtitle })
                            contacts = contacts.map((contact) => {
                                if (contact.mobile === mobile) {
                                    contact.is_sent = true
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
            }
            await Todo.findByIdAndUpdate(todo._id, {
                next_run_date: new Date(cron.sendAt(new Date(todo.start_date))),
                is_active: false
            })
        }
    }
}
