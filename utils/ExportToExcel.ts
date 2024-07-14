import { utils, writeFileXLSX } from "xlsx";
import { ILeadTemplate } from "../types/template.type";
import { ILead } from "../models/leads/lead.model";

export function SaveToExcel(data: any[]) {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, `file`);
}
export function SaveLeadsToExcel(leads: ILead[]) {
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
                    gst: lead.gst,
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
                    remarks: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || ""

                })
        })
        SaveToExcel(result)
    }

}

export function SaveLeadMobilesToExcel(leads: ILead[]) {
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
        SaveToExcel(mobiles)
    }
}

