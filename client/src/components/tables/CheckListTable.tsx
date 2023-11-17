import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
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
                minHeight: '43.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "2000px" }}
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
                            </TableCell>

                            {/* actions popup */}
                            {user?.checklists_access_fields.is_editable && <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>}


                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    CheckList Title
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
                                    Person
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
                                    Status
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
                                    Last Date
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

                            data && data.map((checklist, index) => {
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
                                            null}
                                        {!selectAll ?

                                            <TableCell>
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
                                            </TableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.checklists_access_fields.is_editable &&
                                            <TableCell>
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
                                            </TableCell>}


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>
                                                <a href="https://docs.google.com/spreadsheets/u/0/?usp=sheets_alc" target='blank' >
                                                    {checklist.title && checklist.title.slice(0, 50)}
                                                </a>
                                            </Typography>
                                        </TableCell>


                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{checklist.owner.username}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            Checked : {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()
                                            }).length} / {checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length}

                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.boxes.length > 0 && new Date(checklist.boxes[checklist.boxes.length - 1].desired_date).toLocaleString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(checklist.created_at).toLocaleString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{new Date(checklist.updated_at).toLocaleString()}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.created_by.username}</Typography>

                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }} variant="body1">{checklist.updated_by.username}</Typography>

                                        </TableCell>

                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
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