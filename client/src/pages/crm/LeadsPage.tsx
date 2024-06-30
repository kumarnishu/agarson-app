import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchLeads, GetLeads } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'
import UploadLeadsExcelButton from '../../components/buttons/UploadLeadsExcelButton';
import DBPagination from '../../components/pagination/DBpagination';
import LeadsTable from '../../components/tables/LeadsTable';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import NewLeadDialog from '../../components/dialogs/crm/NewLeadDialog'
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { GetUsers } from '../../services/UserServices'
import { IUser } from '../../types/user.types'
import { ILeadTemplate } from '../../types/template.type'
import { ILead } from '../../types/crm.types'

let template: ILeadTemplate[] = [
  {
    _id: "",
    name: "",
    customer_name: "",
    customer_designation: "",
    mobile: "6787876765",
    email: "",
    city: "",
    state: "",
    country: "",
    address: "",
    work_description: "",
    turnover: "5 lakhs",
    alternate_mobile1: "6787876766",
    alternate_mobile2: "6787876767",
    alternate_email: '',
    lead_type: "wholesale+retail",
    stage: "useless",
    lead_source: "cold calling",
    remarks: "remarks",
    gst:""
  }
]


export default function LeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [users, setUsers] = useState<IUser[]>([])
  const [userId, setUserId] = useState<string>()
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [lead, setLead] = useState<ILead>()
  const [leads, setLeads] = useState<ILead[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => leads, [leads])
  const [preFilteredData, setPreFilteredData] = useState<ILead[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<ILead[]>([])
  const { data, isLoading } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData, userId], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page, userId }))

  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter], async () => FuzzySearchLeads({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page, userId }), {
    enabled: false
  })
  const [selectedData, setSelectedData] = useState<ILeadTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "leads_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedLeads([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ILeadTemplate[] = []
    selectedLeads.map((lead) => {
      return data.push(

        {
          _id: lead._id,
          name: lead.name,
          customer_name: lead.customer_name,
          customer_designation: lead.customer_designation,
          mobile: lead.mobile,
          email: lead.email,
          city: lead.city,
          state: lead.state,
          country: lead.country,
          address: lead.address,
          work_description: lead.work_description,
          turnover: lead.turnover,
          alternate_mobile1: lead.alternate_mobile1,
          alternate_mobile2: lead.alternate_mobile2,
          alternate_email: lead.alternate_email,
          lead_type: lead.lead_type,
          stage: lead.stage,
          lead_source: lead.lead_source,
          remarks: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || "",
          gst: lead.gst,
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeads])

  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])

  useEffect(() => {
    if (!filter) {
      setLeads(preFilteredData)
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
      setLeads(data.data.leads)
      setPreFilteredData(data.data.leads)
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
    if (fuzzyleads && filter) {
      setLeads(fuzzyleads.data.leads)
      let count = filterCount
      if (count === 0)
        setPaginationData({
          ...paginationData,
          page: fuzzyleads.data.page,
          limit: fuzzyleads.data.limit,
          total: fuzzyleads.data.total
        })
      count = filterCount + 1
      setFilterCount(count)
    }
  }, [fuzzyleads])
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
          Leads {selectedLeads.length > 0 ? <span>(checked : {selectedLeads.length})</span>:''}
        </Typography>
       
        <TextField
          sx={{width:'50vw'}}
          size="small"
          onChange={(e) => {
            setFilter(e.currentTarget.value)
            setFilterCount(0)
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                  <Search sx={{cursor:'pointer'}} onClick={() => {
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
            {LoggedInUser?.crm_access_fields.is_editable && <UploadLeadsExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />}
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
                  setChoice({ type: LeadChoiceActions.create_lead })
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedLeads.length === 0)
                    alert("please select some leads")
                  else
                    setChoice({ type: LeadChoiceActions.bulk_assign_leads })
                  setAnchorEl(null)
                }}
              > Assign Leads</MenuItem>

              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >
            <NewLeadDialog />
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&<>
        < LeadsTable
          lead={lead}
          setLead={setLead}
          selectAll={selectAll}
          selectedLeads={selectedLeads}
          setSelectedLeads={setSelectedLeads}
          setSelectAll={setSelectAll}
          leads={MemoData}
        />
        <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
      </>
      }
    </>

  )

}

