import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateTask, DeleteTask, GetTasks } from "../controllers/task.controller";

const router = express.Router()

router.route("/tasks").get(GetTasks)
router.route("/tasks").post(isAuthenticatedUser, CreateTask)
router.route("/tasks/:id").delete(isAuthenticatedUser, DeleteTask)


export default router