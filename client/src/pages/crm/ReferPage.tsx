import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { IUser } from '../../types/user.types'
import { UserContext } from '../../contexts/userContext'
import { IReferredParty } from '../../types/crm.types'
import { IReferTemplate } from '../../types/template.type'


let template: IReferTemplate[] = [
  {
    _id: "",
    name: "",
    customer_name: "",
    gst: "",
    mobile: "6787876765",
    city: "",
    state: ""
  }
]


export default function RefersPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [users, setUsers] = useState<IUser[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [refer, setRefer] = useState<IReferredParty>()
  const [refers, setRefers] = useState<IReferredParty[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => refers, [refers])
  const [preFilteredData, setPreFilteredData] = useState<IReferredParty[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedRefers, setSelectedRefers] = useState<IReferredParty[]>([])
  const { data, isLoading } = useQuery<AxiosResponse<{ refers: IReferredParty[], page: number, total: number, limit: number }>, BackendError>(["refers", paginationData], async () => GetRefers({ limit: paginationData?.limit, page: paginationData?.page }))

  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

  const { data: fuzzyrefers, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ refers: IReferredParty[], page: number, total: number, limit: number }>, BackendError>(["fuzzyrefers", filter], async () => FuzzySearchRefers({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
    enabled: false
  })
  const [selectedData, setSelectedData] = useState<IReferredPartyTemplate[]>(template)
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
    let data: IReferredPartyTemplate[] = []
    selectedRefers.map((refer) => {
      return data.push(

        {
          _id: refer._id,
          name: refer.name,
          customer_name: refer.customer_name,
          customer_designation: refer.customer_designation,
          mobile: refer.mobile,
          gst: refer.gst,
          email: refer.email,
          city: refer.city,
          state: refer.state,
          country: refer.country,
          address: refer.address,
          work_description: refer.work_description,
          turnover: refer.turnover,
          alternate_mobile1: refer.alternate_mobile1,
          alternate_mobile2: refer.alternate_mobile2,
          alternate_email: refer.alternate_email,
          refer_type: refer.refer_type,
          stage: refer.stage,
          refer_source: refer.refer_source,
          remarks: refer.remarks && refer.remarks.length > 0 && refer.remarks[refer.remarks.length - 1].remark || "",

        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedRefers])

  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])

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
      setRefers(data.data.refers)
      setPreFilteredData(data.data.refers)
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
      setRefers(fuzzyrefers.data.refers)
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
          Refers {selectedRefers.length > 0 ? <span>(checked : {selectedRefers.length})</span> : ''}
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
          placeholder={`Search Keywords here like name,mobile,address,state,stage and press ENTER KEY`}
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
            {LoggedInUser?.crm_access_fields.is_editable && <UploadRefersExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />}
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
              <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_refer })
                  setRefer(undefined);
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >
            <CreateOrEditReferDialog refer={undefined} />
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 && <>
        < RefersTable
          refer={refer}
          setRefer={setRefer}
          selectAll={selectAll}
          selectedRefers={selectedRefers}
          setSelectedRefers={setSelectedRefers}
          setSelectAll={setSelectAll}
          refers={MemoData}
        />
        <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
      </>
      }
    </>

  )

}

