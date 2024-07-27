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
import { IUser } from '../../types/user.types'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import UsersSTable from '../../components/tables/users/UsersTable'
import { GetUsers } from '../../services/UserServices'
import FuzzySearch from 'fuzzy-search'

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
    const [filter, setFilter] = useState<string | undefined>()
    const [user, setUser] = useState<IUser>()
    const [users, setUsers] = useState<IUser[]>([])
    const [preFilteredData, setPreFilteredData] = useState<IUser[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())


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
                dp: user.dp?.public_url,
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
    }, [isSuccess])

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

                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>
                        </Menu>
                        <NewUserDialog />
                    </>
                </Stack>
            </Stack>



            {/*  table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
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

