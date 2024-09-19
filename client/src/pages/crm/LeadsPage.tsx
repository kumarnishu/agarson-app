import { BuildOutlined, Comment, Delete, Edit, Search, Share, Visibility } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { FuzzySearchLeads, GetAllStages, GetLeads } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'
import { BackendError } from '../..'
import { toTitleCase } from '../../utils/TitleCase'
import { GetLeadDto } from '../../dtos/crm/crm.dto'
import { DropDownDto } from '../../dtos/common/dropdown.dto'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import CreateOrEditLeadDialog from '../../components/dialogs/crm/CreateOrEditLeadDialog'
import MergeTwoLeadsDialog from '../../components/dialogs/crm/MergeTwoLeadsDialog'
import BulkDeleteUselessLeadsDialog from '../../components/dialogs/crm/BulkDeleteUselessLeadsDialog'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import UploadLeadsExcelButton from '../../components/buttons/UploadLeadsExcelButton'
import { Menu as MenuIcon } from '@mui/icons-material';
import DBPagination from '../../components/pagination/DBpagination'
import ExportToExcel from '../../utils/ExportToExcel'
import PopUp from '../../components/popup/PopUp'
import BackHandIcon from '@mui/icons-material/BackHand';
import CreateOrEditRemarkDialog from '../../components/dialogs/crm/CreateOrEditRemarkDialog'
import DeleteCrmItemDialog from '../../components/dialogs/crm/DeleteCrmItemDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import RemoveLeadReferralDialog from '../../components/dialogs/crm/RemoveLeadReferralDialog'
import ConvertLeadToReferDialog from '../../components/dialogs/crm/ConvertLeadToReferDialog'
import ReferLeadDialog from '../../components/dialogs/crm/ReferLeadDialog'
import { DownloadFile } from '../../utils/DownloadFile'

export default function LeadsPage() {
  const [paginationData, setPaginationData] = useState({ limit: 20, page: 1, total: 1 });
  const [filter, setFilter] = useState<string | undefined>()
  const { user: LoggedInUser } = useContext(UserContext)
  const [lead, setLead] = useState<GetLeadDto>()
  const [leads, setLeads] = useState<GetLeadDto[]>([])
  const [preFilteredData, setPreFilteredData] = useState<GetLeadDto[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 20, page: 1, total: 1 });
  const [filterCount, setFilterCount] = useState(0)
  const [stage, setStage] = useState<string>();
  const [stages, setStages] = useState<DropDownDto[]>([])
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { data, isLoading, refetch } = useQuery<AxiosResponse<{ result: GetLeadDto[], page: number, total: number, limit: number }>, BackendError>(["leads", paginationData], async () => GetLeads({ limit: paginationData?.limit, page: paginationData?.page, stage: stage }))

  const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("crm_stages", GetAllStages)

  const { data: fuzzyleads, isLoading: isFuzzyLoading, refetch: refetchFuzzy } = useQuery<AxiosResponse<{ result: GetLeadDto[], page: number, total: number, limit: number }>, BackendError>(["fuzzyleads", filter, LoggedInUser], async () => FuzzySearchLeads({ user: LoggedInUser, searchString: filter, limit: paginationData?.limit, page: paginationData?.page, stage: stage }), {
    enabled: false
  })
  const [sorting, setSorting] = useState<MRT_SortingState>([]);


  useEffect(() => {
    if (stageSuccess && stagedata.data) {
      let tmp: DropDownDto[] = stagedata.data;

      if (!LoggedInUser?.assigned_permissions.includes('show_leads_useless')) {
        tmp = tmp.filter((stage) => { return stage.value !== 'useless' })
      }
      if (!LoggedInUser?.assigned_permissions.includes('show_refer_leads')) {
        tmp = tmp.filter((stage) => { return stage.value !== 'refer' })
      }
      setStages(tmp)
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
  const columns = useMemo<MRT_ColumnDef<GetLeadDto>[]>(
    //column definitions...
    () => leads && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        Footer: <b></b>,
        size: 120,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row" spacing={1}>

              {cell.row.original.referred_party_name && LoggedInUser?.assigned_permissions.includes('leads_edit') &&
                <Tooltip title="Remove Refrerral">
                  <IconButton color="error"

                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.remove_referral })
                      setLead(lead)

                    }}
                  >
                    <BackHandIcon />
                  </IconButton>
                </Tooltip>}
              {!cell.row.original.referred_party_name && LoggedInUser?.assigned_permissions.includes('leads_edit') &&
                <Tooltip title="refer">
                  <IconButton color="primary"

                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.refer_lead })
                      setLead(cell.row.original)

                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>}

              {!cell.row.original.referred_party_name && LoggedInUser?.assigned_permissions.includes('leads_edit') &&
                <Tooltip title="convert to refer">
                  <IconButton color="primary"

                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.convert_lead_to_refer })
                      setLead(cell.row.original)

                    }}
                  >
                    <BuildOutlined />
                  </IconButton>
                </Tooltip>}


              {LoggedInUser?.assigned_permissions.includes('leads_delete') && <Tooltip title="delete">
                <IconButton color="error"

                  onClick={() => {
                    setChoice({ type: LeadChoiceActions.delete_crm_item })
                    setLead(cell.row.original)

                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>}





              {LoggedInUser?.assigned_permissions.includes('leads_edit') &&
                <Tooltip title="edit">
                  <IconButton color="secondary"

                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.create_or_edit_lead })
                      setLead(cell.row.original)
                    }}

                  >
                    <Edit />
                  </IconButton>
                </Tooltip>}


              {LoggedInUser?.assigned_permissions.includes('leads_view') && <Tooltip title="view remarks">
                <IconButton color="primary"

                  onClick={() => {

                    setChoice({ type: LeadChoiceActions.view_remarks })
                    setLead(cell.row.original)


                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>}
              {LoggedInUser?.assigned_permissions.includes('leads_edit') &&
                <Tooltip title="Add Remark">
                  <IconButton

                    color="success"
                    onClick={() => {

                      setChoice({ type: LeadChoiceActions.create_or_edt_remark })
                      setLead(cell.row.original)

                    }}
                  >
                    <Comment />
                  </IconButton>
                </Tooltip>}

            </Stack>}
        />
      },

      {
        accessorKey: 'name',
        header: 'Name',
        size: 350,
        filterVariant: 'multi-select',
        Cell: (cell) => <>{cell.row.original.name ? cell.row.original.name : ""}</>,
        filterSelectOptions: leads && leads.map((i) => {
          return i.name;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'multi-select',
        size: 120,
        Cell: (cell) => <>{cell.row.original.city ? cell.row.original.city : ""}</>,
        filterSelectOptions: leads && leads.map((i) => {
          return i.city;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'state',
        header: 'State',
        filterVariant: 'multi-select',
        size: 120,
        Cell: (cell) => <>{cell.row.original.state ? cell.row.original.state : ""}</>,
        filterSelectOptions: leads && leads.map((i) => {
          return i.state;
        }).filter(onlyUnique)
      },
      {
        accessorKey: 'stage',
        header: 'Stage',
        size: 120,
        Cell: (cell) => <>{cell.row.original.stage ? cell.row.original.stage : ""}</>
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile1',
        size: 120,
        Cell: (cell) => <>{cell.row.original.mobile ? cell.row.original.mobile : ""}</>
      }, {
        accessorKey: 'alternate_mobile1',
        header: 'Mobile2',
        size: 120,
        Cell: (cell) => <>{cell.row.original.alternate_mobile1 ? cell.row.original.alternate_mobile1 : ""}</>
      }, {
        accessorKey: 'alternate_mobile2',
        header: 'Mobile3',
        size: 120,
        Cell: (cell) => <>{cell.row.original.alternate_mobile2 ? cell.row.original.alternate_mobile2 : ""}</>
      },
      {
        accessorKey: 'remark',
        header: 'Last Remark',
        size: 120,
        Cell: (cell) => <>{cell.row.original.remark ? cell.row.original.remark : ""}</>
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer',
        size: 120,
        Cell: (cell) => <>{cell.row.original.customer_name ? cell.row.original.customer_name : ""}</>
      }
      , {
        accessorKey: 'customer_designation',
        header: 'Designitaion',
        size: 120,
        Cell: (cell) => <>{cell.row.original.customer_designation ? cell.row.original.customer_designation : ""}</>
      },
      {
        accessorKey: 'referred_party_name',
        header: 'Refer Party',
        size: 120,
        Cell: (cell) => <>{cell.row.original.referred_party_name ? cell.row.original.remark : ""}</>
      },
      {
        accessorKey: 'referred_party_mobile',
        header: 'Refer Mobile',
        size: 120,
        Cell: (cell) => <>{cell.row.original.referred_party_mobile ? cell.row.original.referred_party_mobile : ""}</>
      },
      {
        accessorKey: 'referred_date',
        header: 'Refer Date',
        size: 120,
        Cell: (cell) => <>{cell.row.original.referred_date ? cell.row.original.referred_date : ""}</>
      }
      ,
      {
        accessorKey: 'email',
        header: 'Email',
        size: 120,
        Cell: (cell) => <>{cell.row.original.email ? cell.row.original.email : ""}</>
      }
      ,
      {
        accessorKey: 'alternate_email',
        header: 'Email2',
        size: 120,
        Cell: (cell) => <>{cell.row.original.alternate_email ? cell.row.original.alternate_email : ""}</>
      }
      ,

      {
        accessorKey: 'address',
        header: 'Address',
        size: 320,
        Cell: (cell) => <>{cell.row.original.address ? cell.row.original.address : ""}</>
      },
      {
        accessorKey: 'source',
        header: 'Lead Source',
        size: 120,
        Cell: (cell) => <>{cell.row.original.lead_source ? cell.row.original.lead_source : ""}</>
      },
      {
        accessorKey: 'type',
        header: 'Lead Type',
        size: 120,
        Cell: (cell) => <>{cell.row.original.lead_type ? cell.row.original.lead_type : ""}</>
      },
      {
        accessorKey: 'country',
        header: 'Country',
        size: 120,
        Cell: (cell) => <>{cell.row.original.country ? cell.row.original.country : ""}</>
      },
      {
        accessorKey: 'created_at',
        header: 'Created on',
        size: 120,
        Cell: (cell) => <>{cell.row.original.created_at ? cell.row.original.created_at : ""}</>
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated on',
        size: 120,
        Cell: (cell) => <>{cell.row.original.updated_at ? cell.row.original.updated_at : ""}</>
      },
      {
        accessorKey: 'created_by',
        header: 'Creator',
        size: 120,
        Cell: (cell) => <>{cell.row.original.created_by.label ? cell.row.original.created_by.label : ""}</>
      },
      {
        accessorKey: 'updated_by',
        header: 'Updated By',
        size: 120,
        Cell: (cell) => <>{cell.row.original.updated_by.label ? cell.row.original.updated_by.label : ""}</>
      },
      {
        accessorKey: 'visiting_card',
        header: 'Visiting Card',
        size: 120,
        Cell: (cell) => <span onDoubleClick={() => {
          if (cell.row.original.visiting_card && cell.row.original.visiting_card) {
            DownloadFile(cell.row.original.visiting_card, 'visiting card')
          }
        }}>
          {cell.row.original.visiting_card && cell.row.original.visiting_card ? < img height="20" width="55" src={cell.row.original.visiting_card && cell.row.original.visiting_card} alt="visiting card" /> : "na"}</span>
      },
    ],
    [leads],
    //end
  );


  const table = useMaterialReactTable({
    columns,
    data: leads, //10,000 rows       
    enableColumnResizing: true,
    enableColumnVirtualization: true, enableStickyFooter: true,
    muiTableFooterRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white',
        fontSize: '14px'
      }
    }),
    muiTableContainerProps: (table) => ({
      sx: { height: table.table.getState().isFullScreen ? 'auto' : '400px' }
    }),
    muiTableHeadRowProps: () => ({
      sx: {
        backgroundColor: 'whitesmoke',
        color: 'white'
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: {
        border: '1px solid #c2beba;'
      },
    }),
    initialState: { density: 'compact' },
    enableRowSelection: true,
    enableRowNumbers: true,
    enableColumnPinning: true,
    onSortingChange: setSorting,
    enableTableFooter: true,
    enableRowVirtualization: true,
    state: { isLoading, sorting },
    enableBottomToolbar: false,
    enableGlobalFilter: false,
    manualFiltering: true,
    manualPagination: true
  });

  return (
    <>
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
                  let data: any[] = [];
                  data = table.getSelectedRowModel().rows.filter((lead) => { return lead.original.stage === 'useless' })
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
                  if (table.getSelectedRowModel().rows.length == 2) {
                    setChoice({ type: LeadChoiceActions.merge_leads })
                    setLead(undefined);
                    setAnchorEl(null)
                  } else {
                    alert("please select two leads only");
                    setLead(undefined);
                    setAnchorEl(null)
                    return;
                  }
                }
                }
              > Merge Leads</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('leads_export') && < MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}

              >Export All</MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('leads_export') && < MenuItem onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}

              >Export Selected</MenuItem>}

            </Menu >
            <CreateOrEditLeadDialog lead={lead} />
            {table.getSelectedRowModel().rows.length == 2 && <MergeTwoLeadsDialog leads={table.getSelectedRowModel().rows.map((l) => { return l.original })} removeSelectedLeads={() => { table.resetRowSelection() }} />}
            {table.getSelectedRowModel().rows && table.getSelectedRowModel().rows.length > 0 && <BulkDeleteUselessLeadsDialog selectedLeads={table.getSelectedRowModel().rows.map((l) => { return l.original })} removeSelectedLeads={() => { table.resetRowSelection() }} />}
          </>
        </Stack >
      </Stack >
      {
        isLoading || isFuzzyLoading && <LinearProgress />
      }

      {
        lead ?
          <>
            <CreateOrEditRemarkDialog lead={lead ? {
              _id: lead._id,
              has_card: lead.has_card
            } : undefined} />
            <DeleteCrmItemDialog lead={lead ? { id: lead._id, value: lead.name, label: lead.name } : undefined} />
            <ViewRemarksDialog id={lead._id} />
            <ReferLeadDialog lead={lead} />
            <RemoveLeadReferralDialog lead={lead} />
            <ConvertLeadToReferDialog lead={lead} />
          </>
          : null
      }
      <MaterialReactTable table={table} />
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />

    </>

  )

}