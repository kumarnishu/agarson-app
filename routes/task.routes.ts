import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { AddMoreBoxes, CreateTask, DeleteTask, EditTask, GetMyTasks, GetTasks, ToogleMyTask } from "../controllers/task.controller";

const router = express.Router()

router.route("/tasks").get(isAuthenticatedUser, GetTasks)
router.route("/tasks/self").get(isAuthenticatedUser, GetMyTasks)
router.route("/tasks/self/:id").patch(isAuthenticatedUser, ToogleMyTask)
router.route("/tasks/:id").post(isAuthenticatedUser, CreateTask)
router.route("/tasks/:id").put(isAuthenticatedUser, EditTask)
router.route("/tasks/:id").patch(isAuthenticatedUser, AddMoreBoxes)
router.route("/tasks/:id").delete(isAuthenticatedUser, DeleteTask)


export default router