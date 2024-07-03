import { Delete, Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
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
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { ILeadTemplate } from '../../types/template.type'
import { ILead, IStage } from '../../types/crm.types'
import CreateOrEditLeadDialog from '../../components/dialogs/crm/CreateOrEditLeadDialog'
import { toTitleCase } from '../../utils/TitleCase'
import BulkDeleteUselessLeadsDialog from '../../components/dialogs/crm/BulkDeleteUselessLeadsDialog'

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
    gst: ""
  }
]


export default function LeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
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
  const [stage, setStage] = useState<string>();
  const [stages, setStages] = useState<IStage[]>([])

  const { data, isLoading, refetch } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page, stage: stage }))

  const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<IStage[]>, BackendError>("crm_stages", GetAllStages)

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter], async () => FuzzySearchLeads({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page, stage: stage }), {
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
          remarks: lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark || "",

        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeads])


  useEffect(() => {
    if (stageSuccess) {
      setStages(stagedata.data)
    }
  }, [stageSuccess, stages, stagedata])

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
          Leads {selectedLeads.length > 0 ? <span>(checked : {selectedLeads.length})</span> : `- ${leads.length}`}
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
            {LoggedInUser?.created_by._id === LoggedInUser?._id && <Tooltip title="Delete Selected Leads">
              <IconButton color="error"
                disabled={!LoggedInUser?.crm_access_fields.is_deletion_allowed}
                onClick={() => {
                  if (selectedLeads.length == 0)
                    alert("select some useless leads")
                  else
                    setChoice({ type: LeadChoiceActions.bulk_delete_useless_leads })
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>}

            < TextField
              select
              SelectProps={{
                native: true
              }}
              id="stage"
              size="small"
              label="Select Stage"
              sx={{ width: '200px' }}
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
              }
              }
            >
              <option key={0} value={'undefined'}>
                All
              </option>
              {
                stages.map(stage => {
                  return (<option key={stage._id} value={stage.stage}>
                    {toTitleCase(stage.stage)}
                  </option>)
                })
              }
            </TextField>
            {LoggedInUser?.is_admin && <UploadLeadsExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />}
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
              <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_lead })
                  setLead(undefined);
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              {LoggedInUser?.is_admin && < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditLeadDialog lead={undefined} />
            <BulkDeleteUselessLeadsDialog selectedLeads={selectedLeads} />
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 && <>
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

