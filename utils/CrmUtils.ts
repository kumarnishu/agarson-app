import { ILead, ILeadTemplate } from "../types"
import { ExportToExcel } from "./ExportToExcel"

export function ExportLeads(leads: ILead[]) {
    let result: ILeadTemplate[] = []
    if (leads) {
        leads && leads.map((lead) => {
            return result.push(

                {
                    _id: lead._id,
                    name: lead.name,
                    customer_name: lead.customer_name,
                    customer_designation: lead.customer_designation,
                    mobile: lead.mobile,
                    email: lead.email,
                    city: lead.city,
                    state: lead.state,
                    country: lead.country,
                    address: lead.address,
                    work_description: lead.work_description,
                    turnover: lead.turnover,
                    alternate_mobile1: lead.alternate_mobile1,
                    alternate_mobile2: lead.alternate_mobile2,
                    alternate_email: lead.alternate_email,
                    lead_type: lead.lead_type,
                    stage: lead.stage,
                    lead_source: lead.lead_source,
                    remarks: lead.last_remark || "",
                    is_customer: lead.is_customer,
                    last_whatsapp_date: lead.last_whatsapp_date,
                    created_at: lead.created_at,
                    created_by_username: lead.created_by.username,
                    updated_at: lead.updated_at,
                    updated_by_username: lead.updated_by.username,
                    lead_owners: lead.lead_owners.map((owner) => {
                        return owner.username + ","
                    }).toString()
                })
        })
        ExportToExcel(result)
    }

}

export function ExportLeadMobiles(leads: ILead[]) {
    let mobiles: {
        mobile: number
    }[] = []

    if (leads) {
        leads && leads.forEach((lead) => {
            if (lead.mobile)
                mobiles.push({ mobile: Number(lead.mobile) })
            if (lead.alternate_mobile1)
                mobiles.push({ mobile: Number(lead.alternate_mobile1) })
            if (lead.alternate_mobile2)
                mobiles.push({ mobile: Number(lead.alternate_mobile2) })
        })
        ExportToExcel(mobiles)
    }
}


