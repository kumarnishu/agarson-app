import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import  { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../../contexts/userContext'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import CreateOrEditReferDialog from '../../components/dialogs/crm/CreateOrEditReferDialog'
import RefersTable from '../../components/tables/crm/RefersTable'
import { FuzzySearchRefers, GetPaginatedRefers } from '../../services/LeadsServices'
import { IReferTemplate } from '../../types/template.type'
import UploadRefersExcelButton from '../../components/buttons/UploadRefersExcelButton'
import { IReferredParty } from '../../types/crm.types'

let template: IReferTemplate[] = [
  {
    _id: "",
    name: "",
    gst: "",
    customer_name: "",
    mobile: "6787876765",
    city: "",
    state: ""
  }
]


export default function RefersPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [refer, setRefer] = useState<IReferredParty>()
  const [refers, setRefers] = useState<IReferredParty[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const [preFilteredData, setPreFilteredData] = useState<IReferredParty[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedRefers, setSelectedRefers] = useState<IReferredParty[]>([])

  const { data, isLoading } = useQuery<AxiosResponse<{
    result: IReferredParty[], page: number, total: number, limit: number
  }>, BackendError>(["refers", paginationData], async () => GetPaginatedRefers({ limit: paginationData?.limit, page: paginationData?.page }))


  const { data: fuzzyrefers, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{
    result: IReferredParty[], page: number, total: number, limit: number
  }>, BackendError>(["fuzzyrefers", filter], async () => FuzzySearchRefers({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
    enabled: false
  })


  const [selectedData, setSelectedData] = useState<IReferTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "refers_data")
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

  // refine data
  useEffect(() => {
    let data: IReferTemplate[] = []
    selectedRefers.map((refer) => {
      return data.push(

        {
          _id: refer._id,
          name: refer.name,
          customer_name: refer.customer_name,
          mobile: refer.mobile,
          gst: refer.gst,
          city: refer.city,
          state: refer.state
        })
    })
    if (data.length > 0)
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
          Refers {selectedRefers.length > 0 ? <span>(checked : {selectedRefers.length})</span> : `- ${refers.length}`}
        </Typography>

        <TextField
          sx={{ width: '50vw' }}
          size="small"
          onChange={(e) => {
            setFilter(e.currentTarget.value)
            setFilterCount(0)
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ cursor: 'pointer' }} onClick={() => {
                  refetchFuzzy()
                }} />
              </InputAdornment>
            ),
          }}
          placeholder={`Search Refers`}
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
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            {LoggedInUser?.assigned_permissions.includes('refer_create')&&<UploadRefersExcelButton />}
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
              {LoggedInUser?.assigned_permissions.includes('refer_create') &&<MenuItem
                 onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                  setRefer(undefined);
                  setAnchorEl(null)
                }}
            
              > Add New</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('refer_export') && < MenuItem onClick={handleExcel}
            
              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditReferDialog refer={undefined} />
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {refers && refers.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && refers.length > 0 && <>
        <RefersTable
          refer={refer}
          setRefer={setRefer}
          selectAll={selectAll}
          selectedRefers={selectedRefers}
          setSelectedRefers={setSelectedRefers}
          setSelectAll={setSelectAll}
          refers={refers}
        />
      </>
      }
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
    </>

  )

}

