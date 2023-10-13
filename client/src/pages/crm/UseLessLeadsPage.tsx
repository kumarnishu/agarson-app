import { Delete, Search } from '@mui/icons-material'
import { Box, Fade, IconButton, LinearProgress, Menu, MenuItem,  TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchUselessLeads, GetUselessLeads } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'
import DBPagination from '../../components/pagination/DBpagination';
import LeadsTable from '../../components/tables/LeadsTable';
import ReactPagination from '../../components/pagination/ReactPagination'
import { BackendError } from '../..'
import { GetUsers } from '../../services/UserServices'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import BulkDeleteUselessLeadsDialog from '../../components/dialogs/crm/BulkDeleteUselessLeadsDialog'
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import NewLeadDialog from '../../components/dialogs/crm/NewLeadDialog'
import AlertBar from '../../components/snacks/AlertBar'
import { ILead, ILeadTemplate } from '../../types/crm.types'
import { IUser } from '../../types/user.types'

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
    lead_owners: "nishu,sandeep",
    is_customer: false,
    last_whatsapp_date: new Date(),
    created_at: new Date(),
    created_by_username: "nishu",
    updated_at: new Date(),
    updated_by_username: "nishu",
  }
]
export default function UseLessLeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [reactPaginationData, setReactPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [userId, setUserid] = useState<string>()
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [lead, setLead] = useState<ILead>()
  const [leads, setLeads] = useState<ILead[]>([])
  const [allfuzzyleads, setAllFuzzyLeads] = useState<ILead[]>([])
  const FuzzyMemoData = React.useMemo(() => allfuzzyleads, [allfuzzyleads])

  // pagination  states
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + reactPaginationData.limit;
  const currentItems = FuzzyMemoData.slice(itemOffset, endOffset)


  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => leads, [leads])
  const [preFilteredData, setPreFilteredData] = useState<ILead[]>([])
  const [selectedLeads, setSelectedLeads] = useState<ILead[]>([])
  const { data: users } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

  const { data, isSuccess, isLoading, refetch } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["leads_useless", paginationData], async () => GetUselessLeads({ id: userId, limit: paginationData?.limit, page: paginationData?.page }))

  const { data: fuzzyLeads, isSuccess: isFuzzySuccess, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<ILead[]>, BackendError>(["fuzzyleads_useless", filter], async () => FuzzySearchUselessLeads({ searchString: filter, id: userId }), {
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
          remarks: lead.last_remark || "",
          is_customer: lead.is_customer,
          last_whatsapp_date: lead.last_whatsapp_date,
          created_at: lead.created_at,
          created_by_username: lead.created_by.username,
          updated_at: lead.updated_at,
          updated_by_username: lead.updated_by.username,
          lead_owners: lead.lead_owners_username.toString()
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeads])


  useEffect(() => {
    if (isSuccess) {
      setLeads((data.data.leads))
      setPreFilteredData(data.data.leads)
      setPaginationData({
        ...paginationData,
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total
      })
    }
  }, [isSuccess, data])



  useEffect(() => {
    if (userId && filter) {
      refetchFuzzy()
    }
    else
      refetch()
  }, [userId, filter])

  useEffect(() => {
    if (!filter)
      setLeads(preFilteredData)
  }, [filter])


  useEffect(() => {
    if (isFuzzySuccess) {
      setAllFuzzyLeads(fuzzyLeads.data)
      setReactPaginationData({
        ...reactPaginationData,
        total: Math.ceil(fuzzyLeads.data.length / reactPaginationData.limit)
      })
    }
  }, [isFuzzySuccess, fuzzyLeads])

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
          sx={{ pl: 1, color: 'grey' }}

        >
          Useless
        </Typography>
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            {LoggedInUser && LoggedInUser._id === LoggedInUser?.created_by._id && <Tooltip title="Delete Selected Leads">
              <IconButton color="error"
                onClick={() => setChoice({ type: LeadChoiceActions.bulk_delete_useless_leads })}
              >
                <Delete />
              </IconButton>
            </Tooltip>}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <select onChange={(e) => { setUserid(e.target.value) }}
                style={{ borderColor: 'blue', border: 'none', height: '40px' }}
              >
                <option key={0} value={undefined}>

                </option>
                {users?.data && users.data.map((user) => {
                  return (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  )
                })}
              </select>
            </Box>
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
                <MenuItem
                  onClick={() => {
                    setChoice({ type: LeadChoiceActions.create_lead })
                    setAnchorEl(null)
                  }}
                > Add New</MenuItem>

                < MenuItem onClick={handleExcel}
                >Export To Excel</MenuItem>
              
            </Menu >
            <NewLeadDialog />
          </>
        </Stack>
      </Stack >
      {/* table */}
      <LeadsTable
        lead={lead}
        setLead={setLead}
        selectAll={selectAll}
        selectedLeads={selectedLeads}
        setSelectedLeads={setSelectedLeads}
        setSelectAll={setSelectAll}
        leads={filter ? currentItems : MemoData}
        selectableLeads={filter ? allfuzzyleads : leads}
      />

      {!filter ? <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} /> :
        <ReactPagination reactPaginationData={reactPaginationData} setReactPaginationData={setReactPaginationData} data={FuzzyMemoData}
        />
      }
      {selectedLeads && selectedLeads.length > 0 && <BulkDeleteUselessLeadsDialog selectedLeads={selectedLeads} />}
    </>

  )

}

