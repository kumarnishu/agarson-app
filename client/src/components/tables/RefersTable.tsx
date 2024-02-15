import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
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
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


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
                overflow: "auto",
                height: '80vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


                                <Checkbox sx={{ width: 16, height: 16 }}
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
                                    }} />

                            </STableHeadCell>

                            <STableHeadCell
                            >
                                Actions
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Party Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Customer Name

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Party Assigned

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Mobile

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

                                Refer Owners

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
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            data && data.map((refer, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedRefers.length > 0 && selectedRefers.find((t) => t.party._id === refer.party._id) ? "lightgrey" : "white" }}
                                        key={index}
                                    >
                                        {selectAll ?
                                            <STableCell>


                                                <Checkbox sx={{ width: 16, height: 16 }} size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>

                                                <Checkbox sx={{ width: 16, height: 16 }} size="small"
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
                                                            {user?.crm_access_fields.is_editable &&
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

                                                    </Stack>}
                                            />

                                        </STableCell>
                                        {/* party name */}
                                        < STableCell >

                                            {refer.party.name}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.customer_name}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.leads && refer.leads.length}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.mobile}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.city}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.state}


                                        </STableCell>
                                        <STableCell>
                                            {refer.party.lead_owners.map((owner) => { return owner.username }).toString()}
                                        </STableCell>
                                        <STableCell                     >

                                            {new Date(refer.party.created_at).toLocaleString()}


                                        </STableCell>
                                        <STableCell                     >

                                            {new Date(refer.party.updated_at).toLocaleString()}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.created_by.username}


                                        </STableCell>
                                        <STableCell                     >

                                            {refer.party.updated_by.username}


                                        </STableCell>
                                    </STableRow>
                                )
                            })}
                    </STableBody>
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