import { Accessibility, Assignment, Block, DeviceHubOutlined, Edit, GroupAdd, GroupRemove, Key, RemoveCircle, Restore } from '@mui/icons-material'
import { Avatar, Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { IUser } from '../../types/user.types'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import UpdateUserDialog from '../dialogs/users/UpdateUserDialog'
import ManageAccessControlDialog from '../dialogs/users/ManageAccessControlDialog'
import BlockUserDialog from '../dialogs/users/BlockUserDialog'
import UnBlockUserDialog from '../dialogs/users/UnBlockUserDialog'
import MakeAdminDialog from '../dialogs/users/MakeAdminDialog'
import RemoveAdminDialog from '../dialogs/users/RemoveAdminDialog'
import UpdatePasswordDialog from '../dialogs/users/UpdatePasswordDialog'
import UpdateUsePasswordDialog from '../dialogs/users/UpdateUsePasswordDialog'
import { DownloadFile } from '../../utils/DownloadFile'
import PopUp from '../popup/PopUp'
import ResetMultiLoginDialog from '../dialogs/users/ResetMultiLogin'
import BlockMultiLoginDialog from '../dialogs/users/BlockMultiLoginDialog'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import AssignUsersDialog from '../dialogs/users/AssignUsersDialog'

type Props = {
    user: IUser | undefined,
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    users: IUser[],
    selectedUsers: IUser[]
    setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>,
}

function UsersSTable({ user, selectAll, users, setSelectAll, setUser, selectedUsers, setSelectedUsers }: Props) {
    const [data, setData] = useState<IUser[]>(users)
    const { setChoice } = useContext(ChoiceContext)
    const { user: LoggedInUser } = useContext(UserContext)
    useEffect(() => {
        setData(users)
    }, [users])

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
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedUsers(users)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedUsers([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>
                            {LoggedInUser?.user_access_fields.is_editable &&
                                <STableHeadCell
                                >

                                    Actions

                                </STableHeadCell>}
                            <STableHeadCell
                            >

                                Avatar

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Role

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                User Name

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Multi Device

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Assigned users

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Email

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Mobile

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Last Login

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Updated By

                            </STableHeadCell>


                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            data && data.map((user, index) => {
                                return (
                                    <STableRow
                                        style={{ backgroundColor: selectedUsers.length > 0 && selectedUsers.find((t) => t._id === user._id) ? "lightgrey" : "white" }}
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
                                                        setUser(user)
                                                        if (e.target.checked) {
                                                            setSelectedUsers([...selectedUsers, user])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedUsers((users) => users.filter((item) => {
                                                                return item._id !== user._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }
                                        {LoggedInUser?.user_access_fields.is_editable &&
                                            <STableCell>

                                                <PopUp
                                                    element={
                                                        <Stack direction="row">

                                                            {/* edit icon */}
                                                            {LoggedInUser?._id === user._id ?
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        color="success"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.update_user })
                                                                            setUser(user)
                                                                        }}>
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip> :
                                                                <Tooltip title="edit">
                                                                    <IconButton
                                                                        disabled={user?.created_by._id === user._id}
                                                                        color="success"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.update_user })
                                                                            setUser(user)
                                                                        }}>
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                            {/* assign user */}
                                                            {LoggedInUser?._id === user._id ?
                                                                <Tooltip title="assign users">
                                                                    <IconButton
                                                                        color="success"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.assign_users })
                                                                            setUser(user)
                                                                        }}>
                                                                        <Assignment />
                                                                    </IconButton>
                                                                </Tooltip> :
                                                                <Tooltip title="assign users">
                                                                    <IconButton
                                                                        disabled={user?.created_by._id === user._id}
                                                                        color="success"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.assign_users })
                                                                            setUser(user)
                                                                        }}>
                                                                        <Assignment />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                            {/* admin icon */}
                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                null
                                                                :
                                                                <>
                                                                    {user.is_admin ?
                                                                        < Tooltip title="Remove admin"><IconButton size="medium"
                                                                            disabled={user?.created_by._id === user._id}
                                                                            color="error"
                                                                            onClick={() => {
                                                                                setChoice({ type: UserChoiceActions.remove_admin })
                                                                                setUser(user)

                                                                            }}>
                                                                            <GroupRemove />
                                                                        </IconButton>
                                                                        </Tooltip>
                                                                        :
                                                                        <Tooltip title="make admin"><IconButton size="medium"
                                                                            disabled={user?.created_by._id === user._id}
                                                                            onClick={() => {
                                                                                setChoice({ type: UserChoiceActions.make_admin })
                                                                                setUser(user)

                                                                            }}>
                                                                            <GroupAdd />
                                                                        </IconButton>
                                                                        </Tooltip>}
                                                                </>
                                                            }
                                                            {/* multi login */}

                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                null :
                                                                <>
                                                                    {
                                                                        user.is_multi_login ?
                                                                            <Tooltip title="Block multi login"><IconButton
                                                                                size="medium"
                                                                                color="error"
                                                                                disabled={user?.created_by._id === user._id}
                                                                                onClick={() => {
                                                                                    setChoice({ type: UserChoiceActions.block_multi_login })
                                                                                    setUser(user)

                                                                                }}
                                                                            >
                                                                                <DeviceHubOutlined />
                                                                            </IconButton>
                                                                            </Tooltip> :
                                                                            <Tooltip title="Reset multi login">
                                                                                <IconButton
                                                                                    disabled={user?.created_by._id === user._id}
                                                                                    size="medium"
                                                                                    onClick={() => {
                                                                                        setChoice({ type: UserChoiceActions.reset_multi_login })
                                                                                        setUser(user)

                                                                                    }}
                                                                                >
                                                                                    <Restore />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                    }
                                                                </>
                                                            }
                                                            {/*  block login */}
                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                null :
                                                                <>
                                                                    {user?.is_active ?
                                                                        <Tooltip title="block"><IconButton
                                                                            size="medium"
                                                                            disabled={user?.created_by._id === user._id}
                                                                            onClick={() => {
                                                                                setChoice({ type: UserChoiceActions.block_user })
                                                                                setUser(user)

                                                                            }}
                                                                        >
                                                                            <Block />
                                                                        </IconButton>
                                                                        </Tooltip>
                                                                        :
                                                                        < Tooltip title="unblock">
                                                                            <IconButton
                                                                                color="warning"
                                                                                disabled={user?.created_by._id === user._id}
                                                                                size="medium"
                                                                                onClick={() => {
                                                                                    setChoice({ type: UserChoiceActions.unblock_user })
                                                                                    setUser(user)

                                                                                }}>
                                                                                <RemoveCircle />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    }
                                                                </>
                                                            }

                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                null
                                                                :
                                                                <Tooltip title="Change Password for this user">
                                                                    <IconButton
                                                                        color="warning"
                                                                        disabled={user?.created_by._id === user._id} size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.update_user_password })
                                                                            setUser(user)

                                                                        }}>
                                                                        <Key />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {LoggedInUser?._id === user._id ?
                                                                <Tooltip title="Access Control">
                                                                    <IconButton
                                                                        color="info"
                                                                        size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.control_access })
                                                                            setUser(user)


                                                                        }}>
                                                                        <Accessibility />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                :
                                                                <Tooltip title="Access Control">
                                                                    <IconButton
                                                                        disabled={user._id == user.created_by._id}
                                                                        color="info" size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.control_access })
                                                                            setUser(user)


                                                                        }}>
                                                                        <Accessibility />
                                                                    </IconButton>
                                                                </Tooltip>}
                                                        </Stack>} />

                                            </STableCell>}



                                        <STableCell>
                                            <Avatar
                                                title="double click to download"
                                                sx={{ width: 16, height: 16 }}
                                                onDoubleClick={() => {
                                                    if (user.dp && user.dp?.public_url) {
                                                        DownloadFile(user.dp.public_url, user.dp.filename)
                                                    }
                                                }}

                                                alt="display picture" src={user.dp?.public_url} />
                                        </STableCell>
                                        <STableCell style={{ color: user.is_active ? "" : "red" }}>
                                            {

                                                user.is_active ? "active" : "blocked"

                                            }
                                        </STableCell>
                                        <STableCell>
                                            {
                                                user.is_admin ?
                                                    <>
                                                        {user.created_by._id === user?._id ?
                                                            "owner" : "admin"}
                                                    </>
                                                    :
                                                    <>
                                                        user
                                                    </>
                                            }
                                        </STableCell>


                                        <STableCell>
                                            {user.username}
                                        </STableCell>
                                        <STableCell>

                                            {user.is_multi_login ? "allowed" : "not allowed"}

                                        </STableCell>

                                        <STableCell title={user.assigned_users.map(user => { return user.username }).toString()}>
                                            {user.assigned_users.length || 0}
                                        </STableCell>

                                        <STableCell>
                                            {user.email}

                                        </STableCell>

                                        <STableCell>

                                            {user.mobile}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(user.last_login).toLocaleString()}
                                        </STableCell>

                                        <STableCell>
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </STableCell>

                                        <STableCell>
                                            {user.updated_by.username}

                                        </STableCell>

                                    </STableRow>
                                )
                            })}
                    </STableBody>
                </STable>
            </Box >
            {
                user ?
                    <>
                        <UpdateUserDialog user={user} />
                        <ResetMultiLoginDialog id={user._id} />
                        <BlockMultiLoginDialog id={user._id} />
                        <UpdatePasswordDialog />
                        <ManageAccessControlDialog user={user} />
                        <BlockUserDialog id={user._id} />
                        <UnBlockUserDialog id={user._id} />
                        <MakeAdminDialog id={user._id} />
                        <RemoveAdminDialog id={user._id} />
                        <UpdateUsePasswordDialog user={user} />
                        <AssignUsersDialog user={user} setUser={setUser} />
                    </>
                    : null
            }
        </>
    )
}

export default UsersSTable