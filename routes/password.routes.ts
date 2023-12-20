import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreatePassword, DeletePassword, EditPassword, GetMyPasswords, GetPasswords } from "../controllers/password.controller";


const router = express.Router()

router.route("/passwords").get(isAuthenticatedUser, GetPasswords)
router.route("/passwords/me").get(isAuthenticatedUser, GetMyPasswords)
router.route("/passwords").post(isAuthenticatedUser, CreatePassword)
router.route("/passwords/:id").put(isAuthenticatedUser, EditPassword)
router.route("/passwords/:id").delete(isAuthenticatedUser, DeletePassword)

export default router