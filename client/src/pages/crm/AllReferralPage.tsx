import { Box, Button, Paper, Stack, Typography } from "@mui/material"
import ExportToExcel from "../../utils/ExportToExcel"
import { useContext, useEffect, useState } from "react"
import AlertBar from '../../components/snacks/AlertBar'
import { ILead, ILeadTemplate } from "../../types/crm.types"
import NewRemarkDialog from "../../components/dialogs/crm/NewRemarkDialog"
import ViewRemarksDialog from "../../components/dialogs/crm/ViewRemarksDialog"
import { ChoiceContext, LeadChoiceActions } from "../../contexts/dialogContext"

function AllReferralPage({ leads }: { leads: ILead[] }) {
  const [selectedData, setSelectedData] = useState<ILeadTemplate[]>([])
  const [selectedlead, setSelectedLead] = useState<ILead>()
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  function handleExcel() {
    try {
      ExportToExcel(selectedData, "referral_leads")
      setSent(true)
      setSelectedLead(undefined)
      setSelectedData([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }
  useEffect(() => {
    let tmpdata: ILeadTemplate[] = []
    tmpdata = leads.map((lead) => {
      return (
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
          remarks: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || "",
          is_customer: lead.is_customer,
          created_at: lead.created_at,
          updated_at: lead.updated_at,
          lead_owners: lead.lead_owners.map((owner) => {
            return owner.username + ","
          }).toString()
        })
    })
    setSelectedData(tmpdata)
  }, [])


  return (
    <>
      {sent && <AlertBar message="File Exported Successfuly" color="success" />}

      <Box>
        <Button fullWidth variant="outlined" color="success"
          onClick={() => {
            handleExcel()
          }}
        >Export To Excel</Button>
        <Box>
          {leads && leads.map((lead, index) => {
            return (
              <>
                <Stack key={index}
                  sx={{ borderRadius: 1 }}
                  direction="column"
                >
                  <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      Lead Name : <b>{lead.name}</b>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      Mobile : <b>{lead.mobile}</b>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      City : <b>{lead.city}</b>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      State : <b>{lead.state}</b>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      Remarks : <b>{lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || ""}</b>
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      Refer Date : <b>{lead.referred_date && new Date(lead.referred_date).toLocaleString()}</b>
                    </Typography>
                    <Button onClick={() => {
                      setSelectedLead(lead)
                      setChoice({ type: LeadChoiceActions.add_remark })
                    }}>Add Remark</Button>
                    <Button onClick={() => {
                      setSelectedLead(lead)
                      setChoice({ type: LeadChoiceActions.view_remarks })
                    }}>View Remarks</Button>
                  </Paper>
                  {selectedlead ?
                    <>
                      <NewRemarkDialog lead={selectedlead} />
                      <ViewRemarksDialog lead={selectedlead} />
                    </> : null
                  }
                </Stack >
              </>
            )
          })}
        </Box >
      </Box >
    </>
  )
}

export default AllReferralPage