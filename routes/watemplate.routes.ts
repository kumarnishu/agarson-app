import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { CreateMessagetemplate, DeleteMessagetemplate, GetMessagetemplates, UpdateMessagetemplate } from "../controllers/watemplate.controller";


const router = express.Router()

router.route("/watemplates").get(isAuthenticatedUser, GetMessagetemplates)
    .post(isAuthenticatedUser, upload.single('media'), CreateMessagetemplate)
router.route("/watemplates/:id").put(isAuthenticatedUser, upload.single('media'), UpdateMessagetemplate)
    .delete(isAuthenticatedUser, DeleteMessagetemplate)

export default router
