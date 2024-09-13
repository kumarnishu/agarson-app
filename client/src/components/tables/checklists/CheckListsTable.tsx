import { Box, Button, IconButton, Stack, TableCell, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { GetChecklistBoxDto, GetChecklistDto } from '../../../dtos/checklist/checklist.dto'
import CreateOrEditCheckListDialog from '../../dialogs/checklists/CreateOrEditCheckListDialog'
import DeleteCheckListDialog from '../../dialogs/checklists/DeleteCheckListDialog'
import ToogleMyCheckListDialog from '../../forms/checklists/ToogleMyCheckListDialog'


type Props = {
    checklist: GetChecklistDto | undefined
    setChecklist: React.Dispatch<React.SetStateAction<GetChecklistDto | undefined>>,
    checklists: GetChecklistDto[]
}



function CheckListsTable({ checklists }: Props) {
    const [data, setData] = useState<GetChecklistDto[]>(checklists)
    const [checklist, setChecklist] = useState<GetChecklistDto>();
    const { choice, setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    const [checklistBox, setChecklistBox] = useState<GetChecklistBoxDto>()
    useEffect(() => {
        setData(checklists)
    }, [checklists])
    return (
        <>

            <Box sx={{
                overflow: "auto",
                height: '62vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            {user?.assigned_permissions.includes('checklist_edit') && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}
                            <STableHeadCell
                            >

                                Checklists Dates

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Work Title

                            </STableHeadCell>



                            <STableHeadCell>
                                Detail 1
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Detail 2

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Person

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

                                        {user?.assigned_permissions.includes('checklist_edit') && <TableCell style={{ padding: '0px' }}>

                                            <Stack direction="row" gap={1} px={1}>
                                                {user?.assigned_permissions.includes('checklist_delete') && <Tooltip title="view checklists">
                                                    <IconButton size="small" color="error"

                                                        onClick={() => {

                                                            setChoice({ type: CheckListChoiceActions.delete_checklist })
                                                            setChecklist(checklist)


                                                        }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>}
                                                {user?.assigned_permissions.includes('checklist_edit') && <Tooltip title="Edit Checklist">
                                                    <IconButton size="small"

                                                        color="success"
                                                        onClick={() => {

                                                            setChoice({ type: CheckListChoiceActions.create_or_edit_checklist })
                                                            setChecklist(checklist)

                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>}
                                            </Stack>
                                        </TableCell>}
                                        <STableCell>
                                            {checklist.boxes.map((b) => {
                                                return <Tooltip title={b.remarks}>
                                                    <Button sx={{ borderRadius: 5, minWidth: '10px', m: 0.3, pl: 0.3 }} onClick={() => {
                                                        if (b) {
                                                            setChecklistBox(b)
                                                            setChoice({ type: CheckListChoiceActions.toogle_checklist })
                                                        }

                                                    }} size="small" disabled={new Date(b.date).getDate() > new Date().getDate()} variant={'contained'} color={b.checked ? 'success' : 'error'}>


                                                        {new Date(b.date).getDate().toString()}
                                                    </Button>
                                                </Tooltip>
                                            })}
                                        </STableCell>
                                        <STableCell title={checklist.work_title}>
                                            {checklist.work_title.slice(0, 50)}

                                        </STableCell>



                                        <STableCell title={checklist.details1}>
                                            {checklist.details1.slice(0, 50)}

                                        </STableCell>
                                        <STableCell title={checklist.details2}>
                                            {checklist.details2.slice(0, 50)}

                                        </STableCell>
                                        <STableCell >
                                            {checklist.frequency}

                                        </STableCell>
                                        <STableCell>
                                            {checklist.user.label}
                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {checklist && <DeleteCheckListDialog checklist={checklist} />}
            {checklist && <CreateOrEditCheckListDialog checklist={checklist} />}
            {choice === CheckListChoiceActions.toogle_checklist && checklistBox && <ToogleMyCheckListDialog box={checklistBox} />}
        </>
    )
}

export default CheckListsTable