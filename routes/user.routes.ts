import express from "express";
import multer from "multer";

import { BlockUser, GetProfile, GetUsers, Login, Logout, MakeAdmin, NewUser, RemoveAdmin, ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp, UnBlockUser, UpdateAccessFields, UpdateProfile, UpdateUser, VerifyEmail, testRoute, updatePassword, updateUserPassword } from "../controllers/user.controller";
import { isAuthenticatedUser, isProfileAuthenticated, } from "../middlewares/auth.middleware";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()

router.post("/signup", upload.single("dp"), SignUp)
router.route("/users").get(isAuthenticatedUser, GetUsers)
    .post(isAuthenticatedUser, upload.single("dp"), NewUser)
router.route("/users/:id")
    .put(isAuthenticatedUser, upload.single("dp"), UpdateUser)
router.patch("/make-admin/user/:id", isAuthenticatedUser, MakeAdmin)
router.patch("/block/user/:id", isAuthenticatedUser, BlockUser)
router.patch("/unblock/user/:id", isAuthenticatedUser, UnBlockUser)
router.patch("/remove-admin/user/:id", isAuthenticatedUser, RemoveAdmin)
router.patch("/update/access/user/:id", isAuthenticatedUser, UpdateAccessFields)

router.post("/login", Login)
router.post("/logout", Logout)
router.route("/profile")
    .get(isProfileAuthenticated, GetProfile)
    .put(isAuthenticatedUser, upload.single("dp"), UpdateProfile)
router.route("/password/update").patch(isAuthenticatedUser, updatePassword)
router.route("/password/update/:id").patch(isAuthenticatedUser, updateUserPassword)

router.post("/email/verify", isAuthenticatedUser, SendVerifyEmail)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/password/reset", SendPasswordResetMail)
router.patch("/password/reset/:token", ResetPassword)
router.patch("/test/:id", testRoute)


export default router;