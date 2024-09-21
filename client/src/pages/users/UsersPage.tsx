import { Avatar, Fade, IconButton, LinearProgress, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { Assignment, Block, DeviceHubOutlined, Edit, GroupAdd, GroupRemove, Key, KeyOffOutlined, RemoveCircle, RemoveRedEye, Restore } from '@mui/icons-material'
import { GetUserDto } from '../../dtos/users/user.dto'
import { UserContext } from '../../contexts/userContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import { DownloadFile } from '../../utils/DownloadFile'
import { GetUsers } from '../../services/UserServices'
import NewUserDialog from '../../components/dialogs/users/NewUserDialog'
import AssignPermissionsToUsersDialog from '../../components/dialogs/users/AssignPermissionsToUsersDialog'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../../components/popup/PopUp'
import UpdateUserDialog from '../../components/dialogs/users/UpdateUserDialog'
import ResetMultiLoginDialog from '../../components/dialogs/users/ResetMultiLogin'
import BlockMultiLoginDialog from '../../components/dialogs/users/BlockMultiLoginDialog'
import UpdatePasswordDialog from '../../components/dialogs/users/UpdatePasswordDialog'
import BlockUserDialog from '../../components/dialogs/users/BlockUserDialog'
import UnBlockUserDialog from '../../components/dialogs/users/UnBlockUserDialog'
import MakeAdminDialog from '../../components/dialogs/users/MakeAdminDialog'
import RemoveAdminDialog from '../../components/dialogs/users/RemoveAdminDialog'
import UpdateUsePasswordDialog from '../../components/dialogs/users/UpdateUsePasswordDialog'
import ToogleVisitingcardShowDialog from '../../components/dialogs/users/ToogleVisitingcardShowDialog'
import AssignUsersDialog from '../../components/dialogs/users/AssignUsersDialog'
import AssignPermissionsToOneUserDialog from '../../components/dialogs/users/AssignPermissionsToOneUserDialog'
import ExportToExcel from '../../utils/ExportToExcel'

export default function UsersPage() {
    const [hidden, setHidden] = useState('false')
    const [user, setUser] = useState<GetUserDto>()
    const [users, setUsers] = useState<GetUserDto[]>([])
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", hidden], async () => GetUsers({ hidden: hidden, permission: undefined, show_assigned_only: false }))
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const { user: LoggedInUser } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const columns = useMemo<MRT_ColumnDef<GetUserDto>[]>(
        //column definitions...
        () => users && [
            {
                accessorKey: 'actions',
                header: '',
                maxSize: 50,
                Footer: <b></b>,
                Cell: ({ cell }) => <PopUp
                    element={
                        <Stack direction="row">

                            {/* edit icon */}
                            {LoggedInUser?._id === cell.row.original._id ?
                                <Tooltip title="edit">
                                    <IconButton
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.update_user })
                                            setUser(cell.row.original)
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title="edit">
                                    <IconButton
                                        disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.update_user })
                                            setUser(cell.row.original)
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                            {/* assign user */}
                            {LoggedInUser?._id === cell.row.original._id ?
                                <Tooltip title="assign users">
                                    <IconButton
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.assign_users })
                                            setUser(cell.row.original)
                                        }}>
                                        <Assignment />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title="assign users">
                                    <IconButton
                                        disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.assign_users })
                                            setUser(cell.row.original)
                                        }}>
                                        <Assignment />
                                    </IconButton>
                                </Tooltip>}
                            {/* admin icon */}
                            {LoggedInUser?.created_by.id === cell.row.original._id ?
                                null
                                :
                                <>
                                    {cell.row.original.is_admin ?
                                        < Tooltip title="Remove admin"><IconButton size="medium"
                                            disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                            color="error"
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.remove_admin })
                                                setUser(cell.row.original)

                                            }}>
                                            <GroupRemove />
                                        </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="make admin"><IconButton size="medium"
                                            disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.make_admin })
                                                setUser(cell.row.original)

                                            }}>
                                            <GroupAdd />
                                        </IconButton>
                                        </Tooltip>}
                                </>
                            }
                            {/* multi login */}

                            {LoggedInUser?.created_by.id === cell.row.original._id ?
                                null :
                                <>
                                    {
                                        cell.row.original.is_multi_login ?
                                            <Tooltip title="Block multi login"><IconButton
                                                size="medium"
                                                color="error"
                                                disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                                onClick={() => {
                                                    setChoice({ type: UserChoiceActions.block_multi_login })
                                                    setUser(cell.row.original)

                                                }}
                                            >
                                                <DeviceHubOutlined />
                                            </IconButton>
                                            </Tooltip> :
                                            <Tooltip title="Reset multi login">
                                                <IconButton
                                                    disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                                    size="medium"
                                                    onClick={() => {
                                                        setChoice({ type: UserChoiceActions.reset_multi_login })
                                                        setUser(cell.row.original)

                                                    }}
                                                >
                                                    <Restore />
                                                </IconButton>
                                            </Tooltip>
                                    }
                                </>
                            }
                            <Tooltip title="Manage Leads View">
                                <IconButton
                                    color="success"
                                    size="medium"
                                    onClick={() => {
                                        setChoice({ type: UserChoiceActions.toogle_show_visitingcard })
                                        setUser(cell.row.original)

                                    }}
                                >
                                    <RemoveRedEye />
                                </IconButton>
                            </Tooltip>


                            {/*  block login */}
                            {LoggedInUser?.created_by.id === cell.row.original._id ?
                                null :
                                <>
                                    {cell.row.original?.is_active ?
                                        <Tooltip title="block"><IconButton
                                            size="medium"
                                            disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.block_user })
                                                setUser(cell.row.original)

                                            }}
                                        >
                                            <Block />
                                        </IconButton>
                                        </Tooltip>
                                        :
                                        < Tooltip title="unblock">
                                            <IconButton
                                                color="warning"
                                                disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                                size="medium"
                                                onClick={() => {
                                                    setChoice({ type: UserChoiceActions.unblock_user })
                                                    setUser(cell.row.original)

                                                }}>
                                                <RemoveCircle />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </>
                            }

                            {LoggedInUser?.created_by.id === cell.row.original._id ?
                                null
                                :
                                <Tooltip title="Change Password for this user">
                                    <IconButton
                                        disabled={cell.row.original?.created_by.id === cell.row.original._id} size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.update_user_password })
                                            setUser(cell.row.original)

                                        }}>
                                        <Key />
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title="Change Permissions for this user">
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        setChoice({ type: UserChoiceActions.assign_permissions })
                                        setUser(cell.row.original)

                                    }}>
                                    <KeyOffOutlined />
                                </IconButton>
                            </Tooltip>

                        </Stack>} />

            },

            {
                accessorKey: 'dp',
                header: 'DP',
                size: 50,
                Cell: (cell) => <Avatar
                    title="double click to download"
                    sx={{ width: 16, height: 16 }}
                    onDoubleClick={() => {
                        if (cell.row.original.dp && cell.row.original.dp) {
                            DownloadFile(cell.row.original.dp, "profile")
                        }
                    }}

                    alt="display picture" src={cell.row.original && cell.row.original.dp} />
            },
            {
                accessorKey: 'username',
                header: 'Name',
                size: 120,
                filterVariant: 'multi-select',
                filterSelectOptions: data && users.map((i) => { return i.username.toString() }).filter(onlyUnique)
            },
            {
                accessorKey: 'is_admin',
                header: 'Role',
                size: 120,
                filterVariant: 'multi-select',
                Cell: (cell) => <>{cell.row.original.is_admin ? "admin" : "user"}</>,
                filterSelectOptions: data && users.map((i) => {
                    if (i.is_admin) return "admin"
                    return "user"
                }).filter(onlyUnique)
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 120,
                filterVariant: 'multi-select',
                Cell: (cell) => <>{cell.row.original.is_active ? "active" : "blocked"}</>,
                filterSelectOptions: data && users.map((i) => {
                    if (i.is_active) return "active"
                    return "blocked"
                }).filter(onlyUnique)
            },
            {
                accessorKey: 'password',
                header: 'Password',
                size: 120,
                filterVariant: 'multi-select',
                Cell: (cell) => <>{cell.row.original.orginal_password}</>,
                filterSelectOptions: data && users.map((i) => {
                    return i.orginal_password || ""
                }).filter(onlyUnique)
            },
            {
                accessorKey: 'assigned_permissions',
                header: 'Permissions',
                size: 120,
                Cell: (cell) => <>{cell.row.original.assigned_permissions.length || 0}</>
            },
            {
                accessorKey: 'show_only_visiting_card_leads',
                header: 'Leads View',
                size: 120,
                Cell: (cell) => <>{cell.row.original.show_only_visiting_card_leads ? "All Leads" : "Only Having Cards"}</>
            },
            {
                accessorKey: 'is_multi_login',
                header: 'Multi Device',
                size: 120,
                Cell: (cell) => <>{cell.row.original.is_multi_login ? "Allowed" : "Blocked"}</>
            },
            {
                accessorKey: 'assigned_users',
                header: 'Assigned Users',
                size: 120,
                Cell: (cell) => <>{cell.row.original.assigned_users.length || 0}</>
            },
            {
                accessorKey: 'last_login',
                header: 'Last Active',
                size: 120,
                Cell: (cell) => <>{cell.row.original.last_login || ""}</>
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 120,
                Cell: (cell) => <>{cell.row.original.email || ""}</>
            },
            {
                accessorKey: 'mobile',
                header: 'Mobile',
                size: 120,
                Cell: (cell) => <>{cell.row.original.mobile || ""}</>
            }

        ],
        [users],
        //end
    );



    const table = useMaterialReactTable({
        columns,
        data: users, //10,000 rows       
        enableColumnResizing: true,
        enableColumnVirtualization: true, enableStickyFooter: true,
        muiTableFooterRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                fontSize: '14px'
            }
        }),
        muiTableContainerProps: (table) => ({
            sx: { height: table.table.getState().isFullScreen ? 'auto' : '400px' }
        }),
        muiTableHeadRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                border: '1px solid lightgrey;',
                fontSize: '13px'
            },
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                border: '1px solid lightgrey;',
                fontSize: '13px'
            },
        }),
        muiPaginationProps: {
            rowsPerPageOptions: [100, 200, 500, 1000],
            shape: 'rounded',
            variant: 'outlined',
        },
        initialState: {
            density: 'compact', showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 100 }
        },
        enableGrouping: true,
        enableRowSelection: true,
        manualPagination: false,
        enablePagination: true,
        enableRowNumbers: true,
        enableColumnPinning: true,
        enableTableFooter: true,
        enableRowVirtualization: true,
        onSortingChange: setSorting,
        state: { sorting }
    });

    useEffect(() => {
        if (isSuccess && data) {
            setUsers(data.data)
        }
    }, [isSuccess, data])

    return (
        <>
            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"

            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Users
                </Typography>

                <Stack
                    direction="row"
                >

                    < Stack direction="row" spacing={2}>
                        <Stack direction={'row'} alignItems={'center'}>
                            <input type='checkbox' onChange={(e) => {
                                if (e.target.checked) {
                                    setHidden('true')
                                }
                                else
                                    setHidden('false')
                            }} /> <span style={{ paddingLeft: '5px' }}>Blocked</span>
                        </Stack >

                    </Stack >
                    {/* user menu */}
                    <>
                        <IconButton size="small" color="primary"
                            onClick={(e) => setAnchorEl(e.currentTarget)
                            }
                            sx={{ border: 2, borderRadius: 3, marginLeft: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)
                            }
                            TransitionComponent={Fade}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            {

                                <MenuItem onClick={() => {
                                    setChoice({ type: UserChoiceActions.new_user })
                                    setAnchorEl(null)
                                }}
                                >New User</MenuItem>}


                            <MenuItem

                                onClick={() => {
                                    setChoice({ type: UserChoiceActions.close_user })
                                    if (!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) {
                                        alert("select some users")
                                    }
                                    else {
                                        setChoice({ type: UserChoiceActions.bulk_assign_permissions })
                                    }
                                    setAnchorEl(null)
                                }}
                            >Assign Permissions</MenuItem>

                            <MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}
                            >Export All</MenuItem>
                            <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}
                            >Export Selected</MenuItem>
                        </Menu>
                        <NewUserDialog />
                        <AssignPermissionsToUsersDialog user_ids={table.getSelectedRowModel().rows.map((I) => { return I.original._id })} />
                    </>
                </Stack >
            </Stack >
            {
                isLoading && <LinearProgress />
            }

            {!isLoading && data && <MaterialReactTable table={table} />}
            {
                user ?
                    <>
                        <UpdateUserDialog user={user} />
                        <ResetMultiLoginDialog id={user._id} />
                        <BlockMultiLoginDialog id={user._id} />
                        <UpdatePasswordDialog />
                        <BlockUserDialog id={user._id} />
                        <UnBlockUserDialog id={user._id} />
                        <MakeAdminDialog id={user._id} />
                        <RemoveAdminDialog id={user._id} />
                        <UpdateUsePasswordDialog user={user} />
                        <AssignUsersDialog user={user} setUser={setUser} />
                        <ToogleVisitingcardShowDialog user={user} />
                        <AssignPermissionsToOneUserDialog user={user} />
                    </>
                    : null
            }
        </>

    )

}
