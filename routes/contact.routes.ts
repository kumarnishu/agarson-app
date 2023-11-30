import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { BulkContactUpdateFromExcel, CreateContact, DeleteContact, GetContacts, UpdateContact } from "../controllers/contact.controller";
import { upload } from "./user.routes";

const router = express.Router()

router.route("/contacts").get(isAuthenticatedUser,GetContacts)
router.route("/contacts").post(isAuthenticatedUser, CreateContact)
router.route("/contacts/:id").put(isAuthenticatedUser, UpdateContact)
router.route("/contacts/:id").delete(isAuthenticatedUser, DeleteContact)
router.route("/bulk/new/contacts").put(isAuthenticatedUser, upload.single('file'), BulkContactUpdateFromExcel)


export default router