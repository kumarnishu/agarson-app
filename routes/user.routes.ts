import express from "express";
import multer from "multer";

import { BlockUser, GetProfile, GetUsers, Login, Logout, MakeAdmin, NewUser, RemoveAdmin, ResetPassword, SendPasswordResetMail, SendVerifyEmail, SignUp, UnBlockUser, UpdateAccessFields, UpdateProfile, UpdateUser, VerifyEmail, updatePassword, resetUserPassword, FuzzySearchUsers, AssignUsers, GetPaginatedUsers, AllowMultiLogin, BlockMultiLogin, GetAllUsers, NewCustomer } from "../controllers/user.controller";
import { isAdmin, isAuthenticatedUser, isProfileAuthenticated, } from "../middlewares/auth.middleware";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()

router.post("/signup", upload.single("dp"), SignUp)
router.post("/customers", upload.single("dp"), NewCustomer)
router.route("/users").get(isAuthenticatedUser, GetUsers)
    .post(isAuthenticatedUser, upload.single("dp"), NewUser)
router.route("/search/users").get(isAuthenticatedUser, FuzzySearchUsers)
router.route("/users/paginated").get(isAuthenticatedUser, GetPaginatedUsers)
router.route("/users/:id")
    .put(isAuthenticatedUser, upload.single("dp"), UpdateUser)
router.patch("/make-admin/user/:id", isAuthenticatedUser, isAdmin, MakeAdmin)
router.patch("/allow/multi_login/:id", isAuthenticatedUser, isAdmin, AllowMultiLogin)
router.patch("/block/multi_login/:id", isAuthenticatedUser, isAdmin, BlockMultiLogin)
router.patch("/block/user/:id", isAuthenticatedUser, isAdmin, BlockUser)
router.patch("/unblock/user/:id", isAuthenticatedUser, isAdmin, UnBlockUser)
router.patch("/remove-admin/user/:id", isAuthenticatedUser, isAdmin, RemoveAdmin)
router.patch("/update/access/user/:id", isAuthenticatedUser, UpdateAccessFields)
router.patch("/assign/users/:id", isAuthenticatedUser, AssignUsers)
router.post("/login", Login)
router.post("/logout", Logout)
router.route("/profile")
    .get(isProfileAuthenticated, GetProfile)
    .put(isAuthenticatedUser, upload.single("dp"), UpdateProfile)
router.route("/password/update").patch(isAuthenticatedUser, updatePassword)
router.route("/password/reset/:id").patch(isAuthenticatedUser, resetUserPassword)
router.route("/users/all").get(isAuthenticatedUser, isAdmin, GetAllUsers)
router.post("/email/verify", isAuthenticatedUser, SendVerifyEmail)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/password/reset", SendPasswordResetMail)
router.patch("/password/reset/:token", ResetPassword)


export default router;