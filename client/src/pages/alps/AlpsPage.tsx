import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchAlps, GetAlps } from '../../services/AlpsServices'
import DBPagination from '../../components/pagination/DBpagination';
import AlpsTable from '../../components/tables/AlpsTable';
import ReactPagination from '../../components/pagination/ReactPagination'
import { IAlps } from '../../types'
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'

type SelectedData = {
  serial_number: number,
  name: string,
  mobile: string,
  gst: string,
  customer_name: string,
  city: string,
  document: string

}


export default function AlpsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const [alp, setAlp] = useState<IAlps>()
  const [alps, setAlps] = useState<IAlps[]>([])

  const [allfuzzyalps, setAllFuzzyAlps] = useState<IAlps[]>([])
  const FuzzyMemoData = React.useMemo(() => allfuzzyalps, [allfuzzyalps])

  // pagination  states
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = FuzzyMemoData.slice(itemOffset, endOffset)


  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => alps, [alps])
  const [preFilteredData, setPreFilteredData] = useState<IAlps[]>([])
  const [selectedAlps, setSelectedAlps] = useState<IAlps[]>([])

  const { data, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{ alps: IAlps[], page: number, total: number, limit: number }>, BackendError>(["alps", paginationData], async () => GetAlps({ limit: paginationData?.limit, page: paginationData?.page }))

  const { data: fuzzyAlps, isSuccess: isFuzzySuccess, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<IAlps[]>, BackendError>(["fuzzyalps", filter], async () => FuzzySearchAlps({ searchString: filter }), {
    enabled: false
  })
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const [sent, setSent] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "alps_data")
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
    selectedAlps.map((alp) => {
      return data.push(
        {
          serial_number: Number(alp.serial_number),
          name: alp.name,
          mobile: alp.mobile,
          gst: alp.gst,
          customer_name: alp.name,
          city: alp.city,
          document: alp.media && alp.media?.public_url || ""
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedAlps])

  useEffect(() => {
    if (isSuccess) {
      console.log(data)
      setAlps((data.data.alps))
      setPreFilteredData(data.data.alps)
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [isSuccess, data])

  useEffect(() => {
    refetch()
  }, [filter])

  useEffect(() => {
    if (!filter)
      setAlps(preFilteredData)
  }, [filter])


  useEffect(() => {
    if (isFuzzySuccess) {
      setAllFuzzyAlps(fuzzyAlps.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(fuzzyAlps.data.length / reactPaginationData.limit)
      })
    }
  }, [isFuzzySuccess, fuzzyAlps])

  useEffect(() => {
    setItemOffset(reactPaginationData.page * reactPaginationData.limit % reactPaginationData.total)
  }, [reactPaginationData])
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
          ALPS
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              size="small"
              onChange={(e) => setFilter(e.currentTarget.value)}
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
              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>
            </Menu >
          </>
        </Stack >
      </Stack >
      {/* table */}
      < AlpsTable
        alp={alp}
        setAlp={setAlp}
        selectAll={selectAll}
        selectedAlps={selectedAlps}
        setSelectedAlps={setSelectedAlps}
        setSelectAll={setSelectAll}
        alps={filter ? currentItems : MemoData}
        selectableAlps={filter ? allfuzzyalps : alps}
      />

      {!filter ? <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} /> :
        <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={FuzzyMemoData}
        />
      }

    </>

  )

}

