import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchUsers, GetPaginatedUsers } from '../../services/UserServices'
import UsersTable from '../../components/tables/UsersTable'
import { BackendError } from '../..'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import NewUserDialog from '../../components/dialogs/users/NewUserDialog'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import DBPagination from '../../components/pagination/DBpagination'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'

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
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const { user: loggedInUser } = useContext(UserContext)
    const [user, setUser] = useState<IUser>()
    const [users, setUsers] = useState<IUser[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => users, [users])
    const [preFilteredData, setPreFilteredData] = useState<IUser[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
    const [filter, setFilter] = useState<string | undefined>()
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [filterCount, setFilterCount] = useState(0)
    const { data, isLoading } = useQuery<AxiosResponse<{ users: IUser[], page: number, total: number, limit: number }>, BackendError>(["users", paginationData], async () => GetPaginatedUsers({ limit: paginationData?.limit, page: paginationData?.page }))

    const { data: fuzzyusers, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ users: IUser[], page: number, total: number, limit: number }>, BackendError>(["fuzzyusers", filter], async () => FuzzySearchUsers({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })

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
        if (!filter) {
            setUsers(preFilteredData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])

    useEffect(() => {
        if (filter) {
            refetchFuzzy()
        }
    }, [paginationData])

    useEffect(() => {
        if (data && !filter) {
            setUsers(data.data.users)
            setPreFilteredData(data.data.users)
            setPreFilteredPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [data])

    useEffect(() => {
        if (fuzzyusers && filter) {
            setUsers(fuzzyusers.data.users)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzyusers.data.page,
                    limit: fuzzyusers.data.limit,
                    total: fuzzyusers.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzyusers])

    return (
        <>
            {
                isLoading && <LinearProgress />
            }
            {
                isFuzzyLoading && <LinearProgress />
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
                                setFilter(e.currentTarget.value)
                                setFilterCount(0)
                            }}

                            placeholder={`${MemoData?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    refetchFuzzy()
                                }
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
                                loggedInUser?.user_access_fields.is_editable &&
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
                <UsersTable
                    user={user}
                    selectAll={selectAll}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    setSelectAll={setSelectAll}
                    users={MemoData}
                    setUser={setUser}
                />}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

