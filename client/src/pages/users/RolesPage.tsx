import { Search } from '@mui/icons-material'
import { Fade, IconButton, InputAdornment, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import FuzzySearch from "fuzzy-search";
import ExportToExcel from '../../utils/ExportToExcel'
import { Menu as MenuIcon } from '@mui/icons-material';
import AlertBar from '../../components/snacks/AlertBar'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { IRole } from '../../types/user.types'
import { IRoleTemplate } from '../../types/template.type'
import { GetRoles } from '../../services/UserServices'
import { ChoiceContext, UserChoiceActions } from '../../contexts/dialogContext'
import CreateOrEditRoleDialog from '../../components/dialogs/users/CreateOrEditRoleDialog'
import AssignRolesDialog from '../../components/dialogs/users/AssignRolesDialog'
import RolesTable from '../../components/tables/users/RolesTable'


let template: IRoleTemplate[] = [
  {
    _id: "",
    role: "delhi",
    permissions: ['View Production']
  }
]

export default function RolesPage() {
  const [flag, setFlag] = useState(1);
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IRole[]>, BackendError>("roles", GetRoles)
  const [role, setRole] = useState<IRole>()
  const [roles, setRoles] = useState<IRole[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => roles, [roles])
  const [preFilteredData, setPreFilteredData] = useState<IRole[]>([])
  const [selectedRoles, setSelectedRoles] = useState<IRole[]>([])
  const [filter, setFilter] = useState<string | undefined>()
  const [selectedData, setSelectedData] = useState<IRoleTemplate[]>(template)
  const [sent, setSent] = useState(false)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      ExportToExcel(selectedData, "roles_data")
      setSent(true)
      setSelectAll(false)
      setSelectedData([])
      setSelectedRoles([])
    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }

  // refine data
  useEffect(() => {
    let data: IRoleTemplate[] = []
    selectedRoles.map((role) => {
      return data.push({
        _id: role._id,
        role: role.role,
        permissions: role.permissions
      })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedRoles])

  useEffect(() => {
    if (isSuccess) {
      setRoles(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, data])


  useEffect(() => {
    if (filter) {
      if (roles) {
        const searcher = new FuzzySearch(roles, ["role.role", "users.username"], {
          caseSensitive: false,
        });
        const result = searcher.search(filter);
        setRoles(result)
      }
    }
    if (!filter)
      setRoles(preFilteredData)

  }, [filter])
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
        >
          Roles
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
          placeholder={`Search Roles `}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
        <Stack
          direction="row"
        >

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
                  setChoice({ type: UserChoiceActions.create_or_edit_role })
                  setRole(undefined)
                  setAnchorEl(null)
                }}
              > Add New</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedRoles && selectedRoles.length == 0) {
                    alert("select some roles")
                  }
                  else {
                    setChoice({ type: UserChoiceActions.bulk_assign_role })
                    setRole(undefined)
                    setFlag(1)
                  }
                  setAnchorEl(null)
                }}
              > Assign Roles</MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedRoles && selectedRoles.length == 0) {
                    alert("select some roles")
                  }
                  else {
                    setChoice({ type: UserChoiceActions.bulk_assign_role })
                    setRole(undefined)
                    setFlag(0)
                  }
                  setAnchorEl(null)
                }}
              > Remove Roles</MenuItem>
              < MenuItem onClick={handleExcel}
              >Export To Excel</MenuItem>

            </Menu >

          </>
        </Stack >
        <CreateOrEditRoleDialog />
        <AssignRolesDialog roles={selectedRoles} flag={flag} />
      </Stack >
      {/*  table */}
      {isLoading && <TableSkeleton />}
      {!isLoading && MemoData.length == 0 && <div style={{ textAlign: "center", padding: '10px' }}>No Data Found</div>}
      {!isLoading && MemoData.length > 0 &&
        <RolesTable
          role={role}
          selectAll={selectAll}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          setSelectAll={setSelectAll}
          roles={MemoData}
          setRole={setRole}
        />}

    </>

  )

}

