
import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import FuzzySearch from "fuzzy-search";
import FlowsTable from '../../components/tables/FlowsTable'
import { BackendError } from '../..'
import { BotChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import { GetFlows } from '../../services/BotServices'
import { IFlow } from '../../types/bot.types'
import CreateFlowDialog from '../../components/dialogs/bot/CreateFlowDialog'
import TableSkeleton from '../../components/skeleton/TableSkeleton'

type SelectedData = {
  flow_name: string,
  connected_numbers: string,
  connected_users: string
}


// react component
export default function FlowsPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IFlow[]>, BackendError>("flows", GetFlows)
  const [flow, setFlow] = useState<IFlow>()
  const [flows, setFlows] = useState<IFlow[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => flows, [flows])
  const [preFilteredData, setPreFilteredData] = useState<IFlow[]>([])
  const [selectedFlows, setSelectedFlows] = useState<IFlow[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  

  // export selected flows into excel
  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData.length === 0)
        return alert("please select some rows")
      ExportToExcel(selectedData, "flows_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedFlows([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }

  }

  // convert select data in to proper format
  useEffect(() => {
    let data: any[] = []
    selectedFlows.map((flow) => {
      return data.push(
        {
          flow_name: flow.flow_name,
          connected_numbers: flow.connected_users && flow.connected_users.map((user) => {
            return user.username + ","
          }).toString() || "",
          connected_users: flow.connected_users && flow.connected_users.map((user) => {
            return user.connected_number + ","
          }).toString() || ""
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedFlows])

  // setup data again after filter
  useEffect(() => {
    if (isSuccess) {
      setFlows(data.data)
      setPreFilteredData(data.data)

    }
  }, [isSuccess, data])


  //handle fuzzy search
  useEffect(() => {
    if (filter) {
      if (flows) {
        const searcher = new FuzzySearch(flows, ["flow_name", "trigger_keywords"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setFlows(result)
      }
    }
    if (!filter)
      setFlows(preFilteredData)

  }, [filter, flows])

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
          Flows
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2} >
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
          {/* flow menu */}
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
                setChoice({ type: BotChoiceActions.create_flow })
                setAnchorEl(null)
              }}
              >New Flow</MenuItem>

              <MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu>
            <CreateFlowDialog />
          </>
        </Stack>
      </Stack>

      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && 
      <FlowsTable
        flow={flow}
        selectAll={selectAll}
        selectedFlows={selectedFlows}
        setSelectedFlows={setSelectedFlows}
        setSelectAll={setSelectAll}
        flows={MemoData}
        setFlow={setFlow}
      />}
      
    </>

  )

}

