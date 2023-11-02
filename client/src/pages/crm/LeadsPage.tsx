import { Search } from '@mui/icons-material'
import { Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
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
import { ILead, ILeadTemplate } from '../../types/crm.types'

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
    created_at: new Date(),
    updated_at: new Date(),
  }
]


export default function LeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [lead, setLead] = useState<ILead>()
  const [leads, setLeads] = useState<ILead[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => leads, [leads])
  const [preFilteredData, setPreFilteredData] = useState<ILead[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 10, page: 1, total: 1 });
  const [selectedLeads, setSelectedLeads] = useState<ILead[]>([])

  const { data, isLoading } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page }))

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter], async () => FuzzySearchLeads({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page }), {
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
          created_at: lead.created_at,
          updated_at: lead.updated_at,
          lead_owners: lead.lead_owners.map(owner => { owner.username + "," }).toString()
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeads])

  useEffect(() => {
    if (!filter) {
      setLeads(preFilteredData)
      setPaginationData(preFilteredPaginationData)
    }
  }, [filter])

  useEffect(() => {
    if (data) {
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
    if (fuzzyleads) {
      setLeads(fuzzyleads.data.leads)
      setPaginationData({
        ...paginationData,
        page: fuzzyleads.data.page,
        limit: fuzzyleads.data.limit,
        total: fuzzyleads.data.total
      })
    }
  }, [fuzzyleads])
  console.log(selectedLeads)
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
          Leads
        </Typography>

        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            <UploadLeadsExcelButton disabled={Boolean(!LoggedInUser?.crm_access_fields.is_deletion_allowed)} />
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
        </Stack >
      </Stack >
      {/* table */}
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

  )

}

