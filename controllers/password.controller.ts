import { NextFunction, Request, Response } from "express"
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { IPassword, IPasswordBody } from "../types/password.types";
import { Password } from "../models/passwords/password.model";
import { IUser } from "../types/user.types";

//get
export const GetPasswords = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.query.id
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let passwords: IPassword[] = []
    let count = 0
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (!id) {
            passwords = await Password.find().populate('persons').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Password.find().countDocuments()
        }

        if (id) {
            passwords = await Password.find({ persons: id }).populate('persons').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Password.find({ person: id }).countDocuments()
        }


        return res.status(200).json({
            passwords,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetMyPasswords = async (req: Request, res: Response, next: NextFunction) => {
    let passwords = await Password.find({ persons: req.user._id }).populate('persons').populate('updated_by').populate('created_by').sort('-created_at')
    return res.status(200).json(passwords)
}

//put/post/patch/delte
export const CreatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { state, username, password, ids } = req.body as IPasswordBody & {
        ids: string[]
    }

    if (!state || !username || !password)
        return res.status(400).json({ message: "please provide all required fields" })
    if (await Password.findOne({ state: state }))
        return res.status(404).json({ message: 'password already exists for this state' })
    let new_persons: IUser[] = []
    for (let i = 0; i < ids.length; i++) {
        let owner = await User.findById(ids[i])
        if (owner)
            new_persons.push(owner)
    }
    if (new_persons.length === 0)
        return res.status(404).json({ message: 'assign at least one person' })

    let new_password = new Password({
        state, username, password,
        persons: new_persons,
        created_at: new Date(), updated_at: new Date(), created_by: req.user, updated_by: req.user
    })
    await new_password.save()
    return res.status(201).json(new_password);
}

export const EditPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { state, username, password, ids } = req.body as IPasswordBody & {
        ids: string[]
    }

    let id = req.params.id
    let oldpassword = await Password.findById(id)


    if (!oldpassword)
        return res.status(400).json({ message: "this password not exists" })

    if (oldpassword.state !== state)
        if (await Password.findOne({ state: state }))
            return res.status(404).json({ message: 'password already exists for this state' })

    if (!state || !username || !password)
        return res.status(400).json({ message: "please provide all required fields" })

    let new_persons: IUser[] = []
    for (let i = 0; i < ids.length; i++) {
        let owner = await User.findById(ids[i])
        if (owner)
            new_persons.push(owner)
    }
    if (new_persons.length === 0)
        return res.status(404).json({ message: 'assign at least one person' })

    oldpassword.state = state
    oldpassword.username = username
    oldpassword.password = password
    oldpassword.persons = new_persons
    await oldpassword.save()
    return res.status(200).json({ message: `Password updated` });
}

export const DeletePassword = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let password = await Password.findById(id)
    if (!password) {
        return res.status(404).json({ message: "password not found" })
    }
    await password.remove()
    return res.status(200).json({ message: `password deleted` });
}








