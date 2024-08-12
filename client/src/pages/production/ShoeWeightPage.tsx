import { Box, Fade, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import DBPagination from '../../components/pagination/DBpagination';
import { BackendError } from '../..'
import { Menu as MenuIcon } from '@mui/icons-material';
import ExportToExcel from '../../utils/ExportToExcel'
import AlertBar from '../../components/snacks/AlertBar'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import TableSkeleton from '../../components/skeleton/TableSkeleton'
import { UserContext } from '../../contexts/userContext'
import { ChoiceContext, ProductionChoiceActions } from '../../contexts/dialogContext'
import { GetShoeWeights } from '../../services/ProductionServices'
import { IShoeWeight } from '../../types/production.types'
import NewShoeWeightDialog from '../../components/dialogs/production/CreateShoeWeightDialog'
import ShoeWeightsTable from '../../components/tables/production/ShoeWeightsTable'


export default function ShoeWeightAdminPage() {
  const { user } = useContext(UserContext)
  const { setChoice } = useContext(ChoiceContext)
  const [users, setUsers] = useState<IUser[]>([])
  const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [filter] = useState<string | undefined>()
  const [weight, setShoeWeight] = useState<IShoeWeight>()
  const [weights, setShoeWeights] = useState<IShoeWeight[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const MemoData = React.useMemo(() => weights, [weights])
  const [preFilteredData, setPreFilteredData] = useState<IShoeWeight[]>([])
  const [preFilteredPaginationData, setPreFilteredPaginationData] = useState({ limit: 100, page: 1, total: 1 });
  const [selectedShoeWeights, setSelectedShoeWeights] = useState<IShoeWeight[]>([])
  const [userId, setUserId] = useState<string>()
  const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
    start_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
    , end_date: moment(new Date().setDate(new Date().getDate()+1)).format("YYYY-MM-DD")
  })
  const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', permission: 'shoe_weight_view', show_assigned_only: true }))

  const { data, isLoading, refetch: ReftechShoeWeights } = useQuery<AxiosResponse<{ weights: IShoeWeight[], page: number, total: number, limit: number }>, BackendError>(["shoe_weights", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetShoeWeights({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

  const [selectedData, setSelectedData] = useState<{
    dye: string,
    article: string,
    machine: string,
    is_validated: boolean,
    month: number,
    shoe_weight1: number,
    shoe_photo1: string,
    weighttime1: string,
    weighttime2: string,
    weighttime3: string,
    upper_weight1: number,
    upper_weight2: number,
    upper_weight3: number,
    shoe_weight2: number,
    shoe_photo2: string,
    shoe_weight3: number,
    shoe_photo3: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
  }[]>()

  const [sent, setSent] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleExcel() {
    setAnchorEl(null)
    try {
      if (selectedData && selectedData.length === 0) {
        alert("select some rows")
      }
      else {
        selectedData && ExportToExcel(selectedData, "weights_data")
        setSent(true)
        setSelectAll(false)
        setSelectedData([])
        setSelectedShoeWeights([])
      }

    }
    catch (err) {
      console.log(err)
      setSent(false)
    }
  }


  // refine data
  useEffect(() => {
    let data: {
      dye: string,
      article: string,
      machine: string,
      is_validated: boolean,
      month: number,
      shoe_weight1: number,
      shoe_photo1: string,
      weighttime1: string,
      weighttime2: string,
      weighttime3: string,
      upper_weight1: number,
      upper_weight2: number,
      upper_weight3: number,
      shoe_weight2: number,
      shoe_photo2: string,
      shoe_weight3: number,
      shoe_photo3: string,
      created_at: string,
      updated_at: string,
      created_by: string,
      updated_by: string
    }[] = []
    selectedShoeWeights.map((weight) => {
      return data.push(
        {
          dye: weight.dye.dye_number.toString(),
          article: weight.article.display_name,
          machine: weight.machine.display_name,
          is_validated: weight.is_validated,
          month: weight.month,
          upper_weight1: weight.upper_weight1,
          shoe_weight1: weight.shoe_weight1,
          shoe_photo1: weight.shoe_photo1 && weight.shoe_photo1?.public_url||'',
          weighttime1: new Date(weight.weighttime1).toLocaleDateString(),
          upper_weight2: weight.upper_weight2,
          shoe_weight2: weight.shoe_weight2,
          shoe_photo2: weight.shoe_photo2 && weight.shoe_photo2?.public_url || '',
          weighttime2: new Date(weight.weighttime2).toLocaleDateString(),
          upper_weight3: weight.upper_weight3,
          shoe_weight3: weight.shoe_weight3,
          shoe_photo3: weight.shoe_photo3 && weight.shoe_photo3?.public_url || '',
          weighttime3: new Date(weight.weighttime3).toLocaleDateString(),
          created_by: weight.created_by.username,
          updated_by: weight.updated_by.username,
          created_at: new Date(weight.created_at).toLocaleDateString(),
          updated_at: new Date(weight.updated_at).toLocaleDateString()
        })
    })
    if (data.length > 0)
      setSelectedData(data)
  }, [selectedShoeWeights])


  useEffect(() => {
    if (isUsersSuccess)
      setUsers(usersData?.data)
  }, [users, isUsersSuccess, usersData])


  useEffect(() => {
    if (!filter) {
      setShoeWeights(preFilteredData)
      setPaginationData(preFilteredPaginationData)
    }
  }, [filter])



  useEffect(() => {
    if (data && !filter) {
      setShoeWeights(data.data.weights)
      setPreFilteredData(data.data.weights)
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
          ShoeWeight 
        </Typography>
        {/* filter dates and person */}
        <Stack direction="row" gap={2}>
          < TextField

            size="small"
            type="date"
            id="start_date"
            label="Start Date"
            fullWidth
            value={dates.start_date}
            focused
            onChange={(e) => {
              if (e.currentTarget.value) {
                setDates({
                  ...dates,
                  start_date: moment(e.target.value).format("YYYY-MM-DD")
                })
              }
            }}
          />
          < TextField

            size="small"
            type="date"
            id="end_date"
            label="End Date"
            focused
            value={dates.end_date}
            fullWidth
            onChange={(e) => {
              if (e.currentTarget.value) {
                setDates({
                  ...dates,
                  end_date: moment(e.target.value).format("YYYY-MM-DD")
                })
              }
            }}
          />
          {user?.assigned_users && user?.assigned_users.length > 0 && < TextField
            focused
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            onChange={(e) => {
              setUserId(e.target.value)
              ReftechShoeWeights()
            }}
            required
            id="weight_owner"
            label="Person"
            fullWidth
          >
            <option key={'00'} value={undefined}>

            </option>
            {
              users.map((user, index) => {

                return (<option key={index} value={user._id}>
                  {user.username}
                </option>)

              })
            }
          </TextField>}
        </Stack>
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
              {user?.assigned_permissions.includes('shoe_weight_create') && < MenuItem

                onClick={() => {
                  setChoice({ type: ProductionChoiceActions.create_shoe_weight })
                }}
              >Add New</MenuItem>}
              {user?.assigned_permissions.includes('shoe_weight_export') && < MenuItem

                onClick={() => {
                  handleExcel()
                }}
              >Export To Excel</MenuItem>}
            </Menu >
            <NewShoeWeightDialog useddyes={weights && weights.map((v) => v.dye._id)} />
          </>
        </Stack >
      </Stack >



      {/* table */}
      {isLoading && <TableSkeleton />}
      {!isLoading &&
        <Box>
          <ShoeWeightsTable
            shoe_weight={weight}
            setShoeWeight={setShoeWeight}
            selectAll={selectAll}
            selectedShoeWeights={selectedShoeWeights}
            setSelectedShoeWeights={setSelectedShoeWeights}
            setSelectAll={setSelectAll}
            shoe_weights={MemoData}
          />
        </Box>}
      <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
    </>

  )

}
