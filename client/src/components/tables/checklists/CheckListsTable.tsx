import { Box, Button, CircularProgress, IconButton, Stack, TableCell, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { ChoiceContext, CheckListChoiceActions } from '../../../contexts/dialogContext'
import { Delete, Edit } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { GetChecklistBoxDto, GetChecklistDto } from '../../../dtos/checklist/checklist.dto'
import CreateOrEditCheckListDialog from '../../dialogs/checklists/CreateOrEditCheckListDialog'
import DeleteCheckListDialog from '../../dialogs/checklists/DeleteCheckListDialog'
import { useMutation } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { ToogleMyCheckLists } from '../../../services/CheckListServices'
import { queryClient } from '../../../main'
import AlertBar from '../../snacks/AlertBar'




type Props = {
    checklist: GetChecklistDto | undefined
    setChecklist: React.Dispatch<React.SetStateAction<GetChecklistDto | undefined>>,
    checklists: GetChecklistDto[]
}

function CheckBoxComponent({ checklist }: { checklist: GetChecklistBoxDto }) {
    const { mutate, isLoading, isError, error, isSuccess } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleMyCheckLists, {
            onSuccess: () => {
                queryClient.invalidateQueries('checklists')
            }
        })

    return <>
        {
            isError ? (
                <AlertBar message={error?.response.data.message} color="error" />
            ) : null
        }
        {
            isSuccess ? (
                <AlertBar message="Marked Successfully" color="success" />
            ) : null
        }
        <Button sx={{ ml: 2 }} onClick={() => {
            if (checklist)
                mutate(checklist._id)
        }} size="small" disabled={new Date(checklist.date).getDate() > new Date().getDate()} variant={checklist.checked ? 'outlined' : 'contained'} color={checklist.checked ? 'success' : 'error'}>{isLoading ? <CircularProgress /> : new Date(checklist.date).getDate()}</Button>
    </>
}

function CheckListsTable({ checklists }: Props) {
    const [data, setData] = useState<GetChecklistDto[]>(checklists)
    const [checklist, setChecklist] = useState<GetChecklistDto>();
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)

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
                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Work Title

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Frequency

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Person

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Checklists Dates

                            </STableHeadCell>

                            <STableHeadCell>
                                Detail 1
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Detail 2

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

                                        <TableCell style={{ padding: '0px' }}>

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
                                        </TableCell>

                                        <STableCell title={checklist.work_title}>
                                            {checklist.work_title.slice(0, 50)}

                                        </STableCell>
                                        <STableCell >
                                            {checklist.frequency}

                                        </STableCell>
                                        <STableCell>
                                            {checklist.user.label}
                                        </STableCell>
                                        <STableCell>
                                            {checklist.boxes.map((b) => {
                                                return <CheckBoxComponent key={b._id} checklist={b} />
                                            })}
                                        </STableCell>

                                        <STableCell title={checklist.details1}>
                                            {checklist.details1.slice(0, 50)}

                                        </STableCell>
                                        <STableCell title={checklist.details2}>
                                            {checklist.details2.slice(0, 50)}

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
        </>
    )
}

export default CheckListsTable