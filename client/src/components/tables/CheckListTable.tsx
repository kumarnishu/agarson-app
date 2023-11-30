import { Box, Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { IChecklist } from '../../types/checklist.types'
import { Add, Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, CheckListChoiceActions } from '../../contexts/dialogContext'
import EditCheckListDialog from '../dialogs/checklists/EditCheckListDialog'
import DeleteCheckListDialog from '../dialogs/checklists/DeleteCheckListDialog'
import AddCheckBoxesDialog from '../dialogs/checklists/AddCheckBoxesDialog'
import ViewCheckListBoxesDialog from '../dialogs/checklists/ViewCheckListBoxesDialog'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'



type Props = {
    checklist: IChecklist | undefined
    setCheckList: React.Dispatch<React.SetStateAction<IChecklist | undefined>>,
    checklists: IChecklist[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedCheckLists: IChecklist[]
    setSelectedCheckLists: React.Dispatch<React.SetStateAction<IChecklist[]>>,
    dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined
}

function CheckListTable({ checklist, checklists, dates, setCheckList, selectAll, setSelectAll, selectedCheckLists, setSelectedCheckLists }: Props) {
    const [data, setData] = useState<IChecklist[]>(checklists)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setData(checklists)
    }, [checklists])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                minHeight: '53.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
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
                                                    setSelectedCheckLists(checklists)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedCheckLists([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </STableHeadCell>

                            {/* actions popup */}
                            {user?.checklists_access_fields.is_editable && <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </STableHeadCell>}


                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    CheckList Title
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
                                    Person
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
                                    Status
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
                                    Last Date
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

                            {/* created by */}

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Created By
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
                                    Updated By
                                </Stack>
                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((checklist, index) => {
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
                                            null}
                                        {!selectAll ?

                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setCheckList(checklist)
                                                            if (e.target.checked) {
                                                                setSelectedCheckLists([...selectedCheckLists, checklist])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedCheckLists((checklists) => checklists.filter((item) => {
                                                                    return item._id !== checklist._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.checklists_access_fields.is_editable &&
                                            <STableCell>
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            {

                                                                <>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.edit_checklist })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Edit />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Add More">
                                                                        <IconButton color="info"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.add_more_check_boxes })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Add />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Delete">
                                                                        <IconButton color="error"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.delete_checklist })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="View">
                                                                        <IconButton color="success"
                                                                            onClick={() => {
                                                                                setChoice({ type: CheckListChoiceActions.view_checklist_boxes })
                                                                                setCheckList(checklist)
                                                                            }}
                                                                        >
                                                                            <RemoveRedEye />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                </>

                                                            }
                                                        </Stack>
                                                    } />
                                            </STableCell>}


                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize", cursor: 'pointer' }}>
                                                
                                                <a href={checklist.sheet_url} target='blank'>
                                                    {checklist.title && checklist.title.slice(0, 50)}
                                                </a>
                                            </Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{checklist.owner.username}</Typography>
                                        </STableCell>

                                        <STableCell>
                                            Checked : {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()
                                            }).length}/{checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length}

                                        </STableCell>

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.boxes.length > 0 && new Date(checklist.boxes[checklist.boxes.length - 1].desired_date).toLocaleString()}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(checklist.created_at).toLocaleString()}</Typography>

                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(checklist.updated_at).toLocaleString()}</Typography>

                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.created_by.username}</Typography>

                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.updated_by.username}</Typography>

                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                checklist ?
                    <>
                        <EditCheckListDialog checklist={checklist} />
                        <DeleteCheckListDialog checklist={checklist} />
                        <AddCheckBoxesDialog checklist={checklist} />
                        <ViewCheckListBoxesDialog dates={dates} checklist={checklist} />
                    </>
                    : null
            }
        </>
    )
}

export default CheckListTable