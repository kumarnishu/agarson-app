import { Box,  Checkbox, FormControlLabel, IconButton,  Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import UpdateReferDialog from '../dialogs/crm/UpdateReferDialog'
import DeleteReferDialog from '../dialogs/crm/DeleteReferDialog'
import {  Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ViewReferralsDialog from '../dialogs/crm/ViewReferralsDialog'
import { UserContext } from '../../contexts/userContext'
import PopUp from '../popup/PopUp'
import { ILead, IReferredParty } from '../../types/crm.types'

type Props = {
    refer: IReferredParty | undefined,
    setRefer: React.Dispatch<React.SetStateAction<IReferredParty | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    refers: {
        party: IReferredParty,
        leads: ILead[]
    }[],
    selectedRefers: {
        party: IReferredParty,
        leads: ILead[]
    }[]
    setSelectedRefers: React.Dispatch<React.SetStateAction<{
        party: IReferredParty,
        leads: ILead[]
    }[]>>,
}
function RefersTable({ refer, selectAll, refers, setSelectAll, setRefer, selectedRefers, setSelectedRefers }: Props) {
    const [data, setData] = useState<{
        party: IReferredParty,
        leads: ILead[]
    }[]>(refers)
    const [leads, setLeads] = useState<ILead[]>([])
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setData(refers)
    }, [refers])


    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '70vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ minWidth: "2000px" }}
                    size="small">
                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox

                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedRefers(refers)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedRefers([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
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
                                    Actions
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
                                    Party Name
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
                                    Customer Name
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
                                    Party Assigned
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
                            data && data.map((refer, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll ?
                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setRefer(refer.party)
                                                            if (e.target.checked) {
                                                                setSelectedRefers([...selectedRefers, refer])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedRefers((refers) => refers.filter((item) => {
                                                                    return item.party._id !== refer.party._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        <TableCell>
                                            <PopUp
                                                element={
                                                    <Stack direction="row">
                                                        <>
                                                            {user?.is_admin &&
                                                                <>
                                                                    <Tooltip title="edit">
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                setRefer(refer.party)
                                                                                setChoice({ type: LeadChoiceActions.update_refer })
                                                                             
                                                                            }}

                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Delete">
                                                                        <IconButton color="primary"
                                                                            onClick={() => {
                                                                                setRefer(refer.party)
                                                                                setChoice({ type: LeadChoiceActions.delete_refer })
                                                                             
                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            }

                                                            <Tooltip title="View Allocated Parties">
                                                                <IconButton color="success"
                                                                    onClick={() => {
                                                                        setLeads(refer.leads)
                                                                        setChoice({ type: LeadChoiceActions.view_referrals })
                                                                     
                                                                    }}
                                                                >
                                                                    <RemoveRedEye />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    </Stack>
                                                }
                                            />

                                        </TableCell>
                                        {/* party name */}
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{refer.party.name}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.customer_name}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.leads && refer.leads.length}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.mobile}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.city}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.state}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {new Date(refer.party.created_at).toLocaleString()}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {new Date(refer.party.updated_at).toLocaleString()}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{refer.party.created_by.username}</Typography>

                                            </Stack>
                                        </TableCell>
                                        <TableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.updated_by.username}</Typography>

                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </Box>
            {
                refer ?
                    <>
                        <UpdateReferDialog refer={refer} />
                        <DeleteReferDialog refer={refer} />
                    </>
                    : null
            }
            {leads && <ViewReferralsDialog leads={leads} />}
        </>
    )
}

export default RefersTable