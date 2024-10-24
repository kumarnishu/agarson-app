import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import {  CreateChecklist, CreateChecklistCategory, CreateChecklistFromExcel, DeleteChecklist, DeleteChecklistCategory, DownloadExcelTemplateForCreatechecklists, EditChecklist, GetAllChecklistCategory, GetChecklists, ToogleChecklist, UpdateChecklistCategory } from "../controllers/checklist.controller";
import { upload } from "./user.routes";

const router = express.Router()


router.route("/checklists/categories").get(isAuthenticatedUser, GetAllChecklistCategory).post(isAuthenticatedUser, CreateChecklistCategory)
router.route("/checklists/categories/:id").put(isAuthenticatedUser, UpdateChecklistCategory).delete(isAuthenticatedUser,DeleteChecklistCategory)
router.route("/checklists").get(isAuthenticatedUser, GetChecklists).post(isAuthenticatedUser, upload.single('photo'), CreateChecklist)
router.route("/checklists/toogle/:id").patch(isAuthenticatedUser, ToogleChecklist)
router.route("/checklists/:id").put(isAuthenticatedUser, upload.single('photo'), EditChecklist)
// router.route("/checklists/:id").patch(isAuthenticatedUser, AddMoreCheckBoxes)
router.route("/checklists/:id").delete(isAuthenticatedUser, DeleteChecklist)
router.route("/create-from-excel/checklists")
    .post(isAuthenticatedUser, upload.single("excel"), CreateChecklistFromExcel)
router.get("/download/template/checklists", isAuthenticatedUser, DownloadExcelTemplateForCreatechecklists)

export default router