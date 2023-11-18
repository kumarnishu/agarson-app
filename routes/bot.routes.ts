import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { AssignFlow, CreateFlow, DestroyFlow, FuzzySearchTrackers, GetConnectedUsers, GetFlows, GetTrackers, ResetTrackers, ToogleFlowStatus, ToogleTrackerStatus, UpdateFlow, UpdateTrackerName } from "../controllers/bot.controller";

const router = express.Router()

router.route("/flows").get(isAuthenticatedUser, GetFlows)
router.route("/flows").post(isAuthenticatedUser, CreateFlow)
router.route("/flows/:id").delete(isAuthenticatedUser, DestroyFlow)
router.route("/flows/:id").put(isAuthenticatedUser, UpdateFlow)
router.route("/trackers").get(isAuthenticatedUser, GetTrackers)
router.route("/trackers").post(isAuthenticatedUser, ResetTrackers)
router.route("/trackers/:id").put(isAuthenticatedUser, UpdateTrackerName)
router.route("/toogle").post(isAuthenticatedUser, ToogleTrackerStatus)
router.route("/connected/users").get(isAuthenticatedUser, GetConnectedUsers)
router.route("/flows/asign/:id").patch(isAuthenticatedUser, AssignFlow)
router.route("/flows/toogle/:id").patch(isAuthenticatedUser, ToogleFlowStatus)

router.route("/search/trackers").get(isAuthenticatedUser, FuzzySearchTrackers)
export default router

