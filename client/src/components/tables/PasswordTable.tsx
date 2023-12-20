import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PopUp from '../popup/PopUp'
import { IPassword } from '../../types/password.types'
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material'
import { ChoiceContext, PasswordChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import DeletePasswordDialog from '../dialogs/passwords/DeletePasswordDialog'
import EditPasswordDialog from '../dialogs/passwords/EditPasswordDialog'



type Props = {
    password: IPassword | undefined
    setPassword: React.Dispatch<React.SetStateAction<IPassword | undefined>>,
    passwords: IPassword[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedPasswords: IPassword[]
    setSelectedPasswords: React.Dispatch<React.SetStateAction<IPassword[]>>
}

function PasswordSTable({ password, passwords, setPassword, selectAll, setSelectAll, selectedPasswords, setSelectedPasswords }: Props) {
    const [data, setData] = useState<IPassword[]>(passwords)
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    useEffect(() => {
        setData(passwords)
    }, [passwords])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                maxHeight: '60vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >


                                <Checkbox
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedPasswords(passwords)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedPasswords([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            {/* actions popup */}
                            {user?.passwords_access_fields.is_editable && <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>}


                            <STableHeadCell
                            >

                                State

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Username

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Password

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Persons

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>

                            {/* updated at */}

                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>

                            {/* created by */}

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

                            data && data.map((password, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null}
                                        {!selectAll ?

                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setPassword(password)
                                                        if (e.target.checked) {
                                                            setSelectedPasswords([...selectedPasswords, password])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedPasswords((passwords) => passwords.filter((item) => {
                                                                return item._id !== password._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null/* actions popup */}
                                        {user?.passwords_access_fields.is_editable &&
                                            <STableCell >
                                                <PopUp
                                                    element={
                                                        <Stack direction="row" spacing={1}>
                                                            <>
                                                                {user?.passwords_access_fields.is_editable &&
                                                                    <>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton color="info"
                                                                                onClick={() => {
                                                                                    setChoice({ type: PasswordChoiceActions.update_erp_password })
                                                                                    setPassword(password)
                                                                                }}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="view">
                                                                            <IconButton color="error"
                                                                                onClick={() => {
                                                                                    window.open('http://103.11.85.217:8081/', '_blank')
                                                                                }}
                                                                            >
                                                                                <RemoveRedEye />
                                                                            </IconButton>
                                                                        </Tooltip>

                                                                    </>}
                                                                {user?.passwords_access_fields.is_deletion_allowed && <Tooltip title="Delete">
                                                                    <IconButton color="error"
                                                                        onClick={() => {
                                                                            setChoice({ type: PasswordChoiceActions.delete_password })
                                                                            setPassword(password)
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                            </>

                                                        </Stack>} />
                                            </STableCell>}

                                        <STableCell>
                                            {password.state}

                                        </STableCell>
                                        <STableCell>
                                            {password.username}

                                        </STableCell>
                                        <STableCell>
                                            {password.password}
                                        </STableCell>
                                        <STableCell>
                                            {password.persons && password.persons.map((per) => { return per.username }).toString()}
                                        </STableCell>

                                        <STableCell>
                                            {new Date(password.created_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {new Date(password.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell>
                                            {password.created_by.username}

                                        </STableCell>
                                        <STableCell>
                                            {password.updated_by.username}

                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                password ?
                    <>
                        <DeletePasswordDialog password={password} />
                        <EditPasswordDialog password={password} />
                    </>
                    : null
            }
        </>
    )
}

export default PasswordSTable