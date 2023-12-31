import { useContext, useEffect, useState } from 'react'
import { IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box,  DialogTitle,  LinearProgress,  Stack, TextField } from '@mui/material'
import { UserContext } from '../../contexts/userContext'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import RemarksTable from '../../components/tables/RemarksTable'
import DBPagination from '../../components/pagination/DBpagination'

function CrmActivitiesPage() {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 100, page: 1, total: 1 });
    const [remark, setRemark] = useState<IRemark>()
    const [remarks, setRemarks] = useState<IRemark[]>([])
    const [userId, setUserId] = useState<string>()
    const [filterCount, setFilterCount] = useState(0)
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
    })
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())
    const { data, isLoading, refetch: ReftechRemarks } = useQuery<AxiosResponse<{ remarks: IRemark[], page: number, total: number, limit: number }>, BackendError>(["remarks", paginationData, userId, dates?.start_date, dates?.end_date], async () => GetRemarks({ limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))


    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    useEffect(() => {
        if (data) {
            setRemarks(data.data.remarks)
            setPaginationData({
                ...paginationData,
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total
            })
        }
    }, [data])
    console.log(filterCount)
    return (
        <>
            <DialogTitle sx={{ textAlign: 'center' }}> Activities : {remarks.length}</DialogTitle>
            <Stack sx={{ px: 2 }} direction='row' gap={1} pb={1} alignItems={'center'} justifyContent={'center'}>
                < TextField
                    size="small"
                    type="date"
                    id="start_date"
                    label="Start Date"
                    fullWidth
                    focused
                    value={dates.start_date}
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
                    type="date"
                    id="end_date"
                    size="small"
                    label="End Date"
                    value={dates.end_date}
                    focused
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
                {user?.assigned_users && user?.assigned_users.length > 0 && 
                    < TextField
                        select

                        size="small"
                        SelectProps={{
                            native: true,
                        }}
                        onChange={(e) => {
                            setUserId(e.target.value)
                            ReftechRemarks()
                        }}
                        required
                        id="lead_owners"
                        label="Filter Remarks Of Indivdual"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>

                        </option>
                        {
                            users.map((user, index) => {
                                if (!user.crm_access_fields.is_hidden)
                                    return (<option key={index} value={user._id}>
                                        {user.username}
                                    </option>)
                                else
                                    return null
                            })
                        }
                    </TextField>}
            </Stack>
            <>
                {isLoading && <LinearProgress />}
                {!isLoading &&
                    <Box sx={{ px: 2 }}> <RemarksTable remark={remark} remarks={remarks} setRemark={setRemark} /></Box>
                }
            </>
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} setFilterCount={setFilterCount} />
        </>
    )
}

export default CrmActivitiesPage