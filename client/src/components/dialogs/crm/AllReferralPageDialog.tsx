import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { ILead, IReferredParty } from '../../../types/crm.types'
import { ILeadTemplate } from '../../../types/template.type'
import { UserContext } from '../../../contexts/userContext'
import AlertBar from '../../snacks/AlertBar'
import ExportToExcel from '../../../utils/ExportToExcel'
import { Cancel } from '@mui/icons-material'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { DownloadFile } from '../../../utils/DownloadFile'
import { GetAllReferrals } from '../../../services/LeadsServices'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../../..'

function AllReferralPageDialog({ refer }: { refer: IReferredParty }) {
    const [selectedData, setSelectedData] = useState<ILeadTemplate[]>([])
    const { user: LoggedInUser } = useContext(UserContext)
    const [sent, setSent] = useState(false)
    const { choice, setChoice } = useContext(ChoiceContext)
    const [leads, setLeads] = useState<ILead[]>([])

    const { data, isLoading, isSuccess, refetch } = useQuery<AxiosResponse<ILead[]>, BackendError>(["assigned_leads", refer], async () => GetAllReferrals({ refer: refer }))


    function handleExcel() {
        try {
            ExportToExcel(selectedData, "referral_leads")
            setSent(true)
            setSelectedData([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    useEffect(() => {
        refetch()
    }, [refer])

    useEffect(() => {
        if (isSuccess && data) {
            setLeads(data.data)
        }
    }, [isSuccess, data])


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
                    remarks: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || "",
                    created_at: lead.created_at,
                    updated_at: lead.updated_at
                })
        })
        setSelectedData(tmpdata)
    }, [])

    console.log(refer)

    return (
        <Dialog fullScreen
            open={choice === LeadChoiceActions.view_referrals ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            {isLoading && <LinearProgress />}
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                setChoice({ type: LeadChoiceActions.close_lead })
            }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Referrals</DialogTitle>
            <DialogContent>


                {sent && <AlertBar message="File Exported Successfuly" color="success" />}

                <Box>
                    {LoggedInUser?.is_admin && <Button fullWidth variant="outlined" color="success"
                        onClick={() => {
                            handleExcel()
                        }}
                    >Export To Excel</Button>}

                </Box >
                <Box sx={{
                    overflow: "auto",
                    height: '70vh'
                }}>
                    <STable
                    >
                        <STableHead
                        >
                            <STableRow>

                                <STableHeadCell
                                >

                                    Last Remark

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Next Call

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Stage

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Visiting Card Status

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Lead Name

                                </STableHeadCell>






                                <STableHeadCell
                                >

                                    Mobile

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Mobile2

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Mobile3

                                </STableHeadCell>



                                <STableHeadCell
                                >

                                    City

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    State

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    GST

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Lead Type

                                </STableHeadCell>




                                <STableHeadCell
                                >

                                    TurnOver

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Work Description

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Customer Name

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Customer Desigination

                                </STableHeadCell>




                                <STableHeadCell
                                >

                                    Refer Party

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Refer Party Mobile

                                </STableHeadCell>

                                <STableHeadCell
                                >

                                    Refer Date

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Email

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Email2

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Address

                                </STableHeadCell>




                                <STableHeadCell
                                >

                                    lead Source

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Country

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Created At

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Updated At

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Created By

                                </STableHeadCell>


                                <STableHeadCell
                                >

                                    Updated By

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Whatsapp Status

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Last whatsapp

                                </STableHeadCell>
                                <STableHeadCell
                                >

                                    Visiting Card

                                </STableHeadCell>
                            </STableRow>
                        </STableHead>
                        <STableBody >
                            {

                                leads && leads.map((lead, index) => {
                                    return (
                                        <STableRow key={index}>
                                            <STableCell>
                                                {lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark.slice(0, 50) || ""}

                                            </STableCell>
                                            <STableCell>
                                                {lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].created_at && new Date(lead.remarks[lead.remarks.length - 1].created_at).toLocaleDateString() || ""}

                                            </STableCell>
                                            <STableCell>
                                                {lead.stage}
                                            </STableCell>
                                            <STableCell>
                                                {lead.has_card ? "Has visiting card" : "na"}
                                            </STableCell>

                                            <STableCell style={{ fontWeight: lead.visiting_card && lead.visiting_card.public_url && 'bold' }} title={lead.visiting_card && lead.visiting_card.public_url && 'This number has Visitng card Uploaded'}>
                                                {lead.name}
                                            </STableCell>







                                            <STableCell>
                                                {lead.mobile}
                                            </STableCell>


                                            <STableCell>
                                                {lead.alternate_mobile1}
                                            </STableCell>


                                            <STableCell>
                                                {lead.alternate_mobile2}
                                            </STableCell>
                                            <STableCell>
                                                {lead.city}
                                            </STableCell>


                                            <STableCell>
                                                {lead.state}
                                            </STableCell>

                                            <STableCell>

                                                {lead.gst}

                                            </STableCell>
                                            <STableCell>
                                                {lead.lead_type}
                                            </STableCell>

                                            <STableCell>
                                                {lead.turnover ? lead.turnover : 'na'}
                                            </STableCell>


                                            <STableCell>
                                                {lead.work_description ? lead.work_description.slice(0, 50) : ""}
                                            </STableCell>


                                            <STableCell>
                                                {lead.customer_name}
                                            </STableCell>


                                            <STableCell>
                                                {lead.customer_designation}
                                            </STableCell>




                                            <STableCell>
                                                {lead.referred_party_name && lead.referred_party_name}

                                            </STableCell>
                                            <STableCell>

                                                {lead.referred_party_mobile && lead.referred_party_mobile}

                                            </STableCell>


                                            <STableCell>
                                                {lead.referred_date &&
                                                    new Date(lead.referred_date).toLocaleString()}

                                            </STableCell>



                                            <STableCell>
                                                {lead.email}
                                            </STableCell>

                                            <STableCell>
                                                {lead.alternate_email}
                                            </STableCell>



                                            <STableCell >
                                                {lead.address ? lead.address.slice(0, 50) : "..."}

                                            </STableCell>
                                            <STableCell>
                                                {lead.lead_source}

                                            </STableCell>


                                            <STableCell>
                                                {lead.country}

                                            </STableCell>



                                            <STableCell>
                                                {new Date(lead.created_at).toLocaleString()}

                                            </STableCell>


                                            <STableCell>
                                                {new Date(lead.updated_at).toLocaleString()}

                                            </STableCell>


                                            <STableCell>
                                                {lead.created_by.username}
                                            </STableCell>


                                            <STableCell>
                                                {lead.updated_by.username}

                                            </STableCell>
                                            <STableCell>
                                                {lead.is_sent ? "Sent" : "Pending"}
                                            </STableCell>
                                            <STableCell>
                                                {new Date(lead.last_whatsapp).toLocaleString()}
                                            </STableCell>
                                            <STableCell
                                                title="double click to download"
                                                onDoubleClick={() => {
                                                    if (lead.visiting_card && lead.visiting_card?.public_url) {
                                                        DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                                                    }
                                                }}>
                                                {lead.visiting_card && lead.visiting_card.public_url ? < img height="20" width="55" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" /> : "na"}
                                            </STableCell>
                                        </STableRow>
                                    )
                                })

                            }
                        </STableBody>
                    </STable>
                </Box >

            </DialogContent>

        </Dialog>
    )
}

export default AllReferralPageDialog