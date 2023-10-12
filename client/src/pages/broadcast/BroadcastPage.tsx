import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem,  TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { headColor } from '../../utils/colors'
import FuzzySearch from "fuzzy-search";
import { BackendError } from '../..'
import { IBroadcast } from '../../types'
import { GetBroadCasts } from '../../services/BroadCastServices'
import BroadcastsTable from '../../components/tables/BroadcastTable'
import { BroadcastChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import NewBroadcastDialog from '../../components/dialogs/broadcasts/NewBroadcastDialog'
import NewBroadcastMessageDialog from '../../components/dialogs/broadcasts/NewBroadcastMessageDialog'
import { Menu as MenuIcon } from '@mui/icons-material';
import ReactPagination from '../../components/pagination/ReactPagination'
import AlertBar from '../../components/snacks/AlertBar'

type SelectedData = {
  name?: string,
  daily_limit?: number,
  type?: string,
  status?: string,
  auto_refresh: boolean,
  is_random__template: boolean,
  start_time: Date,
  updated_at: Date,
  created_by: string

}

export default function BroadcastPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IBroadcast[]>, BackendError>("broadcasts", GetBroadCasts)
  const [broadcast, setBroadcast] = useState<IBroadcast>()
  const [broadcasts, setBroadcasts] = useState<IBroadcast[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => broadcasts, [broadcasts])
  const [preFilteredData, setPreFilteredData] = useState<IBroadcast[]>([])
  const [selectedBroadcasts, setSelectedBroadcasts] = useState<IBroadcast[]>([])
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
  
  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "broadcast_data")
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
    selectedBroadcasts.map((broadcast) => {
      return data.push({
        name: broadcast.name,
        daily_limit: broadcast.daily_limit,
        type: broadcast.message ? "custom" : "template",
        status: broadcast.is_active ? "active" : "disabled",
        auto_refresh: broadcast.autoRefresh,
        is_random__template: broadcast.is_random_template,
        start_time: new Date(broadcast.created_at),
        updated_at: new Date(broadcast.updated_at),
        created_by: broadcast.created_by && broadcast.created_by.username
      })
    })
    setSelectedData(data)
  }, [selectedBroadcasts])

  useEffect(() => {
    if (isSuccess) {
      setBroadcasts(data.data)
      setPreFilteredData(data.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(data.data.length / reactPaginationData.limit)
      })
    }
  }, [isSuccess, broadcasts, data])

  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])

  useEffect(() => {
    if (filter) {
      if (broadcasts) {
        const searcher = new FuzzySearch(broadcasts, ["name", "type", "is_active", "created_by", "is_random__template", "auto_refresh", "connected_number", "daily_limit", ""], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setBroadcasts(result)
      }
    }
    if (!filter)
      setBroadcasts(preFilteredData)

  }, [filter, broadcasts])
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
          Broadcast
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
                setChoice({ type: BroadcastChoiceActions.create_broadcast })
                setAnchorEl(null)
              }}
              >New Template Broadcast</MenuItem>
              <MenuItem onClick={() => {
                setChoice({ type: BroadcastChoiceActions.create_message_broadcast })
                setAnchorEl(null)
              }}
              >New Custom Broadcast</MenuItem>
              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <NewBroadcastDialog />
            <NewBroadcastMessageDialog />
          </>
        </Stack>
      </Stack>
      {/*  table */}
      <BroadcastsTable
        broadcast={broadcast}
        selectAll={selectAll}
        selectedBroadcasts={selectedBroadcasts}
        setSelectedBroadcasts={setSelectedBroadcasts}
        setSelectAll={setSelectAll}
        broadcasts={currentItems }
        setBroadcast={setBroadcast}
      />
      <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={MemoData}
      />
    </>

  )

}

