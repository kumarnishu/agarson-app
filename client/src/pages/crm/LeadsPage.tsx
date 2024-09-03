import { Delete, Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchLeads, GetAllStages, GetLeads } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'
import UploadLeadsExcelButton from '../../components/buttons/UploadLeadsExcelButton';
import DBPagination from '../../components/pagination/DBpagination';
import LeadsTable from '../../components/tables/crm/LeadsTable';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import CreateOrEditLeadDialog from '../../components/dialogs/crm/CreateOrEditLeadDialog'
import { toTitleCase } from '../../utils/TitleCase'
import BulkDeleteUselessLeadsDialog from '../../components/dialogs/crm/BulkDeleteUselessLeadsDialog'
import MergeTwoLeadsDialog from '../../components/dialogs/crm/MergeTwoLeadsDialog'
import { CreateAndUpdatesLeadFromExcelDto, GetLeadDto } from '../../dtos/crm/crm.dto'
import { DropDownDto } from '../../dtos/common/dropdown.dto'


let template: CreateAndUpdatesLeadFromExcelDto[] = [
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
    gst: ""
  }
]


export default function LeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [lead, setLead] = useState<GetLeadDto>()
  const [leads, setLeads] = useState<GetLeadDto[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [preFilteredData, setPreFilteredData] = useState<GetLeadDto[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<GetLeadDto[]>([])
  const [stage, setStage] = useState<string>();
  const [stages, setStages] = useState<DropDownDto[]>([])

  const { data, isLoading, refetch } = useQuery<AxiosResponse<{ result: GetLeadDto[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page, stage: stage }))

  const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("crm_stages", GetAllStages)

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ result: GetLeadDto[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter, LoggedInUser], async () => FuzzySearchLeads({ user: LoggedInUser, searchString: filter, limit: paginationData?.limit, page: paginationData?.page, stage: stage }), {
    enabled: false
  })
  const [selectedData, setSelectedData] = useState<CreateAndUpdatesLeadFromExcelDto[]>(template)
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
    let data: CreateAndUpdatesLeadFromExcelDto[] = []
    selectedLeads.map((lead) => {
      return data.push(

        {
          _id: lead._id,
          name: lead.name,
          customer_name: lead.customer_name,
          customer_designation: lead.customer_designation,
          mobile: lead.mobile,
          gst: lead.gst,
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

        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeads])


  useEffect(() => {
    if (stageSuccess && stagedata.data) {
      if (LoggedInUser?.assigned_permissions.includes('show_leads_useless')) {
        setStages(stagedata.data)
      }
      else {
        let stagess = stagedata.data.filter((stage) => { return stage.value !== 'useless' })
        setStages(stagess)
      }

    }
  }, [stageSuccess])

  useEffect(() => {

    if (!filter) {
      setLeads(preFilteredData)
      setPaginationData(preFilteredPaginationData)
    }
    if (stage && !filter) {
      refetch();
    }


  }, [filter, stage])



  useEffect(() => {
    if (filter) {
      refetchFuzzy()
    }
  }, [paginationData])

  useEffect(() => {
    if (data && !filter) {
      setLeads(data.data.result)
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
    if (fuzzyleads && filter) {
      setLeads(fuzzyleads.data.result)
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
        isFuzzyLoading && <LinearProgress color='success' />
      }
      {/*heading, search bar and table menu */}

      <Stack
        spacing={1}
        padding={1}
        direction="row"
        justifyContent="space-between"

      >

        <Typography
          variant={'h6'}
          component={'h1'}
          sx={{ pl: 1 }}
        >
          Leads 
        </Typography>

        <TextField
          sx={{ width: '40vw' }}
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
          placeholder={`Search Leads `}
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
          < Stack direction="row" spacing={2} >
            {LoggedInUser?._id === LoggedInUser?.created_by.id && LoggedInUser?.assigned_permissions.includes('leads_delete') && <Tooltip title="Delete Selected Leads">
              <IconButton color="error"

                onClick={() => {
                  let data: GetLeadDto[] = [];
                  data = selectedLeads.filter((lead) => { return lead.stage === 'useless' })
                  if (data.length == 0)
                    alert("select some useless leads")
                  else
                    setChoice({ type: LeadChoiceActions.bulk_delete_useless_leads })
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>}

            <Select
              sx={{ m: 1, width: 300 }}
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
              }}
              size='small'
            >
              <MenuItem
                key={'00'}
                value={undefined}
              >
                All
              </MenuItem>
              {stages.map((stage, index) => (
                <MenuItem
                  key={index}
                  value={stage.value}
                >
                  {toTitleCase(stage.label)}
                </MenuItem>
              ))}
            </Select>


            {LoggedInUser?.assigned_permissions.includes('leads_create') && <UploadLeadsExcelButton />}
          </Stack >
          <>

            {sent && <AlertBar message="File Exported Successfuly" color="success" />}

            {/* stage */}


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
              {LoggedInUser?.assigned_permissions.includes('leads_create') && <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_lead })
                  setLead(undefined);
                  setAnchorEl(null)
                }}


              > Add New</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('leads_merge') && <MenuItem
                onClick={() => {
                  if (selectedLeads.length == 2) {
                    setChoice({ type: LeadChoiceActions.merge_leads })
                    setLead(undefined);
                    setAnchorEl(null)
                  }
                }
                }
              > Merge Leads</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('leads_export') && < MenuItem onClick={handleExcel}

              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditLeadDialog lead={undefined} />
            {selectedLeads && selectedLeads.length == 2 && <MergeTwoLeadsDialog leads={selectedLeads} />}
            {selectedLeads && selectedLeads.length > 0 && <BulkDeleteUselessLeadsDialog selectedLeads={selectedLeads} />}
          </>
        </Stack >
      </Stack >

      < LeadsTable
        lead={lead}
        setLead={setLead}
        selectAll={selectAll}
        selectedLeads={selectedLeads}
        setSelectedLeads={setSelectedLeads}
        setSelectAll={setSelectAll}
        leads={leads}
      />

      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
    </>

  )

}
