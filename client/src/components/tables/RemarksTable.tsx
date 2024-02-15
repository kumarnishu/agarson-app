import { Comment, DeleteOutline, Visibility } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import AddTaskIcon from '@mui/icons-material/AddTask';
import { DownloadFile } from '../../utils/DownloadFile'
import PopUp from '../popup/PopUp'
import { IRemark } from '../../types/crm.types'
import ViewRemarksDialog from '../dialogs/crm/ViewRemarksDialog'
import ConvertLeadToCustomerDialog from '../dialogs/crm/ConvertLeadToCustomerDialog'
import ToogleUselessLead from '../dialogs/crm/ToogleUselessLeadDialog'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import NewRemarkDialog from '../dialogs/crm/NewRemarkDialog'



type Props = {
    remark: IRemark | undefined
    setRemark: React.Dispatch<React.SetStateAction<IRemark | undefined>>,
    remarks: IRemark[]
}

function RemarksSTable({ remark, remarks, setRemark }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    const [data, setData] = useState<IRemark[]>(remarks)

    useEffect(() => {
        setData(remarks)
    }, [remarks])
    console.log(remarks)
    return (
        <>
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

                                Actions

                            </STableHeadCell>





                            <STableHeadCell
                            >

                                Last Remark

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Lead Name

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                Stage

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

                                Lead Type

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Lead Owners

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

                                Remark Source

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
                                        <STableCell>
                                            <PopUp
                                                element={
                                                    <Stack direction="row" spacing={1}>
                                                        {!remark.lead.is_customer &&
                                                            <Tooltip title="Convert to Customer">
                                                                <IconButton color="secondary"
                                                                    onClick={() => {

                                                                        setChoice({ type: LeadChoiceActions.convert_customer })
                                                                        setRemark(remark)
                                                                    }}
                                                                >
                                                                    <AddTaskIcon />
                                                                </IconButton>
                                                            </Tooltip>}

                                                        {
                                                            user?.is_admin && remark.lead.stage === "useless" &&
                                                            <Tooltip title="remove from useless">
                                                                <IconButton color="success"
                                                                    onClick={() => {

                                                                        setChoice({ type: LeadChoiceActions.convert_useless })
                                                                        setRemark(remark)
                                                                    }}

                                                                >
                                                                    <DeleteOutline />
                                                                </IconButton>
                                                            </Tooltip>}
                                                        {remark.lead.stage !== "useless" &&
                                                            <Tooltip title="make useless">
                                                                <IconButton color="warning"
                                                                    onClick={() => {

                                                                        setChoice({ type: LeadChoiceActions.convert_useless })
                                                                        setRemark(remark)
                                                                    }}

                                                                >
                                                                    <DeleteOutline />
                                                                </IconButton>
                                                            </Tooltip>}


                                                        <Tooltip title="view remarks">
                                                            <IconButton color="primary"
                                                                onClick={() => {

                                                                    setChoice({ type: LeadChoiceActions.view_remarks })
                                                                    setRemark(remark)


                                                                }}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Add Remark">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => {

                                                                    setChoice({ type: LeadChoiceActions.add_remark })
                                                                    setRemark(remark)

                                                                }}
                                                            >
                                                                <Comment />
                                                            </IconButton>
                                                        </Tooltip>


                                                    </Stack>}
                                            />
                                        </STableCell>
                                        <STableCell title={remark.remark}>
                                            {remark.remark.slice(0, 50)}

                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.name}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.stage}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.alternate_mobile1}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.alternate_mobile2}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.city}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.state}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.lead_type}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.lead_owners ? remark.lead.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.turnover ? remark.lead.turnover : 'na'}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.work_description ? remark.lead.work_description.slice(0, 50) : ""}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.customer_name}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.customer_designation}
                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.referred_party_name && remark.lead.referred_party_name}

                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.referred_date &&
                                                new Date(remark.lead.referred_date).toLocaleString()
                                            }
                                        </STableCell>



                                        <STableCell>
                                            {remark.lead.email}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.alternate_email}
                                        </STableCell>


                                        <STableCell title={remark.lead.address}>
                                            {remark.lead.address ? remark.lead.address.slice(0, 50) : "..."}

                                        </STableCell>





                                        <STableCell>
                                            {remark.lead.lead_source}

                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.country}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(remark.lead.created_at).toLocaleString()}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(remark.lead.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell
                                            title="double click to download"
                                            onDoubleClick={() => {
                                                if (remark.lead.visiting_card && remark.lead.visiting_card?.public_url) {
                                                    DownloadFile(remark.lead.visiting_card.public_url, remark.lead.visiting_card.filename)
                                                }
                                            }}>
                                            <img height="50" width="75" src={remark.lead.visiting_card && remark.lead.visiting_card.public_url} alt="visiting card" />
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                remark ?
                    <>
                        <ViewRemarksDialog lead={remark.lead} />
                        <ConvertLeadToCustomerDialog lead={remark.lead} />
                        <ToogleUselessLead lead={remark.lead} />
                        <NewRemarkDialog lead={remark.lead} />
                    </>
                    : null
            }
        </>
    )
}

export default RemarksSTable