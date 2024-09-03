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
import LeadsStageTable from '../../components/tables/crm/LeadsStageTable'
import {  GetAllStages } from '../../services/LeadsServices'
import CreateOrEditStageDialog from '../../components/dialogs/crm/CreateOrEditStageDialog'
import FindUknownCrmStagesDialog from '../../components/dialogs/crm/FindUknownCrmStagesDialog'
import { UserContext } from '../../contexts/userContext'
import { DropDownDto } from '../../dtos/common/dropdown.dto'

type ITemplate = {
  _id: string,
  stage: string
}
let template: ITemplate[] = [
  {
    _id: "qeqq6g54",
    stage: "open"
  }
]

export default function CrmStagesPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("crm_stages", GetAllStages)
  const [stage, setStage] = useState<DropDownDto>()
  const [stages, setStages] = useState<DropDownDto[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => stages, [stages])
  const [preFilteredData, setPreFilteredData] = useState<DropDownDto[]>([])
  const [selectedStages, setSelectedStages] = useState<DropDownDto[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ITemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "crm_stages_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedStages([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ITemplate[] = []
    selectedStages.map((stage) => {
      return data.push({
        _id: stage.id,
        stage: stage.value,
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedStages])

  useEffect(() => {
    if (isSuccess) {
      setStages(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, stages, data])


  useEffect(() => {
    if (filter) {
      if (stages) {
        const searcher = new FuzzySearch(stages, ["stage", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setStages(result)
      }
    }
    if (!filter)
      setStages(preFilteredData)

  }, [filter, stages])
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
          Stages {selectedStages.length > 0 ? <span>(checked : {selectedStages.length})</span> : `- ${stages.length}`}
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
          placeholder={`Search Stages `}
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
            {/* {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMStagesFromExcelButton is_editable} />} */}
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
              {LoggedInUser?.assigned_permissions.includes('leadstage_create')&&<MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_stage })
                  setStage(undefined)
                  setAnchorEl(null)
                }}
                
              > Add New</MenuItem>}

              {LoggedInUser?.assigned_permissions.includes('leadstage_create') &&<MenuItem
              sx={{color:'red'}}
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.find_unknown_stages })
                  setStage(undefined)
                  setAnchorEl(null)
                }}
                
              >Find Unknown Stages</MenuItem>}


              {LoggedInUser?.assigned_permissions.includes('leadstage_export') &&< MenuItem onClick={handleExcel}
                
              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditStageDialog />
            <FindUknownCrmStagesDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <LeadsStageTable
          stage={stage}
          selectAll={selectAll}
          selectedStages={selectedStages}
          setSelectedStages={setSelectedStages}
          setSelectAll={setSelectAll}
          stages={MemoData}
          setStage={setStage}
        />}

    </>

  )

}

