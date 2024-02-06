import { Search } from '@mui/icons-material'
import { Box, Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import sortBy from "sort-by"
import { IVisitingCard } from '../../types/visiting_card.types'
import { GetVisitingCards } from '../../services/LeadsServices'
import VisitingCardTable from '../../components/tables/VisitingCardTable'

export default function VisitingCardAdminPage() {
    const [sorted, setSorted] = useState(false)
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filter, setFilter] = useState<string | undefined>()
    const [card, setVisitingCard] = useState<IVisitingCard>()
    const [cards, setVisitingCards] = useState<IVisitingCard[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const MemoData = React.useMemo(() => cards, [cards])
    const [preFilteredData, setPreFilteredData] = useState<IVisitingCard[]>([])
    const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [filterCount, setFilterCount] = useState(0)
    const [selectedVisitingCards, setSelectedVisitingCards] = useState<IVisitingCard[]>([])
    const [userId, setUserId] = useState<string>()
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

    const { data, isLoading, refetch: ReftechVisitingCards } = useQuery<AxiosResponse<{ cards: IVisitingCard[], page: number, total: number, limit: number }>, BackendError>(["cards", paginationData, userId], async () => GetVisitingCards({ limit: paginationData?.limit, page: paginationData?.page, userId: userId }))

    const [selectedData, setSelectedData] = useState<{
        name: string,
        city: string,
        state: string,
        salesman: string,
        refer: string,
        comment: string,
        is_closed: boolean,
        card: string,
        created_at: string,
        updated_at: string,
        updated_by: string,
        created_by: string,
    }[]>()

    const [sent, setSent] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function handleExcel() {
        setAnchorEl(null)
        try {
            selectedData && ExportToExcel(selectedData, "cards_data")
            setSent(true)
            setSelectAll(false)
            setSelectedData([])
            setSelectedVisitingCards([])
        }
        catch (err) {
            console.log(err)
            setSent(false)
        }
    }

    // refine data
    useEffect(() => {
        let data: {
            name: string,
            city: string,
            state: string,
            salesman: string,
            refer: string,
            comment: string,
            is_closed: boolean,
            card: string,
            created_at: string,
            updated_at: string,
            updated_by: string,
            created_by: string,
        }[] = []
        selectedVisitingCards.map((card) => {
            return data.push(
                {
                    name: card.name,
                    city: card.city,
                    state: card.state,
                    salesman: card.salesman.username || "",
                    refer: card.refer.name || "",
                    comment: card.comments && card.comments.length > 0 && card.comments[card.comments.length].comment || "",
                    is_closed: card.is_closed,
                    card: card.card?.public_url || "",
                    created_at: card.created_at.toLocaleString(),
                    created_by: card.created_by.username,
                    updated_by: card.updated_by.username,
                    updated_at: card.updated_at.toLocaleString(),
                })
        })
        if (data.length > 0)
            setSelectedData(data)
    }, [selectedVisitingCards])


    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])


    useEffect(() => {
        if (!filter) {
            setVisitingCards(preFilteredData)
            setPaginationData(preFilteredPaginationData)
        }
    }, [filter])


    useEffect(() => {
        if (data && !filter) {
            setVisitingCards(data.data.cards)
            setPreFilteredData(data.data.cards)
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
        if (sorted) {
            let result = cards.sort(sortBy('person.username'))
            setVisitingCards(result)
        }
    }, [sorted])
    return (
        <>
            {
                isLoading && <LinearProgress />
            }
            
            {/*heading, search bar and table menu */}

            <Stack
                spacing={2}
                p={1}
                direction="row"
                justifyContent="space-between"
            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                >
                    Visiting Cards
                </Typography>

                <Stack
                    direction="row"
                >
                    {/* search bar */}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
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
                            < MenuItem onClick={() => {
                                handleExcel()
                            }}
                            >Export To Excel</MenuItem>
                        </Menu >

                    </>
                </Stack >
            </Stack >

            {/* filter dates and person */}
            <Stack direction="row" p={1} gap={2}>
              
                {user?.assigned_users && user?.assigned_users.length > 0 && < TextField
                    focused
                    size="small"
                    select
                    SelectProps={{
                        native: true,
                    }}
                    onChange={(e) => {
                        setUserId(e.target.value)
                        ReftechVisitingCards()
                    }}
                    required
                    id="card_owner"
                    label="Person"
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
            </Stack>

            {/* table */}
            {isLoading && <TableSkeleton />}
            {!isLoading &&
                <Box sx={{ px: 1 }}>
                    <VisitingCardTable
                        card={card}
                        sorted={sorted}
                        setSorted={setSorted}
                        setVisitingCard={setVisitingCard}
                        selectAll={selectAll}
                        selectedVisitingCards={selectedVisitingCards}
                        setSelectedVisitingCards={setSelectedVisitingCards}
                        setSelectAll={setSelectAll}
                        cards={MemoData}
                    />
                </Box>}
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} filterCount={filterCount} setFilterCount={setFilterCount} />
        </>

    )

}
