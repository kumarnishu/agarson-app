import { Comment, DeleteOutline, Visibility } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
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
import ToogleUselessLead from '../dialogs/crm/ToogleUselessLead'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



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

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '53.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>

                            {/* actions popup */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </STableHeadCell>


                            {/* visitin card */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visiting Card
                                </Stack>
                            </STableHeadCell>

                            {/* last remark */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Last Remark
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Lead Name
                                </Stack>
                            </STableHeadCell>




                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Stage
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </STableHeadCell>

                            {/* alternate mobile 1 */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile2
                                </Stack>
                            </STableHeadCell>

                            {/* alternate mobile 2 */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile3
                                </Stack>
                            </STableHeadCell>


                            {/* city */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    City
                                </Stack>
                            </STableHeadCell>

                            {/* state */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    State
                                </Stack>
                            </STableHeadCell>

                            {/* remark type */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Type
                                </Stack>
                            </STableHeadCell>

                            {/* remark owners */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Owners
                                </Stack>
                            </STableHeadCell>

                            {/* turn over */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    TurnOver
                                </Stack>
                            </STableHeadCell>

                            {/* work description */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Work Description
                                </Stack>
                            </STableHeadCell>

                            {/* customer name */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Name
                                </Stack>
                            </STableHeadCell>

                            {/* designiaton */}
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Desigination
                                </Stack>
                            </STableHeadCell>




                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Party
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Party Mobile
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Date
                                </Stack>
                            </STableHeadCell>
                            {/* mobile */}


                            {/* email */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Email
                                </Stack>
                            </STableHeadCell>

                            {/* alternate email */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Email2
                                </Stack>
                            </STableHeadCell>

                            {/* address */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Address
                                </Stack>
                            </STableHeadCell>



                            {/* source */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Source
                                </Stack>
                            </STableHeadCell>

                            {/* country */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Country
                                </Stack>
                            </STableHeadCell>

                            {/* created at */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </STableHeadCell>

                            {/* updated at */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
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

                                        {/* actions popup */}

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
                                                    </Stack>
                                                }
                                            />
                                        </STableCell>
                                        {/* visitin card */}
                                        {
                                            <STableCell
                                                title="double click to download"
                                                onDoubleClick={() => {
                                                    if (remark.lead.visiting_card && remark.lead.visiting_card?.public_url) {
                                                        DownloadFile(remark.lead.visiting_card.public_url, remark.lead.visiting_card.filename)
                                                    }
                                                }}>
                                                <img height="50" width="75" src={remark.lead.visiting_card && remark.lead.visiting_card.public_url} alt="visiting card" />
                                            </STableCell>

                                        }
                                        {/* last remark */}
                                        {
                                            <STableCell title={remark.lead.last_remark && remark.lead.last_remark}>
                                                {remark.lead.remarks ?
                                                    <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.last_remark && remark.lead.last_remark.slice(0, 50)}
                                                    </Typography> : null
                                                }
                                            </STableCell>

                                        }
                                        {/* remark name */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.name}</Typography>
                                            </STableCell>

                                        }
                                        {/* stage */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.stage}</Typography>
                                            </STableCell>

                                        }
                                        {
                                            <STableCell>
                                                <Stack>
                                                    <Typography variant="body1"  >{remark.lead.mobile}</Typography>
                                                </Stack>
                                            </STableCell>

                                        }
                                        {/* alternate mobile 1 */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.alternate_mobile1}</Typography>
                                            </STableCell>

                                        }
                                        {/* alternate mobile 2 */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.alternate_mobile2}</Typography>
                                            </STableCell>

                                        }

                                        {/* city */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.city}</Typography>
                                            </STableCell>

                                        }
                                        {/* state */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.state}</Typography>
                                            </STableCell>

                                        }
                                        {/* remark type */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.lead_type}</Typography>
                                            </STableCell>

                                        }
                                        {/* remark owners */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.lead_owners ? remark.lead.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}</Typography>
                                            </STableCell>

                                        }
                                        {/* turn over */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.turnover ? remark.lead.turnover : 'na'}</Typography>
                                            </STableCell>

                                        }
                                        {/* work description */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.work_description ? remark.lead.work_description.slice(0, 50) : ""}</Typography>
                                            </STableCell>

                                        }
                                        {/* customer name */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.customer_name}</Typography>
                                            </STableCell>

                                        }
                                        {/* designiaton */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.customer_designation}</Typography>
                                            </STableCell>

                                        }


                                        <STableCell>
                                            {remark.lead.referred_party_name ?
                                                <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.referred_party_name && remark.lead.referred_party_name}
                                                </Typography> : null
                                            }
                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.referred_party_mobile ?
                                                <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}
                                                </Typography> : null
                                            }
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.referred_date ?
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.referred_date).toLocaleString()}</Typography> : null
                                            }
                                        </STableCell>


                                        {/* email */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.email}</Typography>
                                            </STableCell>

                                        }
                                        {/* alternate email */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.alternate_email}</Typography>
                                            </STableCell>

                                        }
                                        {/* address */}
                                        {
                                            <STableCell title={remark.lead.address}>
                                                <Stack>
                                                    <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.address ? remark.lead.address.slice(0, 50) : "..."}</Typography>
                                                </Stack>
                                            </STableCell>

                                        }


                                        {/* source */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.lead_source}</Typography>

                                            </STableCell>

                                        }
                                        {/* country */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.country}</Typography>

                                            </STableCell>

                                        }
                                        {/* created at */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.created_at).toLocaleString()}</Typography>

                                            </STableCell>

                                        }
                                        {/* updated at */}
                                        {
                                            <STableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.updated_at).toLocaleString()}</Typography>

                                            </STableCell>

                                        }

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
                    </>
                    : null
            }
        </>
    )
}

export default RemarksSTable