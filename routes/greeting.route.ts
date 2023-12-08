import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { ActivateGreeting, BulkGreetingsUpdateFromExcel, CreateGreeting, DeleteGreeting, FetchGreetings, StartAllGreetings, StopAllGreetings, StopGreeting, UpdateGreeting } from "../controllers/greeting.controller";
import { upload } from "./user.routes";

const router = express.Router()
router.route("/greetings").post(isAuthenticatedUser, CreateGreeting)
router.route("/greetings/:id").put(isAuthenticatedUser, UpdateGreeting)

router.route("/greetings").get(isAuthenticatedUser, FetchGreetings)
router.route("/greetings/start/:id").patch(isAuthenticatedUser, ActivateGreeting)
router.route("/greetings/:id").delete(isAuthenticatedUser, DeleteGreeting)
router.route("/greetings/stop/:id").patch(isAuthenticatedUser, StopGreeting)
router.route("/greetings/bulk/stop").patch(isAuthenticatedUser, StopAllGreetings)
router.route("/greetings/bulk/start").patch(isAuthenticatedUser, StartAllGreetings)
router.route("/bulk/new/greetings").put(isAuthenticatedUser, upload.single('file'), BulkGreetingsUpdateFromExcel)

export default router