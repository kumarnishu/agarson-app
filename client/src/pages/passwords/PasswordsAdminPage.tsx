import { Search } from '@mui/icons-material'
import { Fade,  IconButton, LinearProgress, Menu, MenuItem,  TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, PasswordChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IPassword } from '../../types/password.types'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import { UserContext } from '../../contexts/userContext'
import NewPasswordDialog from '../../components/dialogs/passwords/NewPasswordDialog'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import PasswordSTable from '../../components/tables/PasswordTable'
import { FuzzySearchPasswords, GetPasswords } from '../../services/PasswordServices'


export default function PasswordsAdminPage() {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [password, setPassword] = useState<IPassword>()
    const [passwords, setPasswords] = useState<IPassword[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => passwords, [passwords])
    const [preFilteredData, setPreFilteredData] = useState<IPassword[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedPasswords, setSelectedPasswords] = useState<IPassword[]>([])
    const [userId, setUserId] = useState<string>()
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { data, isLoading, refetch: ReftechPasswords } = useQuery<AxiosResponse<{ passwords: IPassword[], page: number, total: number, limit: number }>, BackendError>(["passwords", paginationData, userId], async () => GetPasswords({ limit: paginationData?.limit, page: paginationData?.page, id: userId }))

    const { data: fuzzypasswords, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ passwords: IPassword[], page: number, total: number, limit: number }>, BackendError>(["fuzzypasswords", filter], async () => FuzzySearchPasswords({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
        enabled: false
    })

    const [selectedData, setSelectedData] = useState<{
        state: string,
        username: string,
        password: string,
        persons: string,
        created_at: string,
        updated_at: string,
        created_by: string,
        updated_by: string,
    }[]>()
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "passwords_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedPasswords([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }


    // refine data
    useEffect(() => {
        let data: {
            state: string,
            username: string,
            password: string,
            persons: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedPasswords.map((password) => {
            return data.push(
                {
                    state: password.state,
                    username: password.username,
                    password: password.password,
                    persons: password.persons && password.persons.map((per) => { return per.username }).toString(),
                    created_at: password.created_at.toLocaleString(),
                    created_by: password.created_by.username,
                    updated_by: password.updated_by.username,
                    updated_at: password.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedPasswords])

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    useEffect(() => {
        if (!filter) {
            setPasswords(preFilteredData)
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
            setPasswords(data.data.passwords)
            setPreFilteredData(data.data.passwords)
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
        if (fuzzypasswords && filter) {
            setPasswords(fuzzypasswords.data.passwords)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzypasswords.data.page,
                    limit: fuzzypasswords.data.limit,
                    total: fuzzypasswords.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzypasswords])

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
                width="100vw"
            >

                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    {window.screen.width > 450 ? "Password Admin" : "Admin"}
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2}>
                        {user?.assigned_users && user?.assigned_users.length > 0 && 
                            < TextField
                                size='small'
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                onChange={(e) => {
                                    setUserId(e.target.value)
                                    ReftechPasswords()
                                }}
                                required
                                id="password_owner"
                                label="Filter Passwords Of Indivdual"
                                fullWidth
                            >
                                <option key={'00'} value={undefined}>

                                </option>
                                {
                                    users.map((user, index) => {
                                        return (<option key={index} value={user._id}>
                                            {user.username}
                                        </option>)
                                    })
                                }
                            </TextField>}

                        <TextField
                            fullWidth
                            size="small"
                            onChange={(e) => {
                                setFilter(e.currentTarget.value)
                                setFilterCount(0)
                            }}
                            autoFocus
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
                        />
                        <IconButton
                            sx={{ bgcolor: 'whitesmoke' }}
                            onClick={() => {
                                refetchFuzzy()
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Stack >

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
                                user?.passwords_access_fields.is_editable &&
                                <MenuItem
                                    onClick={() => {
                                        setChoice({ type: PasswordChoiceActions.create_password })
                                        setAnchorEl(null)
                                    }}
                                > Add New</MenuItem>

                            }
                            < MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu >
                        <NewPasswordDialog />
                    </>
                </Stack >
            </Stack >

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                < PasswordSTable
                    password={password}
                    setPassword={setPassword}
                    selectAll={selectAll}
                    selectedPasswords={selectedPasswords}
                    setSelectedPasswords={setSelectedPasswords}
                    setSelectAll={setSelectAll}
                    passwords={MemoData}
                />}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

