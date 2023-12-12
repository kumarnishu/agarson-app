import { NextFunction, Request, Response } from 'express';
import isEmail from "validator/lib/isEmail";
import { uploadFileToCloud } from '../utils/uploadFile.util';
import { deleteToken, sendUserToken } from '../middlewares/auth.middleware';
import { User } from '../models/users/user.model';
import isMongoId from "validator/lib/isMongoId";
import { destroyFile } from "../utils/destroyFile.util";
import { sendEmail } from '../utils/sendEmail.util';
import { IUser, TUserBody } from '../types/user.types';
import { Asset } from '../types/asset.types';

//get
export const GetPaginatedUsers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let users = await User.find().populate("created_by").populate("updated_by").populate('assigned_users').skip((page - 1) * limit).limit(limit)
        let count = await User.find().countDocuments()
        return res.status(200).json({
            users,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().populate("created_by").populate("updated_by").populate('assigned_users')
    res.status(200).json(users)
}

export const FuzzySearchUsers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let key = String(req.query.key).split(",")
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let users: IUser[] = []
    let count = 0
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {
            users = await User.find({

                $or: [
                    { username: { $regex: key[0], $options: 'i' } },
                    { email: { $regex: key[0], $options: 'i' } },
                    { mobile: { $regex: key[0], $options: 'i' } },
                ]

            }
            ).populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await User.find({

                $or: [
                    { username: { $regex: key[0], $options: 'i' } },
                    { email: { $regex: key[0], $options: 'i' } },
                    { mobile: { $regex: key[0], $options: 'i' } },
                ]

            }
            ).countDocuments()
        }
        if (key.length == 2) {
            users = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).countDocuments()
        }
        if (key.length == 3) {
            users = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).countDocuments()
        }
        if (key.length == 4) {
            users = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await User.find({

                $and: [
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { username: { $regex: key[0], $options: 'i' } },
                            { email: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).countDocuments()
        }
        return res.status(200).json({
            users,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}


export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.user?._id
    const user = await User.findById(id).populate("created_by").populate("updated_by")
    res.status(200).json(user)
}


//post/put/patch/delete
export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    let users = await User.find()
    if (users.length > 0)
        return res.status(400).json({ message: "not allowed" })

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


    let owner = new User({
        username,
        password,
        email,
        mobile,
        is_admin: true,
        dp,
        client_id: username.split(" ")[0] + `${Number(new Date())}`,
        client_data_path: username.split(" ")[0] + `${Number(new Date())}`

    })
    owner.user_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.greetings_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.visit_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.todos_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.reports_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.alps_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.crm_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.contacts_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.templates_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.bot_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.broadcast_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.backup_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.reminders_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.tasks_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.checklists_access_fields = {
        is_hidden: false,
        is_editable: true,
        is_deletion_allowed: true
    }
    owner.updated_by = owner
    owner.created_by = owner
    owner.created_at = new Date()
    owner.updated_at = new Date()
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


    let user = new User({
        username,
        password,
        email,
        mobile,
        is_admin: false,
        dp,
        client_id: username.split(" ")[0] + `${Number(new Date())}`,
        client_data_path: username.split(" ")[0] + `${Number(new Date())}`

    })
    if (req.user) {
        user.created_by = req.user
        user.updated_by = req.user

    }
    user.created_at = new Date()
    user.updated_at = new Date()
    user.user_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.visit_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.greetings_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.todos_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.reports_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.crm_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.contacts_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.templates_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.bot_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.broadcast_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.backup_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.reminders_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.tasks_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    user.checklists_access_fields = {
        is_hidden: false,
        is_editable: false,
        is_deletion_allowed: false
    }
    await user.save()
    user = await User.findById(user._id).populate("created_by").populate("updated_by") || user
    res.status(201).json(user)
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, multi_login_token } = req.body as TUserBody
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
    if (user.created_by._id !== user._id) {
        if (!user.is_multi_login && user.multi_login_token && user.multi_login_token !== multi_login_token)
            return res.status(403).json({ message: "Sorry ! You are already logged in on an another device,contact administrator" })
        if (!user.is_multi_login && !user.multi_login_token)
            user.multi_login_token = multi_login_token
    }

    sendUserToken(res, user.getAccessToken())
    user.last_login = new Date()
    await user.save()
    res.status(200).json(user)
}
export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken)
        return res.status(200).json({ message: "already logged out" })
    await deleteToken(res, req.cookies.accessToken);
    res.status(200).json({ message: "logged out" })
}

export const AssignUsers = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { ids } = req.body as { ids: string[] }
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let users: IUser[] = []
    for (let i = 0; i < ids.length; i++) {
        let user = await User.findById(ids[i])
        if (user)
            users.push(user)
    }

    console.log(users)
    user.assigned_users = users
    if (req.user) {
        user.updated_by = user
    }
    await user.save();
    res.status(200).json({ message: "assigned users successfully" });
}
export const UpdateAccessFields = async (req: Request, res: Response, next: NextFunction) => {
    const { user_access_fields,
        crm_access_fields,
        contacts_access_fields,
        templates_access_fields,
        bot_access_fields,
        broadcast_access_fields,
        backup_access_fields,
        reminders_access_fields,
        alps_access_fields,
        tasks_access_fields,
        checklists_access_fields,
        visit_access_fields,
        reports_access_fields,
        todos_access_fields,
        greetings_access_fields

    } = req.body as TUserBody

    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    await User.findByIdAndUpdate(user._id, {
        user_access_fields,
        crm_access_fields,
        contacts_access_fields,
        templates_access_fields,
        bot_access_fields,
        broadcast_access_fields,
        backup_access_fields,
        reminders_access_fields,
        alps_access_fields,
        tasks_access_fields,
        checklists_access_fields,
        reports_access_fields,
        todos_access_fields,
        visit_access_fields,
        greetings_access_fields
    })
    res.status(200).json({ message: " updated" })
}

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
    // check  owner to update himself
    if ((String(user.created_by._id) === String(user._id)))
        if ((String(user._id) === String(req.user?._id)))
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
        updated_by: req.user,
        updated_at: new Date(),
    }).then(() => {
        return res.status(200).json({ message: "user updated" })
    })
}

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
            updated_by: user
        })
            .then(() => { return res.status(200).json({ message: "profile updated" }) })
    }
    await User.findByIdAndUpdate(user.id, {
        email,
        mobile,
        dp,
        updated_by: user
    })
        .then(() => res.status(200).json({ message: "profile updated" }))
}

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
    await user.save();
    res.status(200).json({ message: "password updated" });
}

export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
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
    await user.save();
    res.status(200).json({ message: "password updated" });
}

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
    }
    await user.save();
    res.status(200).json({ message: "admin role provided successfully" });
}



export const AssignUserstoManager = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { ids } = req.body as { ids: string[] }
    if (!isMongoId(id)) return res.status(400).json({ message: "manager id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "manager not found" })
    }
    let users: IUser[] = []
    ids.forEach(async (_id) => {
        let _user = await User.findById(_id)
        if (_user)
            users.push(_user)
    })
    user.assigned_users = users
    if (req.user) {
        user.updated_by = user
    }
    await user.save();
    res.status(200).json({ message: "assigned users successfully" });
}

export const AllowMultiLogin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.is_multi_login = true
    user.multi_login_token = null
    user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "multi login allowed " });
}
export const BlockMultiLogin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { multi_login_token } = req.body as { multi_login_token: string }
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.is_multi_login = false
    user.multi_login_token = null
    user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "multi login blocked " });
}
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
    }
    await user.save();
    res.status(200).json({ message: "user blocked successfully" });
}

export const UnBlockUser = async (req: Request, res: Response, next: NextFunction) => {
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
    }
    await user.save();
    res.status(200).json({ message: "user unblocked successfully" });
}


export const RemoveAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
    const resetPasswordUrl = `${process.env.HOST}/password/reset/${resetToken}`;
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
    const emailVerficationUrl = `${process.env.HOST}/email/verify/${verifyToken}`


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
