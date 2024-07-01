import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { ChoiceContext, LeadChoiceActions, } from '../../contexts/dialogContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import CreateOrEditLeadSourceDialog from '../../components/dialogs/crm/CreateOrEditLeadSourceDialog'
import { ILeadSource } from '../../types/crm.types'
import { GetAllSources } from '../../services/LeadsServices'
import LeadsLeadSourceTable from '../../components/tables/crm/LeadsSourceTable'

type ITemplate = {
  _id: string,
  source: string
}
let template: ITemplate[] = [
  {
    _id: "qeqq6g54",
    source: "internet"
  }
]

export default function CrmLeadSourcesPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<ILeadSource[]>, BackendError>("crm_sources", GetAllSources)
  const [source, setLeadSource] = useState<ILeadSource>()
  const [sources, setLeadSources] = useState<ILeadSource[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => sources, [sources])
  const [preFilteredData, setPreFilteredData] = useState<ILeadSource[]>([])
  const [selectedLeadSources, setSelectedLeadSources] = useState<ILeadSource[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ITemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);


  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "crm_sources_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedLeadSources([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ITemplate[] = []
    selectedLeadSources.map((source) => {
      return data.push({
        _id: source._id,
        source: source.source,
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedLeadSources])

  useEffect(() => {
    if (isSuccess) {
      setLeadSources(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, sources, data])


  useEffect(() => {
    if (filter) {
      if (sources) {
        const searcher = new FuzzySearch(sources, ["source", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setLeadSources(result)
      }
    }
    if (!filter)
      setLeadSources(preFilteredData)

  }, [filter, sources])
  return (
    <>
      {
        isLoading && <LinearProgress />
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
          LeadSources {selectedLeadSources.length > 0 ? <span>(checked : {selectedLeadSources.length})</span> : `- ${sources.length}`}
        </Typography>

        <TextField
          sx={{ width: '50vw' }}
          size="small"
          onChange={(e) => {
            setFilter(e.currentTarget.value)
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ cursor: 'pointer' }} />
              </InputAdornment>
            ),
          }}
          placeholder={`Search LeadSources `}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
        <Stack
          direction="row"
        >
          {/* search bar */}
          < Stack direction="row" spacing={2}>
            {/* {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMLeadSourcesFromExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />} */}
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
                  setChoice({ type: LeadChoiceActions.create_or_edit_source })
                  setLeadSource(undefined)
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>

              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >
            <CreateOrEditLeadSourceDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <LeadsLeadSourceTable
          source={source}
          selectAll={selectAll}
          selectedLeadSources={selectedLeadSources}
          setSelectedLeadSources={setSelectedLeadSources}
          setSelectAll={setSelectAll}
          sources={MemoData}
          setLeadSource={setLeadSource}
        />}

    </>

  )

}

