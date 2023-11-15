import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { AddMoreBoxes, CreateCheckList, DeleteCheckList, EditCheckList, GetMyCheckLists, GetCheckLists, ToogleMyCheckList } from "../controllers/checklist.controller";

const router = express.Router()

router.route("/checklists").get(isAuthenticatedUser, GetCheckLists)
router.route("/checklists/self").get(isAuthenticatedUser, GetMyCheckLists)
router.route("/checklists/self/:id").patch(isAuthenticatedUser, ToogleMyCheckList)
router.route("/checklists/:id").post(isAuthenticatedUser, CreateCheckList)
router.route("/checklists/:id").put(isAuthenticatedUser, EditCheckList)
router.route("/checklists/:id").patch(isAuthenticatedUser, AddMoreBoxes)
router.route("/checklists/:id").delete(isAuthenticatedUser, DeleteCheckList)


export default router