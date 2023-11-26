import { Comment, DeleteOutline, Visibility } from '@mui/icons-material'
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
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



type Props = {
    remark: IRemark | undefined
    setRemark: React.Dispatch<React.SetStateAction<IRemark | undefined>>,
    remarks: IRemark[]
}

function RemarksTable({ remark, remarks, setRemark }: Props) {
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
                <Table
                    stickyHeader
                    sx={{ width: "5400px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>

                            {/* actions popup */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>


                            {/* visitin card */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Visiting Card
                                </Stack>
                            </TableCell>


                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Lead Name
                                </Stack>
                            </TableCell>




                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Stage
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </TableCell>

                            {/* alternate mobile 1 */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile2
                                </Stack>
                            </TableCell>

                            {/* alternate mobile 2 */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile3
                                </Stack>
                            </TableCell>


                            {/* city */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    City
                                </Stack>
                            </TableCell>

                            {/* state */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    State
                                </Stack>
                            </TableCell>

                            {/* remark type */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Type
                                </Stack>
                            </TableCell>

                            {/* remark owners */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Owners
                                </Stack>
                            </TableCell>

                            {/* turn over */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    TurnOver
                                </Stack>
                            </TableCell>

                            {/* work description */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Work Description
                                </Stack>
                            </TableCell>

                            {/* customer name */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Name
                                </Stack>
                            </TableCell>

                            {/* designiaton */}
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Desigination
                                </Stack>
                            </TableCell>

                            {/* last remark */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Last Remark
                                </Stack>
                            </TableCell>


                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Party
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Party Mobile
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Refer Date
                                </Stack>
                            </TableCell>
                            {/* mobile */}


                            {/* email */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Email
                                </Stack>
                            </TableCell>

                            {/* alternate email */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Email2
                                </Stack>
                            </TableCell>

                            {/* address */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Address
                                </Stack>
                            </TableCell>



                            {/* source */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Remark Source
                                </Stack>
                            </TableCell>

                            {/* country */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Country
                                </Stack>
                            </TableCell>

                            {/* created at */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </TableCell>

                            {/* updated at */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </TableCell>

                            {/* created by */}

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {

                            data && data.map((remark, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>

                                        {/* actions popup */}

                                        <TableCell>
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
                                        </TableCell>
                                        {/* visitin card */}
                                        {
                                            <TableCell
                                                title="double click to download"
                                                onDoubleClick={() => {
                                                    if (remark.lead.visiting_card && remark.lead.visiting_card?.public_url) {
                                                        DownloadFile(remark.lead.visiting_card.public_url, remark.lead.visiting_card.filename)
                                                    }
                                                }}>
                                                <img height="50" width="75" src={remark.lead.visiting_card && remark.lead.visiting_card.public_url} alt="visiting card" />
                                            </TableCell>

                                        }

                                        {/* remark name */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.name}</Typography>
                                            </TableCell>

                                        }
                                        {/* stage */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.stage}</Typography>
                                            </TableCell>

                                        }
                                        {
                                            <TableCell>
                                                <Stack>
                                                    <Typography variant="body1"  >{remark.lead.mobile}</Typography>
                                                </Stack>
                                            </TableCell>

                                        }
                                        {/* alternate mobile 1 */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.alternate_mobile1}</Typography>
                                            </TableCell>

                                        }
                                        {/* alternate mobile 2 */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.alternate_mobile2}</Typography>
                                            </TableCell>

                                        }

                                        {/* city */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.city}</Typography>
                                            </TableCell>

                                        }
                                        {/* state */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.state}</Typography>
                                            </TableCell>

                                        }
                                        {/* remark type */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.lead_type}</Typography>
                                            </TableCell>

                                        }
                                        {/* remark owners */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.lead_owners ? remark.lead.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}</Typography>
                                            </TableCell>

                                        }
                                        {/* turn over */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.turnover ? remark.lead.turnover : 'na'}</Typography>
                                            </TableCell>

                                        }
                                        {/* work description */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.work_description ? remark.lead.work_description.slice(0, 50) : ""}</Typography>
                                            </TableCell>

                                        }
                                        {/* customer name */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.customer_name}</Typography>
                                            </TableCell>

                                        }
                                        {/* designiaton */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }}>{remark.lead.customer_designation}</Typography>
                                            </TableCell>

                                        }
                                        {/* last remark */}
                                        {
                                            <TableCell>
                                                {remark.lead.remarks ?
                                                    <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.last_remark && remark.lead.last_remark.slice(0, 50)}
                                                    </Typography> : null
                                                }
                                            </TableCell>

                                        }

                                        <TableCell>
                                            {remark.lead.referred_party_name ?
                                                <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.referred_party_name && remark.lead.referred_party_name}
                                                </Typography> : null
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {remark.lead.referred_party_mobile ?
                                                <Typography sx={{ textTransform: "capitalize" }}> {remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}
                                                </Typography> : null
                                            }
                                        </TableCell>


                                        <TableCell>
                                            {remark.lead.referred_date ?
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.referred_date).toLocaleString()}</Typography> : null
                                            }
                                        </TableCell>


                                        {/* email */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.email}</Typography>
                                            </TableCell>

                                        }
                                        {/* alternate email */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.alternate_email}</Typography>
                                            </TableCell>

                                        }
                                        {/* address */}
                                        {
                                            <TableCell>
                                                <Stack>
                                                    <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.address ? remark.lead.address.slice(0, 50) : "..."}</Typography>
                                                </Stack>
                                            </TableCell>

                                        }


                                        {/* source */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.lead_source}</Typography>

                                            </TableCell>

                                        }
                                        {/* country */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.country}</Typography>

                                            </TableCell>

                                        }
                                        {/* created at */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.created_at).toLocaleString()}</Typography>

                                            </TableCell>

                                        }
                                        {/* updated at */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(remark.lead.updated_at).toLocaleString()}</Typography>

                                            </TableCell>

                                        }
                                        {/* created by */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.created_by.username}</Typography>

                                            </TableCell>

                                        }
                                        {/* updated by */}
                                        {
                                            <TableCell>
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{remark.lead.updated_by.username}</Typography>

                                            </TableCell>

                                        }
                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
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

export default RemarksTable