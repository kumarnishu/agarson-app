import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";


const router = express.Router()

// router.route("/checklists").get(isAuthenticatedUser, GetCheckLists)
// router.route("/checklists/self").get(isAuthenticatedUser, GetMyCheckLists)
// router.route("/checklists/self/:id").patch(isAuthenticatedUser, ToogleMyChecklist)
// router.route("/checklists/:id").post(isAuthenticatedUser, CreateChecklist)
// router.route("/checklists/:id").put(isAuthenticatedUser, EditChecklist)
// router.route("/checklists/:id").patch(isAuthenticatedUser, AddMoreCheckBoxes)
// router.route("/checklists/:id").delete(isAuthenticatedUser, DeleteChecklist)


export default router