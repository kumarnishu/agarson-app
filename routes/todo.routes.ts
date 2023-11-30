import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";

import { upload } from "./user.routes";
import { CreateTodo, DeleteTodo, EditTodo, GetMyTodos, GetTodos, HideTodo } from "../controllers/todo.controller";

const router = express.Router()

router.route("/todos").get(isAuthenticatedUser,GetTodos)
router.route("/todos/me").get(isAuthenticatedUser,GetMyTodos)
router.route("/todos/:id").post(isAuthenticatedUser, CreateTodo)
router.route("/todos/:id").put(isAuthenticatedUser, EditTodo)
router.route("/todos/:id").delete(isAuthenticatedUser, DeleteTodo)
router.route("/todos/:id").patch(isAuthenticatedUser, HideTodo)


export default router