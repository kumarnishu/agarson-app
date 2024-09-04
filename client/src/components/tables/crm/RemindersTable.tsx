import { Box, IconButton, Stack, TableCell, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { DownloadFile } from '../../../utils/DownloadFile'
import ViewRemarksDialog from '../../dialogs/crm/ViewRemarksDialog'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import { Comment, Visibility } from '@mui/icons-material'
import CreateOrEditRemarkDialog from '../../dialogs/crm/CreateOrEditRemarkDialog'
import { UserContext } from '../../../contexts/userContext'
import { GetActivitiesOrRemindersDto } from '../../../dtos/crm/crm.dto'




type Props = {
    remark: GetActivitiesOrRemindersDto | undefined
    setRemark: React.Dispatch<React.SetStateAction<GetActivitiesOrRemindersDto | undefined>>,
    remarks: GetActivitiesOrRemindersDto[]
}

function RemindersTable({ remarks }: Props) {
    const [data, setData] = useState<GetActivitiesOrRemindersDto[]>(remarks)
    const [lead, setLead] = useState<GetActivitiesOrRemindersDto>();
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setData(remarks)
    }, [remarks])
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '65vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Last Remark

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Creator

                            </STableHeadCell>
                            <STableHeadCell>
                                TimeStamp
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Stage

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Next Call

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

                                Gst

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

                                Country

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Visiting Card

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((remark, index) => {
                                return (
                                    <STableRow

                                        key={index}
                                    >

                                        <TableCell style={{ padding: '0px' }}>

                                            <Stack direction="row" gap={1} px={1}>
                                                {user?.assigned_permissions.includes('reminders_view') && <Tooltip title="view remarks">
                                                    <IconButton size="small" color="primary"

                                                        onClick={() => {

                                                            setChoice({ type: LeadChoiceActions.view_remarks })
                                                            setLead(remark)


                                                        }}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>}
                                                {user?.assigned_permissions.includes('reminders_create') && <Tooltip title="Add Remark">
                                                    <IconButton size="small"

                                                        color="success"
                                                        onClick={() => {

                                                            setChoice({ type: LeadChoiceActions.create_or_edt_remark })
                                                            setLead(remark)

                                                        }}
                                                    >
                                                        <Comment />
                                                    </IconButton>
                                                </Tooltip>}
                                            </Stack>
                                        </TableCell>
                                        <STableCell title={remark.remark}>
                                            {remark.remark.slice(0, 50)}

                                        </STableCell>
                                        <STableCell title={remark.created_by.label}>
                                            {remark.created_by.value.slice(0, 50)}

                                        </STableCell>
                                        <STableCell title={remark.created_at}>
                                            {remark.created_at}

                                        </STableCell>
                                        <STableCell>
                                            {remark && remark.stage && remark.stage}
                                        </STableCell>
                                        <STableCell>
                                            {remark.remind_date || "na"}
                                        </STableCell>
                                        <STableCell>
                                            {remark && remark.has_card ? 'Visiting card available' : "na"}
                                        </STableCell>
                                        <STableCell>
                                            {remark.name}
                                        </STableCell>
                                        <STableCell>
                                            {remark.mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.alternate_mobile1}
                                        </STableCell>


                                        <STableCell>
                                            {remark.alternate_mobile2}
                                        </STableCell>


                                        <STableCell>
                                            {remark.city}
                                        </STableCell>


                                        <STableCell>
                                            {remark.state}
                                        </STableCell>

                                        <STableCell>
                                            {remark && remark.gst && remark.gst}
                                        </STableCell>

                                        <STableCell>
                                            {remark.lead_type ? remark.lead_type : 'na'}
                                        </STableCell>
                                        <STableCell>
                                            {remark.turnover ? remark.turnover : 'na'}
                                        </STableCell>


                                        <STableCell>
                                            {remark.work_description ? remark.work_description.slice(0, 50) : ""}
                                        </STableCell>


                                        <STableCell>
                                            {remark.customer_name}
                                        </STableCell>


                                        <STableCell>
                                            {remark.customer_designation}
                                        </STableCell>

                                        <STableCell>
                                            {remark.referred_party_name && remark.referred_party_name}

                                        </STableCell>
                                        <STableCell>
                                            {remark.referred_party_mobile && remark.referred_party_mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.referred_date &&
                                                remark.referred_date
                                            }
                                        </STableCell>



                                        <STableCell>
                                            {remark.email}
                                        </STableCell>


                                        <STableCell>
                                            {remark.alternate_email}
                                        </STableCell>


                                        <STableCell title={remark.address}>
                                            {remark.address ? remark.address.slice(0, 50) : "..."}

                                        </STableCell>

                                        <STableCell>
                                            {remark.country}

                                        </STableCell>

                                        <STableCell
                                            title="double click to download"
                                            onDoubleClick={() => {
                                                if (remark.visiting_card && remark.visiting_card) {
                                                    DownloadFile(remark.visiting_card, "visiting card")
                                                }
                                            }}>
                                            <img height="50" width="75" src={remark.visiting_card && remark.visiting_card} alt="visiting card" />
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {lead && <ViewRemarksDialog id={lead.lead_id} />}
            {lead && <CreateOrEditRemarkDialog lead={lead ? {
                _id: lead.lead_id,
                has_card: lead.has_card
            } : undefined} />}
        </>
    )
}

export default RemindersTable