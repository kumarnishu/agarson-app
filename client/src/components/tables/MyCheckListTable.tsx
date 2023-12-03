import { Box, IconButton, Tooltip } from '@mui/material'
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
                overflow: "scroll",
                maxHeight: '73.5vh',
                px: 1
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

                                Checklist Title

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Score

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Check Status

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Person Assigned

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Created At

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
                                                <IconButton color="success"
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
                                            <a href={checklist.sheet_url}>{checklist.title}</a>
                                        </STableCell>
                                        <STableCell>
                                            {checklist.boxes.filter((box) => {
                                                return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date()

                                            }).length - checklist.boxes.filter((box) => {
                                                return box.desired_date && new Date(box.desired_date) <= new Date()
                                            }).length +
                                                checklist.boxes.filter((box) => {
                                                    return box.desired_date && box.actual_date && new Date(box.desired_date) <= new Date() && Boolean(new Date(box.desired_date).getDate() === new Date(box.actual_date).getDate() && new Date(box.desired_date).getMonth() === new Date(box.actual_date).getMonth() && new Date(box.desired_date).getFullYear() === new Date(box.actual_date).getFullYear())
                                                }).length + 1
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