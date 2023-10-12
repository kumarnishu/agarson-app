import { NextFunction, Request, Response } from 'express';
import isEmail from "validator/lib/isEmail";
import { uploadFileToCloud } from '../utils/uploadFile.util';
import { deleteToken, sendUserToken } from '../middlewares/auth.middleware';
import { User } from '../models/users/user.model';
import { BotField, BroadcastField, ContactField, GlobalFeatureField, LeadField, ReminderField, TemplateField, all_Bot_fields, all_broadcast_fields, all_contact_fields, all_global_fields, all_lead_fields, all_reminder_fields, all_template_fields } from "../types/access.types"
import { Asset, TUserBody, } from "../types"
import isMongoId from "validator/lib/isMongoId";
import { destroyFile } from "../utils/destroyFile.util";
import { sendEmail } from '../utils/sendEmail.util';


// Create Owner account
export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    let users = await User.find()
    if (users.length > 0)
        return res.status(400).json({ message: "not allowed here" })
    let { username, email, password, mobile } = req.body as TUserBody
    // validations
    if (!username || !email || !password || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    if (!isEmail(email))
        return res.status(400).json({ message: "please provide valid email" });
    if (await User.findOne({ username: username.toLowerCase().trim() }))
        return res.status(403).json({ message: `${username} already exists` });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.status(403).json({ message: `${email} already exists` });
    if (await User.findOne({ mobile: mobile }))
        return res.status(403).json({ message: `${mobile} already exists` });

    let dp: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            dp = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let LeadFields: LeadField[] = []
    all_lead_fields.map((field) => {
        LeadFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BotFields: BotField[] = []
    all_Bot_fields.map((field) => {
        BotFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let TemplateFields: TemplateField[] = []
    all_template_fields.map((field) => {
        TemplateFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ContactFields: ContactField[] = []
    all_contact_fields.map((field) => {
        ContactFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BroadcastFields: BroadcastField[] = []
    all_broadcast_fields.map((field) => {
        BroadcastFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let GlobalFeatureFields: GlobalFeatureField[] = []
    all_global_fields.map((field) => {
        GlobalFeatureFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ReminderFields: ReminderField[] = []
    all_reminder_fields.map((field) => {
        ReminderFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })

    let owner = new User({
        username,
        password,
        email,
        mobile,
        is_admin: true,
        dp,
        client_id: username.replace(" ", "") + `${Number(new Date())}`,
        client_data_path: username.replace(" ", "") + `${Number(new Date())}`

    })
    owner.lead_fields = LeadFields
    owner.bot_fields = BotFields
    owner.global_fields = GlobalFeatureFields
    owner.reminder_fields = ReminderFields
    owner.contact_fields = ContactFields
    owner.broadcast_fields = BroadcastFields
    owner.template_fields = TemplateFields
    owner.created_by = owner
    owner.created_by_username = owner.username
    owner.updated_by = owner
    owner.updated_by_username = owner.username
    sendUserToken(res, owner.getAccessToken())
    await owner.save()
    owner = await User.findById(owner._id).populate("created_by").populate("updated_by") || owner
    res.status(201).json(owner)
}

export const NewUser = async (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password, mobile } = req.body as TUserBody
    // validations
    if (!username || !email || !password || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    if (!isEmail(email))
        return res.status(400).json({ message: "please provide valid email" });
    if (await User.findOne({ username: username.toLowerCase().trim() }))
        return res.status(403).json({ message: `${username} already exists` });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.status(403).json({ message: `${email} already exists` });
    if (await User.findOne({ mobile: mobile }))
        return res.status(403).json({ message: `${mobile} already exists` });

    let dp: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            dp = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    let LeadFields: LeadField[] = []
    all_lead_fields.map((field) => {
        LeadFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BotFields: BotField[] = []
    all_Bot_fields.map((field) => {
        BotFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let TemplateFields: TemplateField[] = []
    all_template_fields.map((field) => {
        TemplateFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ContactFields: ContactField[] = []
    all_contact_fields.map((field) => {
        ContactFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BroadcastFields: BroadcastField[] = []
    all_broadcast_fields.map((field) => {
        BroadcastFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let GlobalFeatureFields: GlobalFeatureField[] = []
    all_global_fields.map((field) => {
        GlobalFeatureFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ReminderFields: ReminderField[] = []
    all_reminder_fields.map((field) => {
        ReminderFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let user = new User({
        username,
        password,
        email,
        mobile,
        is_admin: false,
        dp,
        client_id: username.replace(" ", "") + `${Number(new Date())}`,
        client_data_path: username.replace(" ", "") + `${Number(new Date())}`

    })
    if (req.user) {
        user.created_by = req.user
        user.updated_by = req.user
        user.created_by_username = req.user.username
        user.updated_by_username = req.user.username
    }
    user.lead_fields = LeadFields
    user.bot_fields = BotFields
    user.global_fields = GlobalFeatureFields
    user.reminder_fields = ReminderFields
    user.contact_fields = ContactFields
    user.broadcast_fields = BroadcastFields
    user.template_fields = TemplateFields
    await user.save()
    user = await User.findById(user._id).populate("created_by").populate("updated_by") || user
    res.status(201).json(user)
}

// login
export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body as TUserBody & { username: string };
    if (!username)
        return res.status(400).json({ message: "please enter username or email" })
    if (!password)
        return res.status(400).json({ message: "please enter password" })

    let user = await User.findOne({
        username: String(username).toLowerCase().trim(),
    }).select("+password").populate("created_by").populate("updated_by")
    if (!user) {
        user = await User.findOne({
            email: String(username).toLowerCase().trim(),
        }).select("+password").populate("created_by").populate("updated_by")
        if (user)
            if (!user.email_verified)
                return res.status(403).json({ message: "please verify email id before login" })
    }
    if (!user)
        return res.status(403).json({ message: "Invalid username or password" })
    if (!user.is_active)
        return res.status(401).json({ message: "you are blocked, contact admin" })
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
        return res.status(403).json({ message: "Invalid username or password" })
    sendUserToken(res, user.getAccessToken())
    user.last_login = new Date()
    await user.save()
    res.status(200).json(user)
}
// logout
export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken)
        return res.status(200).json({ message: "already logged out" })
    await deleteToken(res, req.cookies.accessToken);
    res.status(200).json({ message: "logged out" })
}

// update user lead fields and its roles
export const UpdateCrmFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { lead_fields } = req.body as TUserBody
    if (lead_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        lead_fields
    })
    res.status(200).json({ message: " updated" })
}

export const UpdateBotFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { bot_fields } = req.body as TUserBody
    if (bot_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        bot_fields
    })
    res.status(200).json({ message: " updated" })
}
export const UpdateTemplateFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { template_fields } = req.body as TUserBody
    if (template_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        template_fields
    })
    res.status(200).json({ message: " updated" })
}

export const UpdateContactFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { contact_fields } = req.body as TUserBody
    if (contact_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        contact_fields
    })
    res.status(200).json({ message: " updated" })
}
export const UpdateGlobalFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { global_fields } = req.body as TUserBody
    if (global_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        global_fields
    })
    res.status(200).json({ message: " updated" })
}
export const UpdateReminderFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { reminder_fields } = req.body as TUserBody
    if (reminder_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        reminder_fields
    })
    res.status(200).json({ message: " updated" })
}
export const UpdateBroadcastFieldRoles = async (req: Request, res: Response, next: NextFunction) => {
    const { broadcast_fields } = req.body as TUserBody
    if (broadcast_fields.length === 0)
        return res.status(400).json({ message: "please fill all required fields" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        broadcast_fields
    })
    res.status(200).json({ message: " updated" })
}

// update user only admin can do
export const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, username, mobile } = req.body as TUserBody;
    if (!username || !email || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    //check username
    if (username !== user.username) {
        if (await User.findOne({ username: String(username).toLowerCase().trim() }))
            return res.status(403).json({ message: `${username} already exists` });
    }
    // check mobile
    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    //check email
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }
    // check first owner to update himself
    if ((String(user.created_by._id) === String(user._id)))
        if ((String(user.created_by._id) !== String(req.user?._id)))
            return res.status(403).json({ message: "not allowed contact crm administrator" })

    //handle dp
    let dp = user.dp;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })

        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (user.dp?._id)
                await destroyFile(user.dp._id)
            dp = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    if (email !== user.email) {
        await User.findByIdAndUpdate(user.id, {
            email, username,
            dp,
            email_verified: false
        })
        return res.status(200).json({ message: "user updated" })
    }
    await User.findByIdAndUpdate(user.id, {
        email,
        username,
        mobile,
        dp,
        updated_by_username: req.user?.username,
        updated_by: req.user,
        updated_at: new Date(),
    }).then(() => {
        return res.status(200).json({ message: "user updated" })
    })
}

// get all users only admin can do
export const GetUsers =
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find().populate("created_by").populate("updated_by")
        res.status(200).json(users)
    }

export const GetProfile =
    async (req: Request, res: Response, next: NextFunction) => {
        let id = req.user?._id
        const user = await User.findById(id).populate("created_by").populate("updated_by")
        res.status(200).json(user)
    }


//update profile 
export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, mobile } = req.body as TUserBody;
    if (!email || !mobile) {
        return res.status(400).json({ message: "please fill required fields" })
    }

    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    //check email
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }

    //handle dp
    let dp = user.dp;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 10 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })

        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (user.dp?._id)
                await destroyFile(user.dp?._id)
            dp = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    if (email != user.email) {
        await User.findByIdAndUpdate(user.id, {
            email,
            dp,
            mobile,
            email_verified: false,
            updated_by_username: user.username,
            updated_by: user
        })
            .then(() => { return res.status(200).json({ message: "profile updated" }) })
    }
    await User.findByIdAndUpdate(user.id, {
        email,
        mobile,
        dp,
        updated_by_username: user.username,
        updated_by: user
    })
        .then(() => res.status(200).json({ message: "profile updated" }))
}

//update password
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body as TUserBody & { oldPassword: string, newPassword: string, confirmPassword: string };
    if (!oldPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "please fill required fields" })
    if (confirmPassword == oldPassword)
        return res.status(403).json({ message: "new password should not be same to the old password" })
    if (newPassword !== confirmPassword)
        return res.status(403).json({ message: "new password and confirm password not matched" })
    let user = await User.findById(req.user?._id).select("+password")
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched)
        return res.status(401).json({ message: "Old password is incorrect" })
    user.password = newPassword;
    user.updated_by = user
    user.updated_by_username = user.username
    await user.save();
    res.status(200).json({ message: "password updated" });
}

export const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, confirmPassword } = req.body as TUserBody & { oldPassword: string, newPassword: string, confirmPassword: string };
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "please fill required fields" })
    if (newPassword !== confirmPassword)
        return res.status(403).json({ message: "new password and confirm password not matched" })
    let id = req.params.id
    if (!isMongoId(id)) {
        return res.status(404).json({ message: "user id not valid" })
    }
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.password = newPassword;
    user.updated_by = user
    user.updated_by_username = user.username
    await user.save();
    res.status(200).json({ message: "password updated" });
}

// make admin
export const MakeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (user.is_admin)
        return res.status(404).json({ message: "already a admin" })
    user.is_admin = true
    if (req.user) {
        user.updated_by = user
        user.updated_by_username = user.username
    }
    await user.save();
    res.status(200).json({ message: "admin role provided successfully" });
}


// block user
export const BlockUser = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (!user.is_active)
        return res.status(404).json({ message: "user already blocked" })

    if (String(user.created_by._id) === String(user._id))
        return res.status(403).json({ message: "not allowed contact crm administrator" })
    if (String(user._id) === String(req.user?._id))
        return res.status(403).json({ message: "not allowed this operation here, because you may block yourself" })
    user.is_active = false
    if (req.user) {
        user.updated_by = user
        user.updated_by_username = user.username
    }
    await user.save();
    res.status(200).json({ message: "user blocked successfully" });
}
// unblock user
export const UnBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (user.is_active)
        return res.status(404).json({ message: "user is already active" })
    user.is_active = true
    if (req.user) {
        user.updated_by = user
        user.updated_by_username = user.username
    }
    await user.save();
    res.status(200).json({ message: "user unblocked successfully" });
}

// remove admin
export const RemoveAdmin = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (String(user.created_by._id) === String(user._id))
        return res.status(403).json({ message: "not allowed contact administrator" })
    if (String(user._id) === String(req.user?._id))
        return res.status(403).json({ message: "not allowed this operation here, because you may harm yourself" })
    user = await User.findById(id)
    if (!user?.is_admin)
        res.status(400).json({ message: "you are not an admin" });
    await User.findByIdAndUpdate(id, {
        is_admin: false,
        updated_by_username: req.user?.username,
        updated_by: req.user
    })
    res.status(200).json({ message: "admin role removed successfully" });
}

// sending password reset mail controller
export const SendPasswordResetMail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email) return res.status(400).json({ message: "please provide email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    let users = await User.find({ email: userEmail }).populate('created_by')
    let user = users.filter((user) => { return String(user._id) === String(user.created_by._id) })[0]
    if (user) {
        if (String(user._id) !== String(user.created_by._id))
            return res.status(403).json({ message: "not allowed this service" })
    }
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const resetToken = await user.getResetPasswordToken();
    await user.save();
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n valid for 15 minutes only \n\n\n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `Crm Password Recovery`,
        message: message,
    };
    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
// reset password controller
export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    let resetPasswordToken = req.params.token;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "Please fill all required fields " })
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "passwords do not matched" })
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Reset Password Token is invalid or has been expired" })

    user.password = req.body.newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    res.status(200).json({ message: "password updated" });
}
// send verification mail controller
export const SendVerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email)
        return res.status(400).json({ message: "please provide your email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    const user = await User.findOne({ email: userEmail })
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const verifyToken = await user.getEmailVerifyToken();
    await user.save();
    const emailVerficationUrl = `${req.protocol}://${req.get(
        "host"
    )}/email/verify/${verifyToken}`;
    const message = `Your email verification link is :- \n\n ${emailVerficationUrl} \n\n valid for 15 minutes only \n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `CRM Email Verification`,
        message,
    };

    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.emailVerifyToken = null;
        user.emailVerifyExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
// verify mail controller
export const VerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const emailVerifyToken = req.params.token;
    let user = await User.findOne({
        emailVerifyToken,
        emailVerifyExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Email verification Link  is invalid or has been expired" })
    user.email_verified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExpire = null;
    await user.save();
    res.status(200).json({
        message: `congrats ${user.email} verification successful`
    });
}

export const testRoute = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);

    let LeadFields: LeadField[] = []
    all_lead_fields.map((field) => {
        LeadFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BotFields: BotField[] = []
    all_Bot_fields.map((field) => {
        BotFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let TemplateFields: TemplateField[] = []
    all_template_fields.map((field) => {
        TemplateFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ContactFields: ContactField[] = []
    all_contact_fields.map((field) => {
        ContactFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let BroadcastFields: BroadcastField[] = []
    all_broadcast_fields.map((field) => {
        BroadcastFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let GlobalFeatureFields: GlobalFeatureField[] = []
    all_global_fields.map((field) => {
        GlobalFeatureFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })
    let ReminderFields: ReminderField[] = []
    all_reminder_fields.map((field) => {
        ReminderFields.push({
            field: field,
            readonly: true,
            hidden: false
        })
    })

    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.lead_fields = LeadFields
    user.bot_fields = BotFields
    user.global_fields = GlobalFeatureFields
    user.reminder_fields = ReminderFields
    user.contact_fields = ContactFields
    user.broadcast_fields = BroadcastFields
    user.template_fields = TemplateFields
    await user.save()
    res.status(200).json({ message: "user bot fields roles updated" })
}