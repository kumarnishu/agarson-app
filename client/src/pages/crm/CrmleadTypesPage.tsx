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
import CreateOrEditLeadTypeDialog from '../../components/dialogs/crm/CreateOrEditLeadTypeDialog'
import { ILeadType } from '../../types/crm.types'
import LeadsTypeTable from '../../components/tables/crm/LeadsTypesTable'
import { GetAllLeadTypes } from '../../services/LeadsServices'
import { UserContext } from '../../contexts/userContext'

type ITemplate = {
  _id: string,
  type: string
}
let template: ITemplate[] = [
  {
    _id: "qeqq6g54",
    type: "internet"
  }
]

export default function CrmTypesPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<ILeadType[]>, BackendError>("crm_types", GetAllLeadTypes)
  const [type, setLeadType] = useState<ILeadType>()
  const [types, setTypes] = useState<ILeadType[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => types, [types])
  const [preFilteredData, setPreFilteredData] = useState<ILeadType[]>([])
  const [selectedTypes, setSelectedTypes] = useState<ILeadType[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<ITemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { user: LoggedInUser } = useContext(UserContext)

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "crm_types_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedTypes([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: ITemplate[] = []
    selectedTypes.map((type) => {
      return data.push({
        _id: type._id,
        type: type.type,
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedTypes])

  useEffect(() => {
    if (isSuccess) {
      setTypes(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, types, data])


  useEffect(() => {
    if (filter) {
      if (types) {
        const searcher = new FuzzySearch(types, ["type", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setTypes(result)
      }
    }
    if (!filter)
      setTypes(preFilteredData)

  }, [filter, types])
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
          Types {selectedTypes.length > 0 ? <span>(checked : {selectedTypes.length})</span> : ''}
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
          placeholder={`Search Types `}
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
            {/* {LoggedInUser?.crm_access_fields.is_editable && <UploadCRMTypesFromExcelButton disabled={!LoggedInUser?.crm_access_fields.is_editable} />} */}
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
              {LoggedInUser?.assigned_permissions.includes("leadtype_create")&& <MenuItem
                onClick={() => {
                  setChoice({ type: LeadChoiceActions.create_or_edit_leadtype })
                  setLeadType(undefined)
                  setAnchorEl(null)
                }}
              
              > Add New</MenuItem>}

              {LoggedInUser?.assigned_permissions.includes("leadtype_export") &&  < MenuItem onClick={handleExcel}
              
              >Export To Excel</MenuItem>}

            </Menu >
            <CreateOrEditLeadTypeDialog />
          </>
        </Stack >
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <LeadsTypeTable
          type={type}
          selectAll={selectAll}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          setSelectAll={setSelectAll}
          types={MemoData}
          setType={setLeadType}
        />}

    </>

  )

}

