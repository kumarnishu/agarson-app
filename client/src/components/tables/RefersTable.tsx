import { Box, Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import UpdateReferDialog from '../dialogs/crm/UpdateReferDialog'
import DeleteReferDialog from '../dialogs/crm/DeleteReferDialog'
import { Delete, Edit, Handshake, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ViewReferralsDialog from '../dialogs/crm/ViewReferralsDialog'
import { UserContext } from '../../contexts/userContext'
import PopUp from '../popup/PopUp'
import { ILead, IReferredParty } from '../../types/crm.types'
import AssignReferDialog from '../dialogs/crm/AssignReferDialog'
import styled from 'styled-components'


const STable = styled.table`
  border-collapse: collapse;
`
const STableRow = styled.tr`
'&:hover': { background-color: 'rgba(0,0,0,0.8)', cursor: 'pointer' }
`
const STableCell = styled.td`
  text-align: left;
  padding:5px;
  display:inlineblock;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const STableHead = styled.th`
  text-align: left;
  padding:8px;
  display:inlineblock;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

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
function RefersSTable({ refer, selectAll, refers, setSelectAll, setRefer, selectedRefers, setSelectedRefers }: Props) {
    const [data, setData] = useState<{
        party: IReferredParty,
        leads: ILead[]
    }[]>(refers)
    const [leads, setLeads] = useState<ILead[]>([])
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    const [display, setDisplay] = useState<boolean>(false)

    useEffect(() => {
        setData(refers)
    }, [refers])


    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '70vh'
            }}>
                <STable
                >
                    <thead
                    >
                        <STableRow>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
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
                            </STableHead>
                            {user?.crm_access_fields.is_editable &&
                                <STableHead
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="left"
                                        alignItems="left"
                                        spacing={2}
                                    >
                                        Actions
                                    </Stack>
                                </STableHead>}
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Party Name
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer Name
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Party Assigned
                                </Stack>
                            </STableHead>

                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    City
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    State
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Lead Owners
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created At
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated At
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
                                </Stack>
                            </STableHead>
                            <STableHead
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Updated By
                                </Stack>
                            </STableHead>
                        </STableRow>
                    </thead>
                    <tbody >
                        {
                            data && data.map((refer, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>
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
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        <STableCell>
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
                                                                    {user?.crm_access_fields.is_deletion_allowed &&
                                                                        <Tooltip title="Delete">
                                                                            <IconButton color="primary"
                                                                                onClick={() => {
                                                                                    setRefer(refer.party)
                                                                                    setChoice({ type: LeadChoiceActions.delete_refer })

                                                                                }}
                                                                            >
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </Tooltip>}
                                                                </>
                                                            }

                                                            <Tooltip title="View Allocated Parties">
                                                                <IconButton color="success"
                                                                    onClick={() => {
                                                                        setLeads(refer.leads)
                                                                        setDisplay(true)

                                                                    }}
                                                                >
                                                                    <RemoveRedEye />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {user?.crm_access_fields.is_editable &&
                                                                < Tooltip title="Assign Refer">
                                                                    <IconButton color="warning"
                                                                        onClick={() => {
                                                                            setRefer(refer.party)
                                                                            setChoice({ type: LeadChoiceActions.assign_refer })
                                                                        }}
                                                                    >
                                                                        <Handshake />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                        </>
                                                    </Stack>
                                                }
                                            />

                                        </STableCell>
                                        {/* party name */}
                                        < STableCell >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{refer.party.name}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.customer_name}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.leads && refer.leads.length}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.mobile}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.city}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.state}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{refer.party.lead_owners ? refer.party.lead_owners.map((owner) => { return owner.username + ", " }) : [""]}</Typography>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {new Date(refer.party.created_at).toLocaleString()}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {new Date(refer.party.updated_at).toLocaleString()}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1">{refer.party.created_by.username}</Typography>

                                            </Stack>
                                        </STableCell>
                                        <STableCell                     >
                                            <Stack
                                                direction="row"
                                                justifyContent="left"
                                                alignItems="left"
                                                spacing={2}
                                            >
                                                <Typography sx={{ textTransform: "capitalize" }} variant="body1"> {refer.party.updated_by.username}</Typography>

                                            </Stack>
                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                    </tbody>
                </STable >
            </Box >
            {
                refer ?
                    <>
                        < UpdateReferDialog refer={refer} />
                        <DeleteReferDialog refer={refer} />
                        <AssignReferDialog refer={refer} />
                    </>
                    : null
            }
            {leads && <ViewReferralsDialog setDisplay={setDisplay} display={display} leads={leads} />}

        </>
    )
}

export default RefersSTable