import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { EndMyDay, MakeVisitIn, MakeVisitOut, StartMyDay, getMyTodayVisit, getMyVisits, getVisits } from "../controllers/visit.controller";

const router = express.Router()

router.route("/visits")
    .get(isAuthenticatedUser, getVisits)
router.route("/visits/me")
    .get(isAuthenticatedUser, getMyVisits)
router.route("/visit/today")
    .get(isAuthenticatedUser, getMyTodayVisit)
router.route("/day/start")
    .post(isAuthenticatedUser, upload.single('media'), StartMyDay)
router.route("/day/end/:id")
    .patch(isAuthenticatedUser, upload.single('media'), EndMyDay)
router.route("/visit/in/:id").post(isAuthenticatedUser, upload.single('media'), MakeVisitIn)
router.route("/visit/out/:id").patch(isAuthenticatedUser, upload.none(), MakeVisitOut)


export default router