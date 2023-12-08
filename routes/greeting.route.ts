import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { ActivateGreeting, CreateGreeting, DeleteGreeting, FetchGreetings, StartAllGreetings, StopAllGreetings, StopGreeting, UpdateGreeting } from "../controllers/greeting.controller";

const router = express.Router()
router.route("/greetings").post(isAuthenticatedUser, CreateGreeting)
router.route("/greetings/:id").put(isAuthenticatedUser, UpdateGreeting)

router.route("/greetings").get(isAuthenticatedUser, FetchGreetings)
router.route("/greetings/start/:id").patch(isAuthenticatedUser, ActivateGreeting)
router.route("/greetings/:id").delete(isAuthenticatedUser, DeleteGreeting)
router.route("/greetings/stop/:id").patch(isAuthenticatedUser, StopGreeting)
router.route("/greetings/stop/bulk").patch(isAuthenticatedUser, StopAllGreetings)
router.route("/greetings/start/bulk/").patch(isAuthenticatedUser, StartAllGreetings)
export default router