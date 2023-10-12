import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { ILead, IReferredParty } from '../../types'
import { BackendError } from '../..'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { GetReferralParties } from '../../services/LeadsServices'
import RefersTable from '../../components/tables/RefersTable'
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import CreateReferDialog from '../../components/dialogs/crm/CreateReferDialog'
import AlertBar from '../../components/snacks/AlertBar'
import ReactPagination from '../../components/pagination/ReactPagination'


type SelectedData = {
    name?: string,
    customer_name?: string,
    mobile?: string,
    city?: string,
    state?: string,
    created_at?: string,
    updated_at?: string
}

export default function ReferralPartyPage() {
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<{
        party: IReferredParty,
        leads: ILead[]
    }[]>, BackendError>("refers", GetReferralParties)
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
    const [filter, setFilter] = useState<string | undefined>()
    const [selectedData, setSelectedData] = useState<SelectedData[]>([])
    const [sent, setSent] = useState(false)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + reactPaginationData.limit;
    const currentItems = MemoData.slice(itemOffset, endOffset)


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
                created_at: new Date(refer.party.created_at).toLocaleDateString(),
                updated_at: new Date(refer.party.updated_at).toLocaleDateString()
            })
        })
        setSelectedData(data)
    }, [selectedRefers])

    useEffect(() => {
        if (isSuccess) {
            setRefers(data.data)
            setPreFilteredData(data.data)
            setReactPaginationData({
                ...reactPaginationData,
                total: Math.ceil(data.data.length / reactPaginationData.limit)
            })
        }
    }, [isSuccess, refers, data])

    useEffect(() => {
        setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
    }, [reactPaginationData])

    useEffect(() => {
        if (filter) {
            if (refers) {
                const searcher = new FuzzySearch(refers, ["party.name", "party.customer_name", "party.city", "party.state", "party.mobile"], {
                    caseSensitive: false,
                });
                const result = searcher.search(filter);
                setRefers(result)
            }
        }
        if (!filter)
            setRefers(preFilteredData)

    }, [filter, refers])

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
                    Refers
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
                    {/* menu */}
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
                                setChoice({ type: LeadChoiceActions.create_refer })
                                setAnchorEl(null)
                            }}
                            >New Refer</MenuItem>
                            <MenuItem onClick={handleExcel}
                            >Export To Excel</MenuItem>

                        </Menu>
                        <CreateReferDialog />
                    </>

                </Stack>
            </Stack>
            {/*  table */}
            <RefersTable
                refer={refer}
                selectAll={selectAll}
                selectedRefers={selectedRefers}
                setSelectedRefers={setSelectedRefers}
                setSelectAll={setSelectAll}
                refers={currentItems}
                setRefer={setRefer}
            />
            <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
            />
        </>

    )

}

