import express from "express"
import { isAuthenticatedUser } from "../middlewares/auth.middleware"
import { upload } from "./user.routes"
import { CreateAlpsRecord, DeleteAlpsRecord, FuzzySearchAlpss, GetAlpss } from "../controllers/alps.controller"

const router = express.Router()

router.route("/alps").get(isAuthenticatedUser, GetAlpss)
    .post(upload.single('media'), CreateAlpsRecord)
router.route("/search/alps").get(isAuthenticatedUser, FuzzySearchAlpss)
router.route("/alps/:id")
    .delete(isAuthenticatedUser, DeleteAlpsRecord)

export default router
