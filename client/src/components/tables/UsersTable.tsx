import { Accessibility, Block, BlockOutlined, Edit, GroupAdd, GroupRemove, Key, RemoveCircle, Restore } from '@mui/icons-material'
import { Avatar, Box, Checkbox, FormControlLabel, IconButton,Tooltip, Typography } from '@mui/material'
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
                overflow: "scroll",
                maxHeight: '70vh'
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

                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedUsers(users)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedUsers([])
                                                    setSelectAll(false)
                                                }
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </STableHeadCell>
                            {LoggedInUser?.user_access_fields.is_editable &&
                                <STableHeadCell
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
                                    User Name
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
                                    Multi Device Login
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
                                    Email
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
                                    Mobile
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
                                    Last Updated By
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
                                    Last Login
                                </Stack>
                            </STableHeadCell>

                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {
                            data && data.map((user, index) => {
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
                                            null
                                        }
                                        {!selectAll ?
                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
                                                    <Checkbox size="small"
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
                                                </Stack>
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {/* actions */}
                                        {LoggedInUser?.user_access_fields.is_editable &&
                                            <STableCell>
                                                <div>
                                                    <PopUp
                                                        element={
                                                            <Stack direction="row">

                                                                {/* edit icon */}
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
                                                                </Tooltip>
                                                                {
                                                                    user.is_admin ?
                                                                        <>
                                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                                null
                                                                                :
                                                                                < Tooltip title="Remove admin"><IconButton size="medium"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setChoice({ type: UserChoiceActions.remove_admin })
                                                                                        setUser(user)

                                                                                    }}>
                                                                                    <GroupRemove />
                                                                                </IconButton>
                                                                                </Tooltip>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <Tooltip title="make admin"><IconButton size="medium"
                                                                            onClick={() => {
                                                                                setChoice({ type: UserChoiceActions.make_admin })
                                                                                setUser(user)

                                                                            }}>
                                                                            <GroupAdd />
                                                                        </IconButton>
                                                                        </Tooltip>
                                                                }
                                                                {

                                                                }
                                                                {
                                                                    user.created_by._id !== user._id && <>
                                                                        {
                                                                            user.is_multi_login ?
                                                                                <Tooltip title="Block multi login"><IconButton
                                                                                    size="medium"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setChoice({ type: UserChoiceActions.block_multi_login })
                                                                                        setUser(user)

                                                                                    }}
                                                                                >
                                                                                    <BlockOutlined />
                                                                                </IconButton>
                                                                                </Tooltip> :
                                                                                <Tooltip title="Reset multi login">
                                                                                    <IconButton
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

                                                                {
                                                                    user?.is_active ?
                                                                        <>
                                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                                null
                                                                                :
                                                                                <Tooltip title="block"><IconButton
                                                                                    size="medium"
                                                                                    onClick={() => {
                                                                                        setChoice({ type: UserChoiceActions.block_user })
                                                                                        setUser(user)

                                                                                    }}
                                                                                >
                                                                                    <Block />
                                                                                </IconButton>
                                                                                </Tooltip>
                                                                            }

                                                                        </>
                                                                        :
                                                                        < Tooltip title="unblock">
                                                                            <IconButton
                                                                                color="warning"
                                                                                size="medium"
                                                                                onClick={() => {
                                                                                    setChoice({ type: UserChoiceActions.unblock_user })
                                                                                    setUser(user)

                                                                                }}>
                                                                                <RemoveCircle />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                }
                                                                {
                                                                    LoggedInUser?.is_admin ?
                                                                        <>
                                                                            {LoggedInUser?.created_by._id === user._id ?
                                                                                null
                                                                                :
                                                                                <Tooltip title="Change Password for this user">
                                                                                    <IconButton
                                                                                        color="warning" size="medium"
                                                                                        onClick={() => {
                                                                                            setChoice({ type: UserChoiceActions.update_user_password })
                                                                                            setUser(user)

                                                                                        }}>
                                                                                        <Key />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            }
                                                                        </>
                                                                        :
                                                                        null


                                                                }
                                                                <Tooltip title="Access Control">
                                                                    <IconButton
                                                                        color="info" size="medium"
                                                                        onClick={() => {
                                                                            setChoice({ type: UserChoiceActions.control_access })
                                                                            setUser(user)


                                                                        }}>
                                                                        <Accessibility />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        } />
                                                </div>
                                            </STableCell>}

                                        {/* profiles picture */}
                                        <STableCell>
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                <Stack>
                                                    <Avatar
                                                        title="double click to download"
                                                        sx={{ width: 30, height: 30 }}
                                                        onDoubleClick={() => {
                                                            if (user.dp && user.dp?.public_url) {
                                                                DownloadFile(user.dp.public_url, user.dp.filename)
                                                            }
                                                        }}

                                                        alt="display picture" src={user.dp?.public_url} />
                                                    {
                                                        user.is_active ?
                                                            <Typography variant="caption" sx={{
                                                                color: "green",
                                                            }}>active</Typography>
                                                            : <Typography variant="caption" sx={{
                                                                color: "red",
                                                            }}>blocked</Typography>

                                                    }
                                                </Stack >
                                                <Stack>
                                                    {
                                                        user.is_admin ?
                                                            <>
                                                                <Typography sx={{
                                                                    textTransform: "capitalize", fontWeight: '600'
                                                                }}>{user.username}</Typography>
                                                                <Typography variant="caption" component="span" sx={{ fontWeight: '500' }}>
                                                                    {user.created_by._id === user?._id ?
                                                                        "owner" : "admin"}
                                                                </Typography>
                                                            </>
                                                            :
                                                            <>
                                                                <Typography sx={{ textTransform: "capitalize" }}>{user.username}</Typography>
                                                                <Typography variant="caption" component="span">
                                                                    user
                                                                </Typography>
                                                            </>
                                                    }
                                                </Stack >
                                            </Stack>
                                        </STableCell>
                                        <STableCell>
                                            <Stack direction="row"
                                                spacing={2}
                                                justifyContent="left"
                                                alignItems="center"
                                            >
                                                <Typography>
                                                    {user.is_multi_login ? "allowed" : "not allowed"}
                                                </Typography>
                                            </Stack>
                                        </STableCell>
                                        {/* email */}
                                        <STableCell>
                                            <Stack>
                                                <Typography variant="body1" sx={{}}>{user.email}</Typography>
                                                {
                                                    user.email_verified ? <Typography variant="caption" sx={{
                                                        color: "green"
                                                    }}>verified</Typography >

                                                        :
                                                        <Typography variant="caption" sx={{
                                                            color: "red"
                                                        }}>not verified</Typography >
                                                }

                                            </Stack>
                                        </STableCell>
                                        {/* mobiles */}
                                        <STableCell>
                                            <Stack>
                                                <Typography variant="body1" sx={{}}>{user.mobile}</Typography>                                                {
                                                    user.email_verified ? <Typography variant="caption">{"verified"}</Typography>

                                                        :
                                                        <Typography sx={{ color: "red" }} variant="caption">{"not verified"}</Typography>
                                                }

                                            </Stack>
                                        </STableCell>
                                        {/* created by */}
                                        <STableCell>
                                            <Stack>
                                                <Typography sx={{ textTransform: "capitalize" }}>{user.created_by.username}</Typography>
                                                <Typography variant="caption" component="span">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Stack >
                                        </STableCell>
                                        {/* updated by */}
                                        <STableCell>
                                            <Stack>
                                                <Typography sx={{ textTransform: "capitalize" }}>{user.updated_by.username}</Typography>
                                                <Typography variant="caption" component="span">
                                                    {new Date(user.updated_at).toLocaleDateString()}
                                                </Typography>
                                            </Stack >
                                        </STableCell>
                                        {/* login date */}
                                        <STableCell>
                                            <Typography variant="body1">{new Date(user.last_login).toLocaleString()}</Typography>
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
                    </>
                    : null
            }
        </>
    )
}

export default UsersSTable