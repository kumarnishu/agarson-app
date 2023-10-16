import express from "express"
import { isAuthenticatedUser } from "../middlewares/auth.middleware"
import { upload } from "./user.routes"
import { CreateAlpsRecord,  FuzzySearchAlpss, GetAlpss } from "../controllers/alps.controller"

const router = express.Router()

router.route("/alps").get(isAuthenticatedUser, GetAlpss)
    .post(upload.single('media'), CreateAlpsRecord)
router.route("/search/alps").get(isAuthenticatedUser, FuzzySearchAlpss)


export default router
