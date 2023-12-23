import { Box, Button, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { AccessReport } from '../../types/access.types'
import { AdsClickOutlined } from '@mui/icons-material'
import ManageAccessControlDialog from '../dialogs/users/ManageAccessControlDialog'
import { IUser } from '../../types/user.types'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'


type Props = {
    setReport: React.Dispatch<React.SetStateAction<AccessReport | undefined>>,
    reports: AccessReport[],
    report: AccessReport | undefined
}

function ReportsTable({ reports }: Props) {
    const [data, setData] = useState<AccessReport[]>(reports)
    const { user: loggedinuser } = useContext(UserContext)
    const [user, setUser] = useState<IUser>()
    const { setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        setData(reports)
    }, [reports])
    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
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

                                Feature

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                User

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Edit

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Hide

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Delete

                            </STableHeadCell>
                            {/* visitin card */}
                        </STableRow>
                    </STableHead>

                    <STableBody>
                        {
                            data.map((dt, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {dt?.reports.map((report, index) => {

                                            return (
                                                <STableRow
                                                    key={index}
                                                >
                                                    <STableCell>
                                                        <Button
                                                            disabled={loggedinuser?.user_access_fields.is_editable}
                                                            onClick={() => {
                                                                setUser(report.user)
                                                                setChoice({ type: UserChoiceActions.control_access })
                                                            }}>
                                                            <AdsClickOutlined />
                                                        </Button>
                                                    </STableCell>

                                                    <STableCell>
                                                        {dt.accessType}
                                                    </STableCell>
                                                    <STableCell>
                                                        {report.user.username}
                                                    </STableCell>

                                                    <STableCell>
                                                        <Typography style={{ color: report.is_editable ? "red" : "green" }}>

                                                            {report.is_editable ? "True" : "False"}
                                                        </Typography>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Typography style={{ color: report.is_hidden ? "green" : "red" }}>
                                                            {report.is_hidden ? "True" : "False"}

                                                        </Typography>
                                                    </STableCell>
                                                    <STableCell>
                                                        <Typography style={{ color: report.is_deletion_allowed ? "red" : "green" }}>
                                                            {report.is_deletion_allowed ? "True" : "False"}
                                                        </Typography>
                                                    </STableCell>
                                                </STableRow>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                )
                            })
                        }

                    </STableBody>
                </STable>
            </Box >
            {user && <ManageAccessControlDialog user={user} />}
        </>

    )
}

export default ReportsTable