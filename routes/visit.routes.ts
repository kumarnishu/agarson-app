import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { AddAnkitInput, AddBrijeshInput, AddVisitSummary, EditVisitSummary, EndMyDay, GetVisitsAttendence, MakeVisitIn, MakeVisitOut, StartMyDay, ToogleAttendence, UploadVisitSamplesPhoto, ValidateVisit, getMyTodayVisit, getVisits } from "../controllers/visit.controller";

const router = express.Router()

router.route("/attendence").get(isAuthenticatedUser, GetVisitsAttendence)
router.route("/visits")
    .get(isAuthenticatedUser, getVisits)
router.route("/visit/today")
    .get(isAuthenticatedUser, getMyTodayVisit)
router.route("/day/start")
    .post(isAuthenticatedUser, upload.single('media'), StartMyDay)
router.route("/day/end/:id")
    .patch(isAuthenticatedUser, upload.single('media'), EndMyDay)
router.route("/visit/in/:id").post(isAuthenticatedUser, upload.single('media'), MakeVisitIn)
router.route("/visit/out/:id").patch(isAuthenticatedUser, upload.none(), MakeVisitOut)
router.route("/visit/samples/upload/:id").patch(isAuthenticatedUser, upload.single('media'), UploadVisitSamplesPhoto)
router.route("/visit/summary/:id").patch(isAuthenticatedUser, AddVisitSummary)
router.route("/visit/summary/edit/:id").patch(isAuthenticatedUser, EditVisitSummary)
router.route("/visit/ankit/input/:id").patch(isAuthenticatedUser, AddAnkitInput)
router.route("/visit/brijesh/input/:id").patch(isAuthenticatedUser, AddBrijeshInput)
router.route("/visit/validate/:id").patch(isAuthenticatedUser, ValidateVisit)
router.route("/visit/toogle/:id").patch(isAuthenticatedUser, ToogleAttendence)


export default router