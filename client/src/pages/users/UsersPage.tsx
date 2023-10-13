import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GetUsers } from '../../services/UserServices'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import UsersTable from '../../components/tables/UsersTable'
import { BackendError } from '../..'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import NewUserDialog from '../../components/dialogs/users/NewUserDialog'
import ReactPagination from '../../components/pagination/ReactPagination'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'

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
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)
    const [user, setUser] = useState<IUser>()
    const [users, setUsers] = useState<IUser[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => users, [users])
    const [preFilteredData, setPreFilteredData] = useState<IUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
    const [filter, setFilter] = useState<string | undefined>()
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    // pagination  states
    const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + reactPaginationData.limit;
    const currentItems = MemoData.slice(itemOffset, endOffset)

    // export selected users into excel
    function handleExcel() {
        setAnchorEl(null)
        try {
            if (selectedData.length === 0)
                return alert("please select some rows")
            ExportToExcel(selectedData, "users_data")
            setSent(true)
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }

    }

    // convert select data in to proper format
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

    // setup data again after filter
    useEffect(() => {
        if (isSuccess) {
            setUsers(data.data)
            setPreFilteredData(data.data)
            setReactPaginationData({
                ...reactPaginationData,
                total: Math.ceil(data.data.length / reactPaginationData.limit)
            })
        }
    }, [isSuccess, users, data])

    useEffect(() => {
        setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
    }, [reactPaginationData])

    //handle fuzzy search
    useEffect(() => {
        if (filter) {
            if (users) {
                const searcher = new FuzzySearch(users, ["username", "email", "mobile", "is_active", "is_admin", "is_email_verified", "last_login", "created_at", "updated_at"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setUsers(result)
            }
        }
        if (!filter)
            setUsers(preFilteredData)

    }, [filter, users])

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
                width="100vw"
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
                    {/* search bar */}
                    < Stack direction="row" spacing={2} sx={{ bgcolor: headColor }
                    }>
                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            autoFocus
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>,
                            }}
                            placeholder={`${MemoData?.length} records...`}
                            style={{
                                fontSize: '1.1rem',
                                border: '0',
                            }}
                        />
                    </Stack >
                    {/* user menu */}
                    <>
                        {sent && <AlertBar message="File Exported Successfuly" color="success" />}
                        <IconButton size="medium"
                            onClick={(e) => setAnchorEl(e.currentTarget)
                            }
                            sx={{ border: 1, borderRadius: 2, marginLeft: 2 }}
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
                            <MenuItem onClick={() => {
                                setChoice({ type: UserChoiceActions.new_user })
                                setAnchorEl(null)
                            }}
                            >New User</MenuItem>
                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu>
                        <NewUserDialog />
                    </>
                </Stack>
            </Stack>



            {/*  table */}
            <UsersTable
                user={user}
                selectAll={selectAll}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                setSelectAll={setSelectAll}
                users={currentItems}
                setUser={setUser}
            />
            <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
            />
        </>

    )

}

