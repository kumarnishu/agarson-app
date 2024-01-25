import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { IChecklist } from '../../types/checklist.types'
import { RemoveRedEye } from '@mui/icons-material'
import { CheckListChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import CheckMyCheckListDialog from '../dialogs/checklists/CheckMyCheckListDialog'



type Props = {
    checklist: IChecklist | undefined
    setChecklist: React.Dispatch<React.SetStateAction<IChecklist | undefined>>,
    checklists: IChecklist[],
    dates: {
        start_date?: string | undefined;
        end_date?: string | undefined;
    } | undefined

}

function MyChecklistTable({ checklist, checklists, setChecklist, dates }: Props) {
    const [data, setData] = useState<IChecklist[]>(checklists)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(checklists)
    }, [checklists])

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

                                Actions

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                No.

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Checklist Title

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Score

                            </STableHeadCell>
                            <STableHeadCell
                            >

                               Checked

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Person Assigned

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Timestamp

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Assigned By

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


                                        <STableCell>
                                            <Tooltip title="View dates boxes">
                                                <IconButton
                                                    onClick={() => {
                                                        setChoice({ type: CheckListChoiceActions.check_my_boxes })
                                                        setChecklist(checklist)
                                                    }}
                                                >
                                                    <RemoveRedEye />
                                                </IconButton>
                                            </Tooltip>
                                        </STableCell>
                                        <STableCell>
                                            {checklist.serial_no || 0}
                                        </STableCell>
                                        <STableCell>
                                            <Button color="error"
                                                onClick={() => {
                                                    window.open(checklist.sheet_url, '_blank')
                                                }}
                                            >
                                                {checklist.title && checklist.title}
                                            </Button>
                                        </STableCell>
                                        <STableCell>
                                            {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()

                                            }).length - checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length +
                                                checklist.boxes.filter((box) => {
                                                    return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date() && Boolean(new Date(box.desired_date).getDate() === new Date(box.actual_date).getDate() && new Date(box.desired_date).getMonth() === new Date(box.actual_date).getMonth() && new Date(box.desired_date).getFullYear() === new Date(box.actual_date).getFullYear())
                                                }).length
                                            }

                                        </STableCell>


                                        <STableCell>
                                            Checked : {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()
                                            }).length}/{checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length}

                                        </STableCell>

                                        <STableCell>
                                            {checklist.owner && checklist.owner.username}

                                        </STableCell>

                                        <STableCell>
                                            {new Date(checklist.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {checklist.created_by && checklist.created_by.username}

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
                    <CheckMyCheckListDialog checklist={checklist} dates={dates} />
                    : null
            }
        </>
    )
}

export default MyChecklistTable