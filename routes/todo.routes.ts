import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";

import { BulkHideTodos, CreateTodo, DeleteTodo, EditTodo, GetMyTodos, GetTodos, HideTodo, UpdateStatus } from "../controllers/todo.controller";

const router = express.Router()

router.route("/todos").get(isAuthenticatedUser, GetTodos)
router.route("/todos/bulk/hide").patch(isAuthenticatedUser, BulkHideTodos)
router.route("/todos/me").get(isAuthenticatedUser, GetMyTodos)
router.route("/todos/:id").post(isAuthenticatedUser, CreateTodo)
router.route("/todos/:id").put(isAuthenticatedUser, EditTodo)
router.route("/todos/:id").delete(isAuthenticatedUser, DeleteTodo)
router.route("/todos/:id").patch(isAuthenticatedUser, HideTodo)
router.route("/todos/status/:id").patch(isAuthenticatedUser, UpdateStatus)


export default router