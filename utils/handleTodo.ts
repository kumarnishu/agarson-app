import { TodoManager } from "../app"
import { ITodo } from "../types/todo.types"
import { IUser } from "../types/user.types"

export var todo_timeouts: { id: string, timeout: NodeJS.Timeout }[] = []

export async function HandleTodoMessages(todo: ITodo, client: any, user: IUser) {
    if (todo && client) {
        TodoManager.add(todo.running_key
            , todo.cron_string, async () => {

            })
        TodoManager.add(todo.refresh_key, todo.refresh_cron_string, async () => {

        })
        if (!todo.run_once) {
            TodoManager.start(todo.refresh_key)
            TodoManager.start(todo.running_key)
        }
        // run once job
        if (todo?.run_once) {
            if (TodoManager.exists(todo?.running_key))
                TodoManager.deleteJob(todo?.running_key)
            if (TodoManager.exists(todo?.refresh_key))
                TodoManager.deleteJob(todo?.refresh_key)

        }

    }
}
