import { Box, Button, Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { BuildOutlined, Comment, Delete, Search ,  Edit, Share, Visibility, Download } from '@mui/icons-material'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchLeads, GetAllStages, GetLeads } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'
import UploadLeadsExcelButton from '../../components/buttons/UploadLeadsExcelButton';
import DBPagination from '../../components/pagination/DBpagination';
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
import { MaterialReactTable, MRT_ColumnDef, MRT_RowVirtualizer, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import CreateOrEditRemarkDialog from '../../components/dialogs/crm/CreateOrEditRemarkDialog'
import DeleteCrmItemDialog from '../../components/dialogs/crm/DeleteCrmItemDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import RemoveLeadReferralDialog from '../../components/dialogs/crm/RemoveLeadReferralDialog'
import ConvertLeadToReferDialog from '../../components/dialogs/crm/ConvertLeadToReferDialog'
import ReferLeadDialog from '../../components/dialogs/crm/ReferLeadDialog'
import PopUp from '../../components/popup/PopUp'
import BackHandIcon from '@mui/icons-material/BackHand';

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
  const [leadids, setLeadIds] = useState<string[]>([])
  const [leads, setLeads] = useState<ILead[]>([])
  const [preFilteredData, setPreFilteredData] = useState<ILead[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [stage, setStage] = useState<string>();
  const [stages, setStages] = useState<IStage[]>([])
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const { data, isLoading, refetch } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page, stage: stage }))
  const {user}=useContext(UserContext);
  const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<IStage[]>, BackendError>("crm_stages", GetAllStages)

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ leads: ILead[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter], async () => FuzzySearchLeads({ searchString: filter, limit: paginationData?.limit, page: paginationData?.page, stage: stage }), {
    enabled: false
  })
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel(data: any[]) {
    setAnchorEl(null)
    try {
      ExportToExcel(data, "leads_data")
      setSent(true)
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }


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

  const columns = useMemo<MRT_ColumnDef<ILead>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'action',
        header: 'Actions',
        Cell: ((row) => {
          
          return <PopUp
            element={
              <Stack direction="row" spacing={1}>

                {lead&&lead.referred_party &&
                  <Tooltip title="Remove Refrerral">
                    <IconButton color="error"
                      onClick={() => {

                        setChoice({ type: LeadChoiceActions.remove_referral })
                        setLead(row.row.original)

                      }}
                    >
                      <BackHandIcon />
                    </IconButton>
                  </Tooltip>}
                {lead &&!lead.referred_party &&
                  <Tooltip title="refer">
                    <IconButton color="primary"
                      onClick={() => {

                        setChoice({ type: LeadChoiceActions.refer_lead })
                        setLead(row.row.original)

                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>}

                {lead &&!lead.referred_party &&
                  <Tooltip title="convert to refer">
                    <IconButton color="primary"
                      onClick={() => {

                        setChoice({ type: LeadChoiceActions.convert_lead_to_refer })
                        setLead(row.row.original)

                      }}
                    >
                      <BuildOutlined />
                    </IconButton>
                  </Tooltip>}

                {user?.crm_access_fields.is_deletion_allowed &&
                  <Tooltip title="delete">
                    <IconButton color="error"
                      onClick={() => {
                        setChoice({ type: LeadChoiceActions.delete_crm_item })
                        setLead(row.row.original)

                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                }




                {user?.crm_access_fields.is_editable &&
                  <Tooltip title="edit">
                    <IconButton color="secondary"
                      onClick={() => {

                        setChoice({ type: LeadChoiceActions.create_or_edit_lead })
                        setLead(row.row.original)
                      }}

                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>}


                <Tooltip title="view remarks">
                  <IconButton color="primary"
                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.view_remarks })
                      setLead(row.row.original)


                    }}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add Remark">
                  <IconButton
                    color="success"
                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.create_or_edt_remark })
                      setLead(row.row.original)

                    }}
                  >
                    <Comment />
                  </IconButton>
                </Tooltip>

              </Stack>}
          />
        })

      },
      {
        accessorKey: 'name',
        header: 'Party Name',
        size: 350
      },
      {
        accessorKey: 'city',
        header: 'City',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: leads.map((i) => { return i.city }).filter(onlyUnique)

      },
      {
        accessorKey: 'state',
        header: 'State',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: leads.map((i) => { return i.state }).filter(onlyUnique)
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: leads.map((i) => { return i.state }).filter(onlyUnique)
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile1',
      },
      {
        accessorKey: 'mobile2',
        header: 'Mobile2',
      },
      {
        accessorKey: 'mobile3',
        header: 'Mobile3',
      },
      {
        accessorKey: 'gst',
        header: 'GST'
      },
      {
        accessorKey: 'lead_type',
        header: 'Lead Type',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: leads.map((i) => { return i.lead_type }).filter(onlyUnique)
      },
      {
        accessorKey: 'lead_source',
        header: 'Lead Source',
        aggregationFn: 'count',
        AggregatedCell: ({ cell }) => <div> {Number(cell.getValue())}</div>,
        filterVariant: 'multi-select',
        filterSelectOptions: leads.map((i) => { return i.lead_source }).filter(onlyUnique)
      },
      {
        accessorKey: 'turnover',
        header: 'Turn Over'
      },
      {
        accessorKey: 'work_description',
        header: 'Work Description'
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer Name',
      },
      {
        accessorKey: 'customer_designation',
        header: 'Customer Designation',
      },
      {
        accessorKey: 'referred_party_name',
        header: 'Refer Party',
      },
      {
        accessorKey: 'referred_party_mobile',
        header: 'Refer Mobile',
      },
      {
        accessorKey: 'referred_date',
        header: 'Refer Date',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'email2',
        header: 'Email2',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
      },
      {
        accessorKey: 'visiting_card',
        header: 'Visiting Card',
      }
    ],
    [leads,],
    //end
  );


  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  

  const table = useMaterialReactTable({
    columns,
    data: leads, //10,000 rows
    defaultDisplayColumn: { enableResizing: true },
    enableBottomToolbar: false,
    enableGlobalFilter: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        fontSize: '13px',
        border: '1px solid #ddd;'
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {LoggedInUser?.is_admin &&<Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={()=>handleExcel(leads)}
          startIcon={<Download />}
        >
          Export All Data
        </Button>}
        {LoggedInUser?.created_by._id === LoggedInUser?._id && LoggedInUser ?.crm_access_fields.is_deletion_allowed&&<Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => {
            if (leadids.length == 0)
              alert("select some useless leads")
            else{
              setLeadIds(table.getSelectedRowModel().rows.map((item) => { return item.original._id }))
              setChoice({ type: LeadChoiceActions.bulk_delete_useless_leads })
            }
          }
          }
          startIcon={<Delete />}
        >
          Delete
        </Button>}
       
        {LoggedInUser?.is_admin &&<Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => {
            handleExcel(table.getSelectedRowModel().rows.map((item)=>{return item.original}))}
          }
          startIcon={<Download />}
        >
          Export Selected Rows
        </Button>}
      </Box>
    ),
    enableGrouping: true,
    enableRowSelection: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableColumnPinning: true,
    enableTableFooter: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    muiTableContainerProps: { sx: { maxHeight: '400px' } },
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
  });
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
              {LoggedInUser?.is_admin && < MenuItem onClick={() => handleExcel(template)}
              >Export Template</MenuItem>}
            </Menu >
            <CreateOrEditLeadDialog lead={lead} />
            <BulkDeleteUselessLeadsDialog selectedLeadsIds={leadids} />
          </>
        </Stack >
      </Stack >
      {/* table */}
      {isLoading && <TableSkeleton />}
      {leads && leads.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && leads.length > 0 && <>
        <MaterialReactTable table={table} />
      </>
      }
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
      {
        lead ?
          <>
            <CreateOrEditRemarkDialog lead={lead} />
            <DeleteCrmItemDialog lead={lead} />
            <ViewRemarksDialog lead={lead} />
            <ReferLeadDialog lead={lead} />
            <RemoveLeadReferralDialog lead={lead} />
            <ConvertLeadToReferDialog lead={lead} />
          </>
          : null
      }
    </>

  )

}

