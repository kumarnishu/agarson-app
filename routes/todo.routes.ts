import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  } from "../controllers/greeting.controller";
import { CreateTodo, DeleteTodo, GetTodos, StartAllTodos, StartTodo, StopAllTodos, StopTodo, UpdateTodo } from "../controllers/todo.controller";

const router = express.Router()
router.route("/todos").post(isAuthenticatedUser, CreateTodo)
router.route("/todos/:id").put(isAuthenticatedUser, UpdateTodo)
router.route("/todos").get(isAuthenticatedUser, GetTodos)
router.route("/todos/:id").delete(isAuthenticatedUser, DeleteTodo)
router.route("/todos/start/:id").delete(isAuthenticatedUser, StartTodo)
router.route("/todos/stop/:id").delete(isAuthenticatedUser, StopTodo)
router.route("/todos/bulk/stop").patch(isAuthenticatedUser, StopAllTodos)
router.route("/todos/bulk/start").patch(isAuthenticatedUser, StartAllTodos)

export default router