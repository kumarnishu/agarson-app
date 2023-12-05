import { Request, Response, NextFunction } from "express";
import { Flow } from "../models/bot/Flow";
import { MenuTracker } from "../models/bot/MenuTracker";
import { KeywordTracker } from "../models/bot/KeywordTracker";
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { IUser } from "../types/user.types";
import { IMenuTracker, TFlowBody, TrackerBody } from "../types/bot.types";
import { clients } from "../utils/CreateWhatsappClient";
import { IChat } from "../types/chat.types";
import { Chat } from "../models/bot/chat.model";

//get
export const GetFlows = async (req: Request, res: Response, next: NextFunction) => {
    let flows = await Flow.find().sort('-created_at').populate('created_by').populate('updated_by').populate('connected_users')
    return res.status(200).json(flows)
}
export const GetTrackers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let trackers = await MenuTracker.find().populate({
            path: 'flow',
            populate: [
                {
                    path: 'connected_users',
                    model: 'User'
                }
            ]
        })
            .sort('-updated_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)
        let count = await MenuTracker.countDocuments()
        return res.status(200).json({
            trackers,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(500).json({ message: "bad request" })
}

export const GetWhatsappChats = async (req: Request, res: Response, next: NextFunction) => {
    let chats = await Chat.find().sort('-timestamp').limit(100)
    return res.status(200).json(chats)
}

export const FuzzySearchTrackers = async (req: Request, res: Response, next: NextFunction) => {
    let key = String(req.query.key).toLowerCase()
    console.log(key)
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let trackers: IMenuTracker[] = []

    trackers = await MenuTracker.find({
        $or: [
            { phone_number: { $regex: key, $options: 'i' } },
            { bot_number: { $regex: key, $options: 'i' } },
            { customer_name: { $regex: key, $options: 'i' } },
        ]
    }
    ).populate({
        path: 'flow',
        populate: [
            {
                path: 'connected_users',
                model: 'User'
            }
        ]
    })
        .sort('-updated_at')
    return res.status(200).json(trackers)
}
export const GetConnectedUsers = async (req: Request, res: Response, next: NextFunction) => {
    let users = await User.find()
    users = users.filter((user) => {
        if (user.connected_number)
            return user
    })
    return res.status(200).json(users)
}

//post/patch/put/delete
export const CreateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { flow_name, nodes, edges, trigger_keywords } = req.body as TFlowBody
    if (!flow_name || !nodes || !edges || !trigger_keywords)
        return res.status(400).json({ message: "please fill required fields" })
    let flows = await Flow.find({ created_by: req.user, flow_name: flow_name })
    let flow = flows[0]
    if (flow)
        return res.status(500).json({ message: "Already a flow exists with this name" })
    await new Flow({
        flow_name: flow_name,
        nodes: nodes,
        edges: edges,
        trigger_keywords: trigger_keywords.toLowerCase(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user,
        connected_users: [req.user]
    }).save()
    return res.status(201).json("new flow created")
}

export const ToogleFlowStatus = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "flow id not valid" })
    let flow = await Flow.findById(id);
    if (!flow) {
        return res.status(404).json({ message: "flow not found" })
    }
    await Flow.findByIdAndUpdate(id, {
        is_active: !flow.is_active
    })
    return res.status(200).json({ message: "flow status updated" })
}

export const UpdateFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { flow_name, nodes, edges, trigger_keywords } = req.body as TFlowBody
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "please provide correct flow id" })
    }
    if (!flow_name || !nodes || !edges || !trigger_keywords)
        return res.status(400).json({ message: "please fill required fields" })


    let flow = await Flow.findById(id)
    if (flow?.flow_name !== flow_name) {
        let flows = await Flow.find({ created_by: req.user, flow_name: flow_name })
        let flowtmp = flows[0]
        if (flowtmp)
            return res.status(400).json({ message: "Already a flow exists with this name" })
    }

    if (flow) {
        await Flow.findByIdAndUpdate(flow._id, {
            flow_name: flow_name,
            nodes: nodes,
            edges: edges,
            trigger_keywords: trigger_keywords.toLowerCase(),
            created_at: new Date(),
            updated_at: new Date(),
            updated_by: req.user
        })
        return res.status(200).json({ message: "flow updated" })
    }
    else
        return res.status(404).json({ message: "flow not exists" })

}

export const AssignFlow = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const { user_ids } = req.body as { user_ids: string[] }
    if (!id) {
        return res.status(400).json({ message: "please provide correct flow id" })
    }
    let flow = await Flow.findById(id)
    if (!flow)
        return res.status(404).json({ message: "flow not found" })

    let connected_users: IUser[] = []
    for (let i = 0; i < user_ids.length; i++) {
        let user = await User.findById(user_ids[i])
        if (user)
            connected_users?.push(user)
    }
    flow.connected_users = connected_users
    await flow.save()
    return res.status(200).json("assigned users successfully")
}


export const DestroyFlow = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let flow = await Flow.findById(id)
    let menuTrackers = await MenuTracker.find({ flow: flow })
    let keywordTrackers = await KeywordTracker.find({ flow: flow })
    if (!flow)
        return res.status(404).json({ message: "flow not exists" })
    await Flow.findByIdAndDelete(flow._id)
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndDelete(tracker._id)
    })
    keywordTrackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndDelete(tracker._id)
    })
    return res.status(200).json({ message: "deleted flow" })
}



export const UpdateTrackerName = async (req: Request, res: Response, next: NextFunction) => {
    const { customer_name } = req.body as TrackerBody
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "please provide correct tracker id" })
    }
    await MenuTracker.findByIdAndUpdate(id, { customer_name: customer_name })
    return res.status(200).json({ message: "customer name updated" })
}


export const ToogleTrackerStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number, bot_number } = req.body as TrackerBody
    let trackers = await KeywordTracker.find({ phone_number: phone_number, bot_number: bot_number })
    let menuTrackers = await MenuTracker.find({ phone_number: phone_number, bot_number: bot_number })
    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: !tracker.is_active })
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: !tracker.is_active })
    })

    return res.status(200).json("bot successfully changed for this number")
}



export const ResetTrackers = async (req: Request, res: Response, next: NextFunction) => {
    let trackers = await KeywordTracker.find()
    let menuTrackers = await MenuTracker.find()

    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndUpdate(tracker._id, { is_active: true, skip_main_menu: false })
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndUpdate(tracker._id, { is_active: true })
    })
    return res.status(200).json("successfully reset trackers")
}

export const DeleteTracker = async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number, bot_number } = req.body as TrackerBody
    let trackers = await KeywordTracker.find({ phone_number: phone_number, bot_number: bot_number })
    let menuTrackers = await MenuTracker.find({ phone_number: phone_number, bot_number: bot_number })
    trackers.forEach(async (tracker) => {
        await KeywordTracker.findByIdAndDelete(tracker._id)
    })
    menuTrackers.forEach(async (tracker) => {
        await MenuTracker.findByIdAndDelete(tracker._id)
    })
    return res.status(200).json("successfully deleted")
}