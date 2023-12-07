import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { CreateGreeting, DeleteGreeting, FetchGreetings, StartGreeting, UpdateGreeting } from "../controllers/greeting.controller";

const router = express.Router()
router.route("/greetings").post(isAuthenticatedUser, CreateGreeting)
router.route("/greetings/:id").put(isAuthenticatedUser, UpdateGreeting)

router.route("/greetings").get(isAuthenticatedUser, FetchGreetings)
router.route("/greetings/:id").patch(isAuthenticatedUser, StartGreeting)
router.route("/greetings/:id").delete(isAuthenticatedUser, DeleteGreeting)
export default router