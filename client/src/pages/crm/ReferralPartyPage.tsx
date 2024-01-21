import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { FuzzySearchRefers, GetPaginatedRefers } from '../../services/LeadsServices'
import RefersTable from '../../components/tables/RefersTable'
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import CreateReferDialog from '../../components/dialogs/crm/CreateReferDialog'
import AlertBar from '../../components/snacks/AlertBar'
import { ILead, IReferredParty } from '../../types/crm.types'
import DBPagination from '../../components/pagination/DBpagination'
import BulkAssignRefersDialog from '../../components/dialogs/crm/BulkAssignRefersDialog'
import { UserContext } from '../../contexts/userContext'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'


type SelectedData = {
    name?: string,
    customer_name?: string,
    mobile?: string,
    city?: string,
    state?: string,
    created_at?: string,
    updated_at?: string,
    lead_owners: string
}

export default function ReferralPartyPage() {
    const { user: LoggedInUser } = useContext(UserContext)
    const [refer, setRefer] = useState<IReferredParty>()
    const [refers, setRefers] = useState<{
        party: IReferredParty,
        leads: ILead[]
    }[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => refers, [refers])
    const [preFilteredData, setPreFilteredData] = useState<{
        party: IReferredParty,
        leads: ILead[]
    }[]>([])
    const [selectedRefers, setSelectedRefers] = useState<{
        party: IReferredParty,
        leads: ILead[]
    }[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [filter, setFilter] = useState<string | undefined>()
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [users, setUsers] = useState<IUser[]>([])
    const [userId, setUserId] = useState<string>()

    const { data, isLoading, refetch: refetchRefers } = useQuery<AxiosResponse<{
        result: {
            party: IReferredParty,
            leads: ILead[]
        }[], page: number, total: number, limit: number
    }>, BackendError>(["paginatedrefers", paginationData], async () => GetPaginatedRefers({ limit: paginationData?.limit, page: paginationData?.page,userId }))

    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { data: fuzzyrefers, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{
        result: {
            party: IReferredParty,
            leads: ILead[]
        }[], page: number, total: number, limit: number
    }>, BackendError>(["fuzzyrefers", filter], async () => FuzzySearchRefers({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page,userId }), {
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
            setSelectedRefers([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }

    }
    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    // refine data
    useEffect(() => {
        let data: SelectedData[] = []
        selectedRefers.map((refer) => {
            return data.push({
                name: refer.party.name,
                customer_name: refer.party.customer_name,
                mobile: refer.party.mobile,
                city: refer.party.city,
                state: refer.party.state,
                lead_owners: refer.party.lead_owners.map((owner) => { return owner.username + "," }).toString(),
                created_at: new Date(refer.party.created_at).toLocaleDateString(),
                updated_at: new Date(refer.party.updated_at).toLocaleDateString()
            })
        })
        setSelectedData(data)
    }, [selectedRefers])
    useEffect(() => {
        if (!filter) {
            setRefers(preFilteredData)
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
            setRefers(data.data.result)
            setPreFilteredData(data.data.result)
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
        if (fuzzyrefers && filter) {
            setRefers(fuzzyrefers.data.result)
            let count = filterCount
            if (count === 0)
                setPaginationData({
                    ...paginationData,
                    page: fuzzyrefers.data.page,
                    limit: fuzzyrefers.data.limit,
                    total: fuzzyrefers.data.total
                })
            count = filterCount + 1
            setFilterCount(count)
        }
    }, [fuzzyrefers])

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
                    Refers
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
                    < Stack direction="row" spacing={2} >
                        {LoggedInUser?.assigned_users && LoggedInUser?.assigned_users.length > 0 && 
                            < TextField
                                size='small'
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                onChange={(e) => {
                                    setUserId(e.target.value)
                                    refetchRefers()
                                }}
                                required
                                id="todo_owner"
                                label="Filter Refer Owners"
                                fullWidth
                            >
                                <option key={'00'} value={undefined}>

                                </option>
                                {
                                    users.map((user, index) => {
                                        if (!user.crm_access_fields.is_hidden)
                                            return (<option key={index} value={user._id}>
                                                {user.username}
                                            </option>)
                                        else
                                            return null
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
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    refetchFuzzy()
                                }
                            }}
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
                    {/* menu */}
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
                            <MenuItem onClick={() => {
                                setChoice({ type: LeadChoiceActions.create_refer })
                                setAnchorEl(null)
                            }}
                            >New Refer</MenuItem>
                            {LoggedInUser?.is_admin &&
                                <MenuItem
                                    onClick={() => {
                                        if (selectedRefers.length === 0)
                                            alert("please select some refers")
                                        else
                                            setChoice({ type: LeadChoiceActions.bulk_assign_refers })
                                        setAnchorEl(null)
                                    }}
                                > Assign Refers</MenuItem>}

                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu>
                        <CreateReferDialog />
                        <BulkAssignRefersDialog refers={selectedRefers} />
                    </>

                </Stack>
            </Stack>
            {/*  table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                <RefersTable
                    refer={refer}
                    selectAll={selectAll}
                    selectedRefers={selectedRefers}
                    setSelectedRefers={setSelectedRefers}
                    setSelectAll={setSelectAll}
                    refers={MemoData}
                    setRefer={setRefer}
                />}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>

    )

}

