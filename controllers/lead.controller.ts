import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import xlsx from "xlsx"
import Lead, { ILead } from "../models/leads/lead.model.js"
import { Asset, IUser, User } from "../models/users/user.model.js"
import { IRemark, Remark } from "../models/leads/remark.model.js"
import { uploadFileToCloud } from "../utils/uploadFile.util.js"
import { Types } from "mongoose"
import { destroyFile } from "../utils/destroyFile.util.js"
import { IReferredParty, ReferredParty } from "../models/leads/referred.model.js"
import { CRMState, ICRMState } from "../models/leads/crm.state.model.js"
import { ICRMCityTemplate, ICRMStateTemplate, ILeadTemplate, IReferTemplate } from "../types/template.type.js"
import { SaveLeadMobilesToExcel, SaveLeadsToExcel } from "../utils/ExportToExcel.js"
import { CRMCity, ICRMCity } from "../models/leads/crm.city.model.js"
import { LeadType } from "../models/leads/crm.leadtype.model.js"
import { LeadSource } from "../models/leads/crm.source.model.js"
import { IStage, Stage } from "../models/leads/crm.stage.model.js"
import { HandleCRMCitiesAssignment } from "../utils/AssignCitiesToUsers.js"


//lead types
export const GetAllCRMLeadTypes = async (req: Request, res: Response, next: NextFunction) => {
    let types = await LeadType.find()
    return res.status(200).json(types)
}

export const MergeTwoLeads = async (req: Request, res: Response, next: NextFunction) => {
    let types = await LeadType.find()
    return res.status(200).json(types)
}


export const CreateCRMLeadTypes = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body as {
        type: string
    }
    if (!type) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await LeadType.findOne({ type: type.toLowerCase() }))
        return res.status(400).json({ message: "already exists this type" })
    let result = await new LeadType({
        type: type,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateCRMLeadTypes = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body as {
        type: string
    }
    if (!type) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldtype = await LeadType.findById(id)
    if (!oldtype)
        return res.status(404).json({ message: "type not found" })
    if (type !== oldtype.type)
        if (await LeadType.findOne({ type: type.toLowerCase() }))
            return res.status(400).json({ message: "already exists this type" })
    let prevtype = oldtype.type
    oldtype.type = type
    oldtype.updated_at = new Date()
    if (req.user)
        oldtype.updated_by = req.user
    await Lead.updateMany({ type: prevtype }, { type: type })
    await ReferredParty.updateMany({ type: prevtype }, { type: type })
    await oldtype.save()
    return res.status(200).json(oldtype)

}
export const DeleteCRMLeadType = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "type id not valid" })
    let type = await LeadType.findById(id);
    if (!type) {
        return res.status(404).json({ message: "type not found" })
    }
    await type.remove();
    return res.status(200).json({ message: "lead type deleted successfully" })
}


//source types
export const GetAllCRMLeadSources = async (req: Request, res: Response, next: NextFunction) => {
    let sources = await LeadSource.find()
    return res.status(200).json(sources)
}


export const CreateCRMLeadSource = async (req: Request, res: Response, next: NextFunction) => {
    const { source } = req.body as {
        source: string
    }
    if (!source) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await LeadSource.findOne({ source: source.toLowerCase() }))
        return res.status(400).json({ message: "already exists this source" })
    let result = await new LeadSource({
        source: source,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateCRMLeadSource = async (req: Request, res: Response, next: NextFunction) => {
    const { source } = req.body as {
        source: string
    }
    if (!source) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldsource = await LeadSource.findById(id)
    if (!oldsource)
        return res.status(404).json({ message: "source not found" })
    if (source !== oldsource.source)
        if (await LeadSource.findOne({ source: source.toLowerCase() }))
            return res.status(400).json({ message: "already exists this source" })
    let prevsource = oldsource.source
    oldsource.source = source
    oldsource.updated_at = new Date()
    if (req.user)
        oldsource.updated_by = req.user
    await Lead.updateMany({ source: prevsource }, { source: source })
    await ReferredParty.updateMany({ source: prevsource }, { source: source })
    await oldsource.save()
    return res.status(200).json(oldsource)

}
export const DeleteCRMLeadSource = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "source id not valid" })
    let source = await LeadSource.findById(id);
    if (!source) {
        return res.status(404).json({ message: "source not found" })
    }
    await source.remove();
    return res.status(200).json({ message: "lead source deleted successfully" })
}


//lead stages
export const GetAllCRMLeadStages = async (req: Request, res: Response, next: NextFunction) => {
    let stages: IStage[] = []
    stages = await Stage.find()
    return res.status(200).json(stages)
}


export const CreateCRMLeadStages = async (req: Request, res: Response, next: NextFunction) => {
    const { stage } = req.body as {
        stage: string
    }
    if (!stage) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await Stage.findOne({ stage: stage.toLowerCase() }))
        return res.status(400).json({ message: "already exists this stage" })
    let result = await new Stage({
        stage: stage,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const UpdateCRMLeadStages = async (req: Request, res: Response, next: NextFunction) => {
    const { stage } = req.body as {
        stage: string
    }
    if (!stage) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldstage = await Stage.findById(id)
    if (!oldstage)
        return res.status(404).json({ message: "stage not found" })
    if (stage !== oldstage.stage)
        if (await Stage.findOne({ stage: stage.toLowerCase() }))
            return res.status(400).json({ message: "already exists this stage" })
    let prevstage = oldstage.stage
    oldstage.stage = stage
    oldstage.updated_at = new Date()
    if (req.user)
        oldstage.updated_by = req.user
    await Lead.updateMany({ stage: prevstage }, { stage: stage })
    await ReferredParty.updateMany({ stage: prevstage }, { stage: stage })
    await oldstage.save()
    return res.status(200).json(oldstage)

}
export const DeleteCRMLeadStage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "stage id not valid" })
    let stage = await Stage.findById(id);
    if (!stage) {
        return res.status(404).json({ message: "stage not found" })
    }
    await stage.remove();
    return res.status(200).json({ message: "lead stage deleted successfully" })
}


//states apis
export const GetAllCRMStates = async (req: Request, res: Response, next: NextFunction) => {
    let result: { state: ICRMState, users: { _id: string, username: string }[] }[] = []
    let states = await CRMState.find()

    for (let i = 0; i < states.length; i++) {
        let users = await (await User.find({ assigned_crm_states: states[i]._id })).map((i) => { return { _id: i._id.valueOf(), username: i.username } })
        result.push({ state: states[i], users: users })
    }
    return res.status(200).json(result)
}


export const CreateCRMState = async (req: Request, res: Response, next: NextFunction) => {
    const { state } = req.body as {
        state: string
    }
    if (!state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (await CRMState.findOne({ state: state.toLowerCase() }))
        return res.status(400).json({ message: "already exists this state" })
    let result = await new CRMState({
        state: state,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(result)

}

export const AssignCRMCitiesToUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { city_ids, user_ids, flag } = req.body as {
        user_ids: string[],
        city_ids: string[],
        flag: number
    }

    if (city_ids && city_ids.length === 0)
        return res.status(400).json({ message: "please select one city " })
    if (user_ids && user_ids.length === 0)
        return res.status(400).json({ message: "please select one city owner" })
    await HandleCRMCitiesAssignment(user_ids, city_ids, flag);
    return res.status(200).json({ message: "successfull" })
}

export const AssignCRMStatesToUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { state_ids, user_ids, flag } = req.body as {
        user_ids: string[],
        state_ids: string[],
        flag: number
    }
    if (state_ids && state_ids.length === 0)
        return res.status(400).json({ message: "please select one state " })
    if (user_ids && user_ids.length === 0)
        return res.status(400).json({ message: "please select one state owner" })

    let owners = user_ids

    if (flag == 0) {
        for (let k = 0; k < owners.length; k++) {
            let owner = await User.findById(owners[k]).populate('assigned_crm_states').populate('assigned_crm_cities');;
            if (owner) {
                let oldstates = owner.assigned_crm_states.map((item) => { return item._id.valueOf() });
                oldstates = oldstates.filter((item) => { return !state_ids.includes(item) });
                let newStates: ICRMState[] = [];

                for (let i = 0; i < oldstates.length; i++) {
                    let state = await CRMState.findById(oldstates[i]);
                    if (state)
                        newStates.push(state)
                }

                let crm_cities = await CRMCity.find({ state: { $in: newStates.map(i => { return i.state }) } })

                await User.findByIdAndUpdate(owner._id, {
                    assigned_crm_states: oldstates,
                    assigned_crm_cities: crm_cities
                })
            }
        }
    }
    else {
        for (let k = 0; k < owners.length; k++) {
            const user = await User.findById(owners[k]).populate('assigned_crm_states').populate('assigned_crm_cities');
            if (user) {
                let assigned_states = user.assigned_crm_states;
                for (let i = 0; i <= state_ids.length; i++) {
                    if (!assigned_states.map(i => { return i._id.valueOf() }).includes(state_ids[i])) {
                        let state = await CRMState.findById(state_ids[i]);
                        if (state)
                            assigned_states.push(state)
                    }
                }

                user.assigned_crm_states = assigned_states
                let cities = await CRMCity.find({ state: { $in: assigned_states.map(i => { return i.state }) } })
                user.assigned_crm_cities = cities;
                await user.save();
            }

        }
    }

    return res.status(200).json({ message: "successfull" })
}


export const UpdateCRMState = async (req: Request, res: Response, next: NextFunction) => {
    const { state } = req.body as {
        state: string
    }
    if (!state) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    const id = req.params.id
    let oldstate = await CRMState.findById(id)
    if (!oldstate)
        return res.status(404).json({ message: "state not found" })
    if (state !== oldstate.state)
        if (await CRMState.findOne({ state: state.toLowerCase() }))
            return res.status(400).json({ message: "already exists this state" })
    let prevstate = oldstate.state
    oldstate.state = state
    oldstate.updated_at = new Date()
    if (req.user)
        oldstate.updated_by = req.user

    await Lead.updateMany({ state: prevstate }, { state: state })
    await ReferredParty.updateMany({ state: prevstate }, { state: state })

    await oldstate.save()
    return res.status(200).json(oldstate)

}
export const DeleteCRMState = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "state id not valid" })
    let state = await CRMState.findById(id);
    if (!state) {
        return res.status(404).json({ message: "state not found" })
    }
    // let remarks = await Remark.find({ lead: lead._id })
    // remarks.map(async (remark) => {
    //     await remark.remove()
    // })
    await state.remove();
    return res.status(200).json({ message: "state deleted successfully" })
}
export const BulkCreateAndUpdateCRMStatesFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: ICRMStateTemplate[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ICRMState[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        console.log(workbook_response.length)
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }

        for (let i = 0; i < workbook_response.length; i++) {
            let item = workbook_response[i]
            let state: string | null = String(item.state)


            if (state) {
                if (item._id && isMongoId(String(item._id))) {
                    await CRMState.findByIdAndUpdate(item._id, { state: state.toLowerCase() })
                    statusText = "updated"
                }

                if (!item._id || !isMongoId(String(item._id))) {
                    let oldstate = await CRMState.findOne({ state: state.toLowerCase() })
                    if (!oldstate) {
                        await new CRMState({
                            state: state,
                            created_by: req.user,
                            updated_by: req.user,
                            created_at: new Date(),
                            updated_at: new Date()
                        }).save()
                        statusText = "created"
                    }
                    else
                        statusText = "duplicate"
                }

            }
            else
                statusText = "required state"

            result.push({
                ...item,
                status: statusText
            })
        }


    }
    return res.status(200).json(result);
}

//cities
export const GetAllCRMCities = async (req: Request, res: Response, next: NextFunction) => {
    let result: { city: ICRMCity, users: { _id: string, username: string }[] }[] = []
    let state = req.query.state;
    let cities: ICRMCity[] = []
    if (state && state !== 'Select State')
        cities = await CRMCity.find({ state: state })
    else
        cities = await CRMCity.find()
    for (let i = 0; i < cities.length; i++) {
        let users = await (await User.find({ assigned_crm_cities: cities[i]._id })).map((i) => { return { _id: i._id.valueOf(), username: i.username } })
        result.push({ city: cities[i], users: users })
    }
    return res.status(200).json(result)
}


export const CreateCRMCity = async (req: Request, res: Response, next: NextFunction) => {
    const { state, city } = req.body as {
        state: string,
        city: string
    }
    if (!state || !city) {
        return res.status(400).json({ message: "please provide required fields" })
    }
    let STate = await CRMState.findOne({ state: state })
    if (!STate) {
        return res.status(400).json({ message: "state not exits" })
    }
    if (await CRMCity.findOne({ city: city.toLowerCase(), state: state }))
        return res.status(400).json({ message: "already exists this city" })
    let result = await new CRMCity({
        state: state,
        city: city,
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    let users = await User.find({ assigned_crm_states: STate });
    console.log(users.length)
    await HandleCRMCitiesAssignment(users.map((i) => { return i._id.valueOf() }), [result._id.valueOf()], 1);
    return res.status(201).json(result)

}

export const UpdateCRMCity = async (req: Request, res: Response, next: NextFunction) => {
    const { state, city } = req.body as {
        state: string,
        city: string
    }
    if (!state || !city) {
        return res.status(400).json({ message: "please fill all reqired fields" })
    }
    if (!await CRMState.findOne({ state: state })) {
        return res.status(400).json({ message: "state not exits" })
    }
    const id = req.params.id
    let oldcity = await CRMCity.findById(id)
    if (!oldcity)
        return res.status(404).json({ message: "city not found" })
    if (city !== oldcity.city)
        if (await CRMCity.findOne({ city: city.toLowerCase(), state: state }))
            return res.status(400).json({ message: "already exists this city" })
    let prevcity = oldcity.city
    oldcity.city = city
    oldcity.state = state
    oldcity.updated_at = new Date()
    if (req.user)
        oldcity.updated_by = req.user
    await oldcity.save()
    await Lead.updateMany({ city: prevcity }, { city: city })
    await ReferredParty.updateMany({ city: prevcity }, { city: city })
    return res.status(200).json(oldcity)

}
export const DeleteCRMCity = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "city id not valid" })
    let city = await CRMCity.findById(id);
    if (!city) {
        return res.status(404).json({ message: "city not found" })
    }

    let STate = await CRMState.findOne({ state: city.state });
    if (STate) {
        let users = await User.find({ assigned_crm_states: STate });
        console.log(users.length)
        await HandleCRMCitiesAssignment(users.map((i) => { return i._id.valueOf() }), [city._id.valueOf()], 1);
    }
    await city.remove();
    return res.status(200).json({ message: "city deleted successfully" })
}
export const BulkCreateAndUpdateCRMCityFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let state = req.params.state
    let result: ICRMCityTemplate[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (state && req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ICRMCityTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (!state || !await CRMState.findOne({ state: state }))
            return res.status(400).json({ message: "provide a state first" })
        console.log(workbook_response.length)
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }

        for (let i = 0; i < workbook_response.length; i++) {
            let item = workbook_response[i]
            let city: string | null = String(item.city)


            if (city) {
                if (item._id && isMongoId(String(item._id))) {
                    let oldcity = await CRMCity.findById(item._id)
                    if (oldcity) {
                        if (city !== oldcity.city)
                            if (!await CRMCity.findOne({ city: city.toLowerCase(), state: state })) {
                                oldcity.city = city
                                oldcity.state = state
                                oldcity.updated_at = new Date()
                                if (req.user)
                                    oldcity.updated_by = req.user
                                await oldcity.save()
                                statusText = "updated"

                            }
                    }
                }

                if (!item._id || !isMongoId(String(item._id))) {
                    let oldcity = await CRMCity.findOne({ city: city.toLowerCase(), state: state })
                    if (!oldcity) {
                        await new CRMCity({
                            city: city,
                            state: state,
                            created_by: req.user,
                            updated_by: req.user,
                            created_at: new Date(),
                            updated_at: new Date()
                        }).save()
                        statusText = "created"
                    }
                    else
                        statusText = "duplicate"
                }

            }
            else
                statusText = "required city"

            result.push({
                ...item,
                status: statusText
            })
        }


    }
    return res.status(200).json(result);
}

export const AssignedReferrals = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let party = await ReferredParty.findById(id)

    if (!party)
        return res.status(404).json({ message: "party not found" })
    let leads: ILead[]
    leads = await Lead.find({ referred_party: party._id }).populate('updated_by').populate('created_by').populate({
        path: 'remarks',
        populate: [
            {
                path: 'created_by',
                model: 'User'
            },
            {
                path: 'updated_by',
                model: 'User'
            }
        ]
    }).sort('-updated_at')
    return res.status(200).json(leads);
}

// leads apis
export const GetLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let stage = req.query.stage
    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let showonlycardleads = Boolean(user?.show_only_visiting_card_leads)

    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        let leads: ILead[] = []
        let count = 0
        if (stage != "undefined") {
            leads = await Lead.find({
                stage: stage, state: { $in: states }, city: { $in: cities }
            }).populate('updated_by').populate('created_by').populate({
                path: 'remarks'
            }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({
                stage: stage, state: { $in: states }, city: { $in: cities }
            }).countDocuments()
        }
        else if (showonlycardleads) {
            leads = await Lead.find({
                has_card: showonlycardleads, state: { $in: states }, city: { $in: cities }
            }).populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({
                has_card: showonlycardleads, state: { $in: states }, city: { $in: cities }
            }).countDocuments()
        }
        else {
            leads = await Lead.find({
                stage: 'open', state: { $in: states }, city: { $in: cities }
            }).populate('updated_by').populate('created_by').populate({
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
            count = await Lead.find({
                stage: 'open', state: { $in: states }, city: { $in: cities }
            }).countDocuments()
        }

        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}
export const ReferLead = async (req: Request, res: Response, next: NextFunction) => {
    const { party_id, remark } = req.body as { party_id: string, remark: string }
    if (!party_id)
        return res.status(400).json({ message: "fill required field" })
    const id = req.params.id
    if (!isMongoId(id) || !isMongoId(party_id))
        return res.status(400).json({ message: "bad mongo id" })
    let lead = await Lead.findById(id)
    if (!lead)
        return res.status(404).json({ message: "lead not found" })
    let party = await ReferredParty.findById(party_id)
    if (!party)
        return res.status(404).json({ message: "referred party not found" })

    if (remark) {
        let remarks = lead.remarks
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        remarks.push(new_remark)
        lead.remarks = remarks
    }

    lead.referred_party = party
    lead.stage = "refer"
    lead.referred_party_mobile = party.mobile
    lead.referred_party_name = party.name
    lead.referred_date = new Date()
    await lead.save()
    return res.status(200).json({ message: "party referred successfully" })
}

export const RemoveLeadReferral = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const { remark } = req.body as { remark: string }
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let lead = await Lead.findById(id)
    if (!lead)
        return res.status(404).json({ message: "lead not found" })
    if (remark) {
        let remarks = lead.remarks
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        remarks.push(new_remark)
        lead.remarks = remarks
    }
    lead.referred_party = undefined
    lead.referred_party_mobile = undefined
    lead.referred_party_name = undefined
    lead.referred_date = undefined
    lead.stage = "open"
    await lead.save()
    return res.status(200).json({ message: "referrals removed successfully" })
}


export const ConvertLeadToRefer = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }

    let resultParty = await ReferredParty.findOne({ mobile: lead.mobile });
    if (resultParty) {
        return res.status(400).json({ message: "already exists this mobile number in refers" })
    }

    await new ReferredParty({
        name: lead.name, customer_name: lead.customer_name, city: lead.city, state: lead.state, mobile: lead.mobile, gst: "erertyujhtyuiop",
        convertedfromlead: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save();

    await Remark.deleteMany({ lead: lead._id });
    await Lead.findByIdAndDelete(lead._id);
    return res.status(200).json({ message: "new refer created" })
}


export const FuzzySearchLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)

    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let showonlycardleads = Boolean(user?.show_only_visiting_card_leads)
    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    let key = String(req.query.key).split(",")
    let stage = req.query.stage
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let leads: ILead[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {

        if (stage != "undefined") {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { gst: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')
            }
            if (key.length == 2) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },

                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },

                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },

                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
        }
        else if (showonlycardleads) {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    has_card: showonlycardleads, state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 2) {

                leads = await Lead.find({
                    has_card: showonlycardleads, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    has_card: showonlycardleads, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    has_card: showonlycardleads, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
        }
        else {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 2) {

                leads = await Lead.find({
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }

        }

        let count = leads.length
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })

}

export const FuzzySearchOkOnlyLeads = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)

    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let showonlycardleads = Boolean(user?.show_only_visiting_card_leads)
    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    let key = String(req.query.key).split(",")
    let stage = req.query.stage
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let leads: ILead[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {

        if (stage != "undefined") {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { gst: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')
            }
            if (key.length == 2) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },

                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    stage: stage, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { gst: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },

                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },

                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },

                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
        }
        else if (showonlycardleads) {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    has_card: showonlycardleads, stage: { $nin: ['useless'] }, state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 2) {

                leads = await Lead.find({
                    has_card: showonlycardleads, stage: { $nin: ['useless'] }, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    has_card: showonlycardleads, stage: { $nin: ['useless'] }, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    has_card: showonlycardleads, stage: { $nin: ['useless'] }, state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
        }
        else {
            if (key.length == 1 || key.length > 4) {

                leads = await Lead.find({
                    stage: { $nin: ['useless'] }, state: { $in: states }, city: { $in: cities },
                    $or: [
                        { name: { $regex: key[0], $options: 'i' } },
                        { customer_name: { $regex: key[0], $options: 'i' } },
                        { customer_designation: { $regex: key[0], $options: 'i' } },
                        { mobile: { $regex: key[0], $options: 'i' } },
                        { email: { $regex: key[0], $options: 'i' } },
                        { country: { $regex: key[0], $options: 'i' } },
                        { address: { $regex: key[0], $options: 'i' } },
                        { work_description: { $regex: key[0], $options: 'i' } },
                        { turnover: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                        { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                        { alternate_email: { $regex: key[0], $options: 'i' } },
                        { lead_type: { $regex: key[0], $options: 'i' } },
                        { stage: { $regex: key[0], $options: 'i' } },
                        { lead_source: { $regex: key[0], $options: 'i' } },
                        { last_remark: { $regex: key[0], $options: 'i' } },
                        { city: { $regex: key[0], $options: 'i' } },
                        { state: { $regex: key[0], $options: 'i' } },
                    ]

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 2) {

                leads = await Lead.find({
                    stage: { $nin: ['useless'] },
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 3) {

                leads = await Lead.find({
                    stage: { $nin: ['useless'] },
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }
            if (key.length == 4) {

                leads = await Lead.find({
                    stage: { $nin: ['useless'] },
                    state: { $in: states }, city: { $in: cities },
                    $and: [
                        {
                            $or: [
                                { name: { $regex: key[0], $options: 'i' } },
                                { customer_name: { $regex: key[0], $options: 'i' } },
                                { customer_designation: { $regex: key[0], $options: 'i' } },
                                { mobile: { $regex: key[0], $options: 'i' } },
                                { email: { $regex: key[0], $options: 'i' } },
                                { country: { $regex: key[0], $options: 'i' } },
                                { address: { $regex: key[0], $options: 'i' } },
                                { work_description: { $regex: key[0], $options: 'i' } },
                                { turnover: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[0], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[0], $options: 'i' } },
                                { alternate_email: { $regex: key[0], $options: 'i' } },
                                { lead_type: { $regex: key[0], $options: 'i' } },
                                { stage: { $regex: key[0], $options: 'i' } },
                                { lead_source: { $regex: key[0], $options: 'i' } },
                                { last_remark: { $regex: key[0], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[1], $options: 'i' } },
                                { customer_name: { $regex: key[1], $options: 'i' } },
                                { customer_designation: { $regex: key[1], $options: 'i' } },
                                { mobile: { $regex: key[1], $options: 'i' } },
                                { email: { $regex: key[1], $options: 'i' } },
                                { country: { $regex: key[1], $options: 'i' } },
                                { address: { $regex: key[1], $options: 'i' } },
                                { work_description: { $regex: key[1], $options: 'i' } },
                                { turnover: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile1: { $regex: key[1], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[1], $options: 'i' } },
                                { alternate_email: { $regex: key[1], $options: 'i' } },
                                { lead_type: { $regex: key[1], $options: 'i' } },
                                { stage: { $regex: key[1], $options: 'i' } },
                                { lead_source: { $regex: key[1], $options: 'i' } },
                                { last_remark: { $regex: key[1], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[2], $options: 'i' } },
                                { customer_name: { $regex: key[2], $options: 'i' } },
                                { customer_designation: { $regex: key[2], $options: 'i' } },
                                { mobile: { $regex: key[2], $options: 'i' } },
                                { email: { $regex: key[2], $options: 'i' } },
                                { country: { $regex: key[2], $options: 'i' } },
                                { address: { $regex: key[2], $options: 'i' } },
                                { work_description: { $regex: key[2], $options: 'i' } },
                                { turnover: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[2], $options: 'i' } },
                                { alternate_email: { $regex: key[2], $options: 'i' } },
                                { lead_type: { $regex: key[2], $options: 'i' } },
                                { stage: { $regex: key[2], $options: 'i' } },
                                { lead_source: { $regex: key[2], $options: 'i' } },
                                { last_remark: { $regex: key[2], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        },
                        {
                            $or: [
                                { name: { $regex: key[3], $options: 'i' } },
                                { customer_name: { $regex: key[3], $options: 'i' } },
                                { customer_designation: { $regex: key[3], $options: 'i' } },
                                { mobile: { $regex: key[3], $options: 'i' } },
                                { email: { $regex: key[3], $options: 'i' } },
                                { country: { $regex: key[3], $options: 'i' } },
                                { address: { $regex: key[3], $options: 'i' } },
                                { work_description: { $regex: key[3], $options: 'i' } },
                                { turnover: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile3: { $regex: key[3], $options: 'i' } },
                                { alternate_mobile2: { $regex: key[3], $options: 'i' } },
                                { alternate_email: { $regex: key[3], $options: 'i' } },
                                { lead_type: { $regex: key[3], $options: 'i' } },
                                { stage: { $regex: key[3], $options: 'i' } },
                                { lead_source: { $regex: key[3], $options: 'i' } },
                                { last_remark: { $regex: key[3], $options: 'i' } },
                                { city: { $regex: key[0], $options: 'i' } },
                                { state: { $regex: key[0], $options: 'i' } },
                            ]
                        }
                    ]
                    ,

                }
                ).populate('updated_by').populate('created_by').populate({
                    path: 'remarks',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        }
                    ]
                }).sort('-updated_at')

            }

        }

        let count = leads.length
        leads = leads.slice((page - 1) * limit, limit * page)
        return res.status(200).json({
            leads,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })

}


export const BackUpAllLeads = async (req: Request, res: Response, next: NextFunction) => {
    const value = String(req.query.value)
    console.log(value)
    let fileName = "blank.xlsx"
    let leads = await Lead.find().populate('created_by').populate('updated_by')
    if (value === "leads" || value === "mobiles") {
        if (leads.length > 0) {
            if (value === "leads") {
                SaveLeadsToExcel(leads)
                fileName = "leads_backup.xlsx"
            }
            if (value === "mobiles") {
                SaveLeadMobilesToExcel(leads)
                fileName = "lead_mobiles_backup.xlsx"
            }
            return res.download("./file", fileName)
        }
    }

    res.status(200).json({ message: "no leads found" })
}

export const CreateLead = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    let { mobile, remark, alternate_mobile1, alternate_mobile2 } = body as Request['body'] & ILead & { remark: string }

    // validations
    if (!mobile)
        return res.status(400).json({ message: "provide primary mobile number" });

    if (await ReferredParty.findOne({ mobile: mobile }))
        return res.status(400).json({ message: "our refer party exists with this mobile" });
    let uniqueNumbers = []
    if (mobile)
        uniqueNumbers.push(mobile)
    if (alternate_mobile1)
        uniqueNumbers.push(alternate_mobile1)
    if (alternate_mobile2)
        uniqueNumbers.push(alternate_mobile2)

    uniqueNumbers = uniqueNumbers.filter((item, i, ar) => ar.indexOf(item) === i);

    if (uniqueNumbers[0] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[0] }, { alternate_mobile1: uniqueNumbers[0] }, { alternate_mobile2: uniqueNumbers[0] }] }))
        return res.status(400).json({ message: `${mobile} already exists ` })


    if (uniqueNumbers[1] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[1] }, { alternate_mobile1: uniqueNumbers[1] }, { alternate_mobile2: uniqueNumbers[1] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[1]} already exists ` })

    if (uniqueNumbers[2] && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[2] }, { alternate_mobile1: uniqueNumbers[2] }, { alternate_mobile2: uniqueNumbers[2] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[2]} already exists ` })

    let visiting_card: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"];
        const storageLocation = `crm/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            visiting_card = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let lead = new Lead({
        ...body,
        visiting_card: visiting_card,
        mobile: uniqueNumbers[0] || null,
        alternate_mobile1: uniqueNumbers[1] || null,
        alternate_mobile2: uniqueNumbers[2] || null,
        created_by: req.user,
        updated_by: req.user,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
    })
    if (remark) {
        let new_remark = new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        })
        await new_remark.save()
        lead.remarks = [new_remark]
    }

    await lead.save()

    return res.status(200).json("lead created")
}


export const UpdateLead = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    const { mobile, remark, alternate_mobile1, alternate_mobile2 } = body as Request['body'] & ILead & { remark: string }
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    // validations
    if (!mobile)
        return res.status(400).json({ message: "provide primary mobile number" });

    let uniqueNumbers = []
    if (mobile) {
        if (mobile === lead.mobile) {
            uniqueNumbers[0] = lead.mobile
        }
        if (mobile !== lead.mobile) {
            uniqueNumbers[0] = mobile
        }
    }
    if (alternate_mobile1) {
        if (alternate_mobile1 === lead.alternate_mobile1) {
            uniqueNumbers[1] = lead.alternate_mobile1
        }
        if (alternate_mobile1 !== lead.alternate_mobile1) {
            uniqueNumbers[1] = alternate_mobile1
        }
    }
    if (alternate_mobile2) {
        if (alternate_mobile2 === lead.alternate_mobile2) {
            uniqueNumbers[2] = lead.alternate_mobile2
        }
        if (alternate_mobile2 !== lead.alternate_mobile2) {
            uniqueNumbers[2] = alternate_mobile2
        }
    }

    uniqueNumbers = uniqueNumbers.filter((item, i, ar) => ar.indexOf(item) === i);


    if (uniqueNumbers[0] && uniqueNumbers[0] !== lead.mobile && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[0] }, { alternate_mobile1: uniqueNumbers[0] }, { alternate_mobile2: uniqueNumbers[0] }] }))
        return res.status(400).json({ message: `${mobile} already exists ` })


    if (uniqueNumbers[1] && uniqueNumbers[1] !== lead.alternate_mobile1 && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[1] }, { alternate_mobile1: uniqueNumbers[1] }, { alternate_mobile2: uniqueNumbers[1] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[1]} already exists ` })

    if (uniqueNumbers[2] && uniqueNumbers[2] !== lead.alternate_mobile2 && await Lead.findOne({ $or: [{ mobile: uniqueNumbers[2] }, { alternate_mobile1: uniqueNumbers[2] }, { alternate_mobile2: uniqueNumbers[2] }] }))
        return res.status(400).json({ message: `${uniqueNumbers[2]} already exists ` })


    let visiting_card = lead?.visiting_card;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"];
        const storageLocation = `crm/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (lead.visiting_card?._id)
                await destroyFile(lead.visiting_card._id)
            visiting_card = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    if (remark)
        await new Remark({
            remark,
            lead: lead,
            created_at: new Date(),
            created_by: req.user,
            updated_at: new Date(),
            updated_by: req.user
        }).save()

    await Lead.findByIdAndUpdate(lead._id, {
        ...body,
        mobile: uniqueNumbers[0] || null,
        alternate_mobile1: uniqueNumbers[1] || null,
        alternate_mobile2: uniqueNumbers[2] || null,
        visiting_card: visiting_card,
        updated_by: req.user,
        updated_at: new Date(Date.now()),
        remarks: lead.remarks
    })

    return res.status(200).json({ message: "lead updated" })
}


export const DeleteLead = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let lead = await Lead.findById(id);
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }
    let remarks = await Remark.find({ lead: lead._id })
    remarks.map(async (remark) => {
        await remark.remove()
    })
    await lead.remove()
    if (lead.visiting_card && lead.visiting_card._id)
        await destroyFile(lead.visiting_card?._id)

    return res.status(200).json({ message: "lead and related remarks are deleted" })
}

export const BulkLeadUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: ILeadTemplate[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: ILeadTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        let checkednumbers: string[] = []
        for (let i = 0; i < workbook_response.length; i++) {
            let lead = workbook_response[i]
            let new_: IUser[] = []
            let mobile: string | null = lead.mobile
            let stage: string | null = lead.stage
            let leadtype: string | null = lead.lead_type
            let source: string | null = lead.lead_source
            let city: string | null = lead.city
            let state: string | null = lead.state
            let alternate_mobile1: string | null = lead.alternate_mobile1
            let alternate_mobile2: string | null = lead.alternate_mobile2
            let uniqueNumbers: string[] = []
            let validated = true

            //important
            if (!mobile) {
                validated = false
                statusText = "required mobile"
            }

            if (mobile && Number.isNaN(Number(mobile))) {
                validated = false
                statusText = "invalid mobile"
            }
            if (alternate_mobile1 && Number.isNaN(Number(alternate_mobile1))) {
                validated = false
                statusText = "invalid alternate mobile 1"
            }
            if (alternate_mobile2 && Number.isNaN(Number(alternate_mobile2))) {
                validated = false
                statusText = "invalid alternate mobile 2"
            }
            if (alternate_mobile1 && String(alternate_mobile1).length !== 10)
                alternate_mobile1 = null
            if (alternate_mobile2 && String(alternate_mobile2).length !== 10)
                alternate_mobile2 = null

            if (mobile && String(mobile).length !== 10) {
                validated = false
                statusText = "invalid mobile"
            }



            //duplicate mobile checker
            if (lead._id && isMongoId(String(lead._id))) {
                let targetLead = await Lead.findById(lead._id)
                if (targetLead) {
                    if (mobile && mobile === targetLead?.mobile) {
                        uniqueNumbers.push(targetLead?.mobile)
                    }
                    if (alternate_mobile1 && alternate_mobile1 === targetLead?.alternate_mobile1) {
                        uniqueNumbers.push(targetLead?.alternate_mobile1)
                    }
                    if (alternate_mobile2 && alternate_mobile2 === targetLead?.alternate_mobile2) {
                        uniqueNumbers.push(targetLead?.alternate_mobile2)
                    }

                    if (mobile && mobile !== targetLead?.mobile) {
                        let ld = await Lead.findOne({ $or: [{ mobile: mobile }, { alternate_mobile1: mobile }, { alternate_mobile2: mobile }] })
                        if (!ld && !checkednumbers.includes(mobile)) {
                            uniqueNumbers.push(mobile)
                            checkednumbers.push(mobile)
                        }
                    }

                    if (alternate_mobile1 && alternate_mobile1 !== targetLead?.alternate_mobile1) {
                        let ld = await Lead.findOne({ $or: [{ mobile: alternate_mobile1 }, { alternate_mobile1: alternate_mobile1 }, { alternate_mobile2: alternate_mobile1 }] })
                        if (!ld && !checkednumbers.includes(alternate_mobile1)) {
                            uniqueNumbers.push(alternate_mobile1)
                            checkednumbers.push(alternate_mobile1)
                        }
                    }

                    if (alternate_mobile2 && alternate_mobile2 !== targetLead?.alternate_mobile2) {
                        let ld = await Lead.findOne({ $or: [{ mobile: alternate_mobile2 }, { alternate_mobile1: alternate_mobile2 }, { alternate_mobile2: alternate_mobile2 }] })
                        if (!ld && !checkednumbers.includes(alternate_mobile2)) {
                            uniqueNumbers.push(alternate_mobile2)
                            checkednumbers.push(alternate_mobile2)
                        }
                    }
                }
            }

            if (!lead._id || !isMongoId(String(lead._id))) {
                if (mobile) {
                    let ld = await Lead.findOne({ $or: [{ mobile: mobile }, { alternate_mobile1: mobile }, { alternate_mobile2: mobile }] })
                    if (ld) {
                        validated = false
                        statusText = "duplicate"
                    }
                    if (!ld) {
                        uniqueNumbers.push(mobile)
                    }
                }

                if (alternate_mobile1) {
                    let ld = await Lead.findOne({ $or: [{ mobile: alternate_mobile1 }, { alternate_mobile1: alternate_mobile1 }, { alternate_mobile2: alternate_mobile1 }] })
                    if (ld) {
                        validated = false
                        statusText = "duplicate"
                    }
                    if (!ld) {
                        uniqueNumbers.push(alternate_mobile1)
                    }
                }
                if (alternate_mobile2) {
                    let ld = await Lead.findOne({ $or: [{ mobile: alternate_mobile2 }, { alternate_mobile1: alternate_mobile2 }, { alternate_mobile2: alternate_mobile2 }] })
                    if (ld) {
                        validated = false
                        statusText = "duplicate"
                    }
                    if (!ld) {
                        uniqueNumbers.push(alternate_mobile2)
                    }
                }

            }

            if (validated && uniqueNumbers.length > 0) {
                //update and create new nead
                if (lead._id && isMongoId(String(lead._id))) {
                    let targetLead = await Lead.findById(lead._id).populate('remarks')
                    let remark = targetLead?.remarks && targetLead.remarks.length > 0 && targetLead.remarks[targetLead.remarks.length - 1].remark || ""
                    console.log(remark)
                    console.log(lead.remarks)
                    if (targetLead) {
                        if (remark !== lead.remarks) {
                            let new_remarks = targetLead.remarks
                            let new_remark = new Remark({
                                remark: lead.remarks,
                                lead: lead,
                                created_at: new Date(),
                                created_by: req.user,
                                updated_at: new Date(),
                                updated_by: req.user
                            })
                            await new_remark.save()
                            new_remarks.push(new_remark)
                            targetLead.remarks = new_remarks
                        }

                        await Lead.findByIdAndUpdate(lead._id, {
                            ...lead,
                            stage: stage ? stage : "unknown",
                            lead_type: leadtype ? leadtype : "unknown",
                            lead_source: source ? source : "unknown",
                            city: city ? city : "unknown",
                            state: state ? state : "unknown",
                            remarks: targetLead.remarks,
                            mobile: uniqueNumbers[0],
                            alternate_mobile1: uniqueNumbers[1] || null,
                            alternate_mobile2: uniqueNumbers[2] || null,
                            updated_by: req.user,
                            updated_at: new Date(Date.now())
                        })
                    }
                    statusText = "updated"
                }
                if (!lead._id || !isMongoId(String(lead._id))) {
                    let newlead = new Lead({
                        ...lead,
                        _id: new Types.ObjectId(),
                        stage: stage ? stage : "unknown",
                        state: state ? state : "unknown",
                        lead_type: leadtype ? leadtype : "unknown",
                        lead_source: source ? source : "unknown",
                        city: city ? city : "unknown",
                        mobile: uniqueNumbers[0] || null,
                        alternate_mobile1: uniqueNumbers[1] || null,
                        alternate_mobile2: uniqueNumbers[2] || null,
                        created_by: req.user,
                        updated_by: req.user,
                        updated_at: new Date(Date.now()),
                        created_at: new Date(Date.now()),
                        remarks: undefined
                    })
                    if (lead.remarks) {
                        let new_remark = new Remark({
                            remark: lead.remarks,
                            lead: newlead,
                            created_at: new Date(),
                            created_by: req.user,
                            updated_at: new Date(),
                            updated_by: req.user
                        })
                        await new_remark.save()
                        newlead.remarks = [new_remark]
                    }
                    await newlead.save()
                    statusText = "created"
                }
            }

            result.push({
                ...lead,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}


//refer apis
export const GetRefers = async (req: Request, res: Response, next: NextFunction) => {
    let refers: IReferredParty[] = []
    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    refers = await ReferredParty.find({ 'state': { $in: states }, 'city': { $in: cities } }).sort('name')
    return res.status(200).json(refers);
}

export const GetAllReferralsById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let party = await ReferredParty.findById(id)

    if (!party)
        return res.status(404).json({ message: "party not found" })

    let leads: ILead[] = []
    leads = await Lead.find({ referred_party: party._id }).populate('updated_by').populate('created_by').populate({
        path: 'remarks',
        populate: [
            {
                path: 'created_by',
                model: 'User'
            },
            {
                path: 'updated_by',
                model: 'User'
            }
        ]
    }).sort('name')
    return res.status(200).json(leads);
}

export const GetPaginatedRefers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    let parties: IReferredParty[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        parties = await ReferredParty.find({ state: { $in: states }, city: { $in: cities } }).populate('created_by').populate('updated_by').sort('name')
        let count = parties.length
        parties = parties.slice((page - 1) * limit, limit * page)

        return res.status(200).json({
            result: parties,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else return res.status(400).json({ message: 'bad request' })

}


export const FuzzySearchRefers = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let key = String(req.query.key).split(",")
    let user = await User.findById(req.user).populate('assigned_crm_states').populate('assigned_crm_cities');
    let states = user?.assigned_crm_states.map((item) => { return item.state })
    let cities = user?.assigned_crm_cities.map((item) => { return item.city })
    if (!key)
        return res.status(500).json({ message: "bad request" })
    let result: IReferredParty[] = []
    let parties: IReferredParty[] = []
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (key.length == 1 || key.length > 4) {

            parties = await ReferredParty.find({
                state: { $in: states }, city: { $in: cities },
                $or: [
                    { name: { $regex: key[0], $options: 'i' } },
                    { gst: { $regex: key[0], $options: 'i' } },
                    { customer_name: { $regex: key[0], $options: 'i' } },
                    { mobile: { $regex: key[0], $options: 'i' } },
                    { city: { $regex: key[0], $options: 'i' } },
                    { state: { $regex: key[0], $options: 'i' } },
                ]
            }).populate('created_by').populate('updated_by').sort('-updated_at')

        }
        if (key.length == 2) {

            parties = await ReferredParty.find({
                state: { $in: states }, city: { $in: cities },

                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('created_by').populate('updated_by').sort('-updated_at')

        }

        if (key.length == 3) {

            parties = await ReferredParty.find({
                state: { $in: states }, city: { $in: cities },

                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('created_by').populate('updated_by').sort('-updated_at')

        }
        if (key.length == 4) {

            parties = await ReferredParty.find({
                state: { $in: states }, city: { $in: cities },
                $and: [
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    },
                    {
                        $or: [
                            { name: { $regex: key[0], $options: 'i' } },
                            { customer_name: { $regex: key[0], $options: 'i' } },
                            { gst: { $regex: key[0], $options: 'i' } },
                            { mobile: { $regex: key[0], $options: 'i' } },
                            { city: { $regex: key[0], $options: 'i' } },
                            { state: { $regex: key[0], $options: 'i' } },
                        ]
                    }
                ]
                ,

            }
            ).populate('created_by').populate('updated_by').sort('-updated_at')

        }

        let count = parties.length
        parties = parties.slice((page - 1) * limit, limit * page)

        return res.status(200).json({
            result: parties,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }

    else
        return res.status(400).json({ message: "bad request" })

}


export const CreateReferParty = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    const { name, customer_name, city, state, gst, mobile } = body
    if (!name || !city || !state || !mobile || !gst) {
        return res.status(400).json({ message: "please fill all required fields" })
    }

    let resultParty = await ReferredParty.findOne({ $or: [{ gst: String(gst).toLowerCase().trim() }, { mobile: String(mobile).toLowerCase().trim() }] })
    if (resultParty) {
        return res.status(400).json({ message: "already exists  gst or mobile number" })
    }


    let party = await new ReferredParty({
        name, customer_name, city, state, mobile, gst,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json(party)
}

export const UpdateReferParty = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let body = JSON.parse(req.body.body)
    console.log(body)
    const { name, customer_name, city, state, mobile, gst } = body
    console.log(name, city, state, mobile, body.mobile)
    if (!name || !city || !state || !mobile) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let party = await ReferredParty.findById(id)

    if (!party)
        return res.status(404).json({ message: "party not found" })
    if (gst !== party.gst) {
        let resultParty = await ReferredParty.findOne({ gst: gst });
        if (resultParty) {
            return res.status(400).json({ message: "already exists this  gst" })
        }
        if (mobile !== party.mobile) {
            let resultParty = await ReferredParty.findOne({ mobile: mobile });
            if (resultParty) {
                return res.status(400).json({ message: "already exists this  mobile" })
            }
        }
    }
    await ReferredParty.findByIdAndUpdate(id, {
        name, customer_name, city, state, mobile, gst,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })
    return res.status(200).json({ message: "updated" })
}


export const DeleteReferParty = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id))
        return res.status(400).json({ message: "bad mongo id" })
    let party = await ReferredParty.findById(id)
    if (!party)
        return res.status(404).json({ message: "party not found" })
    await ReferredParty.findByIdAndDelete(id)
    return res.status(200).json({ message: "deleted" })
}

export const BulkDeleteUselessLeads = async (req: Request, res: Response, next: NextFunction) => {
    const { leads_ids } = req.body as { leads_ids: string[] }
    for (let i = 0; i <= leads_ids.length; i++) {
        let lead = await Lead.findById(leads_ids[i])
        if (lead && lead.stage == 'useless') {
            let remarks = await Remark.find({ lead: lead._id })
            remarks.map(async (remark) => {
                await remark.remove()
            })
            await lead.remove()
            if (lead.visiting_card && lead.visiting_card._id)
                await destroyFile(lead.visiting_card?._id)
        }
    }
    return res.status(200).json({ message: "lead and related remarks are deleted" })
}

export const BulkReferUpdateFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: IReferTemplate[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: IReferTemplate[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        for (let i = 0; i < workbook_response.length; i++) {
            let refer = workbook_response[i]
            let name: string | null = refer.name
            let mobile: string | null = refer.mobile
            let city: string | null = refer.city
            let state: string | null = refer.state
            let gst: string | null = refer.gst

            let validated = true

            //important
            if (!mobile) {
                validated = false
                statusText = "required mobile"
            }
            if (!name) {
                validated = false
                statusText = "required name"
            }
            if (!city) {
                validated = false
                statusText = "required city"
            }
            if (!state) {
                validated = false
                statusText = "required state"
            }
            if (!gst) {
                validated = false
                statusText = "required gst"
            }
            if (gst && gst.length !== 15) {
                validated = false
                statusText = "invalid gst"
            }
            if (mobile && Number.isNaN(Number(mobile))) {
                validated = false
                statusText = "invalid mobile"
            }


            if (mobile && String(mobile).length !== 10) {
                validated = false
                statusText = "invalid mobile"
            }
            //update and create new nead
            if (validated) {
                if (refer._id && isMongoId(String(refer._id))) {
                    let targetLead = await ReferredParty.findById(refer._id)
                    if (targetLead) {
                        console.log("got it")
                        if (targetLead.mobile != String(mobile).toLowerCase().trim() || targetLead.gst !== String(gst).toLowerCase().trim()) {
                            let refertmp = await ReferredParty.findOne({ mobile: String(mobile).toLowerCase().trim() })
                            let refertmp2 = await ReferredParty.findOne({ gst: String(gst).toLowerCase().trim() })

                            if (refertmp) {
                                validated = false
                                statusText = "exists mobile"
                            }
                            if (refertmp2) {
                                validated = false
                                statusText = "exists  gst"
                            }
                            else {
                                await ReferredParty.findByIdAndUpdate(refer._id, {
                                    ...refer,
                                    city: city ? city : "unknown",
                                    state: state ? state : "unknown",
                                    updated_by: req.user,
                                    updated_at: new Date(Date.now())
                                })
                                statusText = "updated"
                            }
                        }
                    }
                }

                if (!refer._id || !isMongoId(String(refer._id))) {
                    let refertmp = await ReferredParty.findOne({
                        $or: [
                            { mobile: String(mobile).toLowerCase().trim() },
                            { gst: String(gst).toLowerCase().trim() }
                        ]
                    })
                    if (refertmp) {
                        validated = false
                        statusText = "duplicate mobile or gst"
                    }
                    else {
                        let referParty = new ReferredParty({
                            ...refer,
                            _id: new Types.ObjectId(),
                            city: city ? city : "unknown",
                            state: state ? state : "unknown",
                            mobile: refer.mobile,
                            created_by: req.user,
                            updated_by: req.user,
                            updated_at: new Date(Date.now()),
                            created_at: new Date(Date.now()),
                            remarks: undefined
                        })

                        await referParty.save()
                        statusText = "created"
                    }

                }
            }
            result.push({
                ...refer,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}


//remarks apis
export const UpdateRemark = async (req: Request, res: Response, next: NextFunction) => {
    const { remark, remind_date } = req.body as { remark: string, remind_date: string }
    if (!remark) return res.status(403).json({ message: "please fill required fields" })

    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let rremark = await Remark.findById(id)
    if (!rremark) {
        return res.status(404).json({ message: "remark not found" })
    }
    rremark.remark = remark
    if (remind_date)
        rremark.remind_date = new Date(remind_date)
    await rremark.save()
    return res.status(200).json({ message: "remark updated successfully" })
}

export const DeleteRemark = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })
    let rremark = await Remark.findById(id).populate('lead')
    if (!rremark) {
        return res.status(404).json({ message: "remark not found" })
    }
    await rremark.remove()
    return res.status(200).json({ message: " remark deleted successfully" })
}

export const GetReminderRemarks = async (req: Request, res: Response, next: NextFunction) => {
    let previous_date = new Date()
    let day = previous_date.getDate() - 7
    previous_date.setDate(day)

    let leads = await Lead.find({ updated_at: { $lte: new Date(), $gt: previous_date } }).populate('remarks')

    let remarkids: string[] = []

    leads.forEach((lead) => {
        let remark = lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1];
        if (remark && remark.remind_date) {
            remarkids.push(remark._id)
        }
    })
    let reminders = await Remark.find({ _id: { $in: remarkids }, remind_date: { $lte: new Date(), $gt: previous_date }, created_by: req.user?._id }).populate('created_by').populate('updated_by').populate({
        path: 'lead',
        populate: [
            {
                path: 'created_by',
                model: 'User'
            },
            {
                path: 'updated_by',
                model: 'User'
            },
            {
                path: 'referred_party',
                model: 'ReferredParty'
            },
            {
                path: 'remarks',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    }
                ]
            }
        ]
    }).sort('-remind_date')
    return res.status(200).json(reminders)
}

export const GetRemarks = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let stage = req.query.stage
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let remarks: IRemark[] = []
    let count = 0
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let ids = req.user?.assigned_users.map((id) => { return id._id })

    if (!Number.isNaN(limit) && !Number.isNaN(page)) {
        if (req.user?.is_admin && !id) {
            {
                remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 } }).populate('created_by').populate('updated_by').populate({
                    path: 'lead',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        },
                        {
                            path: 'referred_party',
                            model: 'ReferredParty'
                        },
                        {
                            path: 'remarks',
                            populate: [
                                {
                                    path: 'created_by',
                                    model: 'User'
                                },
                                {
                                    path: 'updated_by',
                                    model: 'User'
                                }
                            ]
                        }
                    ]
                }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
                count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 } }).countDocuments()
            }
        }
        else if (ids && ids.length > 0 && !id) {
            {
                remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: ids } }).populate('created_by').populate('updated_by').populate({
                    path: 'lead',
                    populate: [
                        {
                            path: 'created_by',
                            model: 'User'
                        },
                        {
                            path: 'updated_by',
                            model: 'User'
                        },
                        {
                            path: 'referred_party',
                            model: 'ReferredParty'
                        },
                        {
                            path: 'remarks',
                            populate: [
                                {
                                    path: 'created_by',
                                    model: 'User'
                                },
                                {
                                    path: 'updated_by',
                                    model: 'User'
                                }
                            ]
                        }
                    ]
                }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
                count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: { $in: ids } }).countDocuments()
            }
        }
        else if (!id) {
            remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).populate('created_by').populate('updated_by').populate({
                path: 'lead',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    },
                    {
                        path: 'referred_party',
                        model: 'ReferredParty'
                    },
                    {
                        path: 'remarks',
                        populate: [
                            {
                                path: 'created_by',
                                model: 'User'
                            },
                            {
                                path: 'updated_by',
                                model: 'User'
                            }
                        ]
                    }
                ]
            }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
            count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: req.user?._id }).countDocuments()
        }

        else {
            remarks = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).populate('created_by').populate('updated_by').populate({
                path: 'lead',
                populate: [
                    {
                        path: 'created_by',
                        model: 'User'
                    },
                    {
                        path: 'updated_by',
                        model: 'User'
                    },
                    {
                        path: 'remarks',
                        populate: [
                            {
                                path: 'created_by',
                                model: 'User'
                            },
                            {
                                path: 'updated_by',
                                model: 'User'
                            }
                        ]
                    }
                ]
            }).sort('-updated_at').skip((page - 1) * limit).limit(limit)
            count = await Remark.find({ created_at: { $gte: dt1, $lt: dt2 }, created_by: id }).countDocuments()
        }
        if (stage !== 'undefined') {
            remarks = remarks.filter((r) => { return r.lead.stage == stage })
            count = remarks.length;
        }
        return res.status(200).json({
            remarks,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const NewRemark = async (req: Request, res: Response, next: NextFunction) => {
    const { remark, remind_date, has_card, stage } = req.body as {
        remark: string, remind_date: string, stage: string,
        has_card: boolean
    }
    if (!remark) return res.status(403).json({ message: "please fill required fields" })

    const user = await User.findById(req.user?._id)
    if (!user)
        return res.status(403).json({ message: "please login to access this resource" })
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "lead id not valid" })

    let lead = await Lead.findById(id)
    if (!lead) {
        return res.status(404).json({ message: "lead not found" })
    }

    let new_remark = new Remark({
        remark,
        lead: lead,
        created_at: new Date(Date.now()),
        created_by: req.user,
        updated_at: new Date(Date.now()),
        updated_by: req.user
    })
    if (remind_date)
        new_remark.remind_date = new Date(remind_date)
    await new_remark.save()
    let updatedRemarks = lead.remarks
    updatedRemarks.push(new_remark)
    lead.remarks = updatedRemarks
    if (has_card)
        lead.has_card = true
    else
        lead.has_card = false
    lead.stage = stage
    if (req.user) {
        lead.updated_by = req.user
        lead.updated_at = new Date(Date.now())
    }
    await lead.save()
    return res.status(200).json({ message: "new remark added successfully" })
}

export const FindUnknownCrmSates = async (req: Request, res: Response, next: NextFunction) => {
    let states = await CRMState.find({ state: { $ne: "" } });
    let statevalues = states.map(i => { return i.state });
    await Lead.updateMany({ state: { $nin: statevalues } }, { state: 'unknown' });
    await ReferredParty.updateMany({ state: { $nin: statevalues } }, { state: 'unknown' });
    return res.status(200).json({ message: "successfull" })
}
export const FindUnknownCrmStages = async (req: Request, res: Response, next: NextFunction) => {
    let stages = await Stage.find({ stage: { $ne: "" } });
    let stagevalues = stages.map(i => { return i.stage });
    await Lead.updateMany({ stage: { $nin: stagevalues } }, { stage: 'unknown' });
    return res.status(200).json({ message: "successfull" })
}

export const FindUnknownCrmCities = async (req: Request, res: Response, next: NextFunction) => {
    let cities = await CRMCity.find({ city: { $ne: "" } });
    let cityvalues = cities.map(i => { return i.city });

    await CRMCity.updateMany({ city: { $nin: cityvalues } }, { city: 'unknown', state: 'unknown' });
    await Lead.updateMany({ city: { $nin: cityvalues } }, { city: 'unknown', state: 'unknown' });
    await ReferredParty.updateMany({ city: { $nin: cityvalues } }, { city: 'unknown', state: 'unknown' });
    return res.status(200).json({ message: "successfull" })
}

export const GetNewRefers = async (req: Request, res: Response, next: NextFunction) => {

    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))
    let parties: IReferredParty[] = []
    parties = await ReferredParty.find({ created_at: { $gte: dt1, $lt: dt2 }, convertedfromlead: true }).populate('created_by').populate('updated_by').sort('name')
    return res.status(200).json(parties)
}

export const GetAssignedRefers = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let dt1 = new Date(String(start_date))
    let dt2 = new Date(String(end_date))

    let leads = await Lead.find({
        created_at: { $gte: dt1, $lt: dt2 }
    }).populate('updated_by').populate('created_by').populate({
        path: 'remarks',
        populate: [
            {
                path: 'created_by',
                model: 'User'
            },
            {
                path: 'updated_by',
                model: 'User'
            }
        ]
    }).sort('-updated_at')
    leads = leads.filter((r) => {
        if (r.referred_party_name)
            return r
    })
    return res.status(200).json(leads)
}

