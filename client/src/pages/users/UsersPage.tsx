import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import NewUserDialog from '../../components/dialogs/users/NewUserDialog'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import UsersSTable from '../../components/tables/users/UsersTable'
import { GetUsers } from '../../services/UserServices'
import FuzzySearch from 'fuzzy-search'
import AssignPermissionsToUsersDialog from '../../components/dialogs/users/AssignPermissionsToUsersDialog'
import { GetUserDto } from '../../dtos/users/user.dto'

type SelectedData = {
    username?: string,
    email?: string,
    dp?: string,
    email_verified?: Boolean,
    is_active?: Boolean,
    last_login?: string,
    roles?: string,
    created_at?: string,
    createdBy?: string
}

// react component
export default function UsersPage() {
    const [hidden, setHidden] = useState('false')
    const [filter, setFilter] = useState<string | undefined>()
    const [user, setUser] = useState<GetUserDto>()
    const [users, setUsers] = useState<GetUserDto[]>([])
    const [preFilteredData, setPreFilteredData] = useState<GetUserDto[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<GetUserDto[]>([])
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", hidden], async () => GetUsers({ hidden: hidden, permission: undefined, show_assigned_only: false }))


    function handleExcel() {
        setAnchorEl(null)
        try {
            if (selectedData.length === 0)
                return alert("please select some rows")
            ExportToExcel(selectedData, "users_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedUsers([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }

    }


    useEffect(() => {
        let data: SelectedData[] = []
        selectedUsers.map((user) => {
            let lastlogin = undefined
            let created_at = undefined
            if (user.last_login && user.created_at) {
                lastlogin = new Date(user.last_login).toLocaleDateString()
                created_at = new Date(user.created_at).toLocaleDateString()
            }
            return data.push({
                username: user.username,
                email: user.email,
                dp: user.dp,
                email_verified: user.email_verified,
                is_active: user.is_active,
                last_login: lastlogin,
                roles: user?.is_admin ? "admin" : "user",
                created_at: created_at
            })
        })
        setSelectedData(data)
    }, [selectedUsers])

    useEffect(() => {
        if (isSuccess && data) {
            setUsers(data.data)
            setPreFilteredData(data.data)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (filter) {
            if (users) {
                const searcher = new FuzzySearch(users, ["username"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setUsers(result)
            }
        }
        if (!filter)
            setUsers(preFilteredData)

    }, [filter])

    return (
        <>
            {
                isLoading && <LinearProgress />
            }

            {/*heading, search bar and table menu */}
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
                            }} /> <span style={{paddingLeft:'5px'}}>Blocked</span>
                       </Stack >
                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => {
                                setFilter(e.target.value)
                            }}

                            placeholder={`${users?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}

                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Stack >
                    {/* user menu */}
                    <>
                        {sent && <AlertBar message="File Exported Successfuly" color="success" />}
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


                            <MenuItem onClick={() => {
                                setChoice({ type: UserChoiceActions.close_user })
                                if (selectedUsers && selectedUsers.length == 0) {
                                    alert("select some users")
                                }
                                else {
                                    setChoice({ type: UserChoiceActions.bulk_assign_permissions })
                                }
                                setAnchorEl(null)
                            }}
                            >Assign Permissions</MenuItem>

                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>
                        </Menu>
                        <NewUserDialog />
                        <AssignPermissionsToUsersDialog user_ids={selectedUsers.map((I) => { return I._id })} />
                    </>
                </Stack>
            </Stack>



            {/*  table */}
            {isLoading && <TableSkeleton />}
            {users &&
                <UsersSTable
                    user={user}
                    selectAll={selectAll}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    setSelectAll={setSelectAll}
                    users={users}
                    setUser={setUser}
                />}
        </>

    )

}

