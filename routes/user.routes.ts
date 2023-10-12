import express from "express";
import multer from "multer";

import { BlockUser, GetProfile, GetUsers, Login, Logout, MakeAdmin, NewUser, RemoveAdmin, ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp, UnBlockUser, UpdateBotFieldRoles, UpdateBroadcastFieldRoles, UpdateContactFieldRoles, UpdateCrmFieldRoles, UpdateGlobalFieldRoles, UpdateProfile, UpdateReminderFieldRoles, UpdateTemplateFieldRoles, UpdateUser, VerifyEmail, testRoute, updatePassword, updateUserPassword } from "../controllers/user.controller";
import { isOwner, isAuthenticatedUser, isProfileAuthenticated, } from "../middlewares/auth.middleware";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()

router.post("/signup", upload.any(), SignUp)
router.route("/users").get(isAuthenticatedUser, GetUsers)
    .post(isAuthenticatedUser, isOwner, upload.single("dp"), NewUser)
router.route("/users/:id")
    .put(isAuthenticatedUser, isOwner, upload.single("dp"), UpdateUser)
router.patch("/make-admin/user/:id", isAuthenticatedUser, isOwner, MakeAdmin)
router.patch("/block/user/:id", isAuthenticatedUser, isOwner, BlockUser)
router.patch("/unblock/user/:id", isAuthenticatedUser, isOwner, UnBlockUser)
router.patch("/remove-admin/user/:id", isAuthenticatedUser, isOwner, RemoveAdmin)
router.patch("/update-crm-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateCrmFieldRoles)
router.patch("/update-bot-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateBotFieldRoles)
router.patch("/update-template-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateTemplateFieldRoles)
router.patch("/update-contact-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateContactFieldRoles)
router.patch("/update-reminder-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateReminderFieldRoles)
router.patch("/update-broadcast-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateBroadcastFieldRoles)
router.patch("/update-global-field-roles/user/:id", isAuthenticatedUser, isOwner, UpdateGlobalFieldRoles)
router.post("/login", Login)
router.post("/logout", Logout)
router.route("/profile")
    .get(isProfileAuthenticated, GetProfile)
    .put(isAuthenticatedUser, upload.single("dp"), isOwner, UpdateProfile)
router.route("/password/update").patch(isAuthenticatedUser, isOwner, updatePassword)
router.route("/password/update/:id").patch(isAuthenticatedUser, isOwner, updateUserPassword)

router.post("/email/verify", isAuthenticatedUser, SendVerifyEmail)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/password/reset", SendPasswordResetMail)
router.patch("/password/reset/:token", ResetPassword)
router.patch("/test/:id", testRoute)


export default router;