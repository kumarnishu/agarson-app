import { useContext, useEffect, useState } from 'react'
import { IRemark, IStage } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetAllStages, GetRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, DialogTitle, LinearProgress, MenuItem, Select, Stack, TextField } from '@mui/material'
import { UserContext } from '../../contexts/userContext'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import DBPagination from '../../components/pagination/DBpagination'
import ActivitiesTable from '../../components/tables/crm/ActivitiesTable'
import { toTitleCase } from '../../utils/TitleCase'

function CrmActivitiesReportPage() {
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState<IUser[]>([])
    const [paginationData, setPaginationData] = useState({ limit: 500, page: 1, total: 1 });
    const [stage, setStage] = useState<string>('undefined');
    const [stages, setStages] = useState<IStage[]>([])
    const [remark, setRemark] = useState<IRemark>()
    const [remarks, setRemarks] = useState<IRemark[]>([])
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate() + 1)).format("YYYY-MM-DD")
    })
    const { data: stagedata, isSuccess: stageSuccess } = useQuery<AxiosResponse<IStage[]>, BackendError>("crm_stages", GetAllStages)

    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers({ hidden: 'false', permission: 'crm_menu', show_assigned_only: true }))
    const { data, isLoading, refetch: ReftechRemarks } = useQuery<AxiosResponse<{ remarks: IRemark[], page: number, total: number, limit: number }>, BackendError>(["remarks", stage, paginationData, userId, dates?.start_date, dates?.end_date], async () => GetRemarks({ stage: stage, limit: paginationData?.limit, page: paginationData?.page, id: userId, start_date: dates?.start_date, end_date: dates?.end_date }))

    useEffect(() => {
        if (stageSuccess)
            setStages(stagedata?.data)
    }, [stageSuccess])

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

    return (
        <>
            <DialogTitle sx={{ textAlign: 'center' }}>
                <>
                    <span key={0} style={{ paddingLeft: '10px' }}>Activities : {remarks.length}</span>
                    {stages.map((stage, index) => (
                        <span
                            key={index}
                        >
                            <span key={stage._id} style={{ paddingLeft: '10px' }}>{toTitleCase(stage.stage)} : {remarks.filter((r) => r.lead.stage == stage.stage.toLowerCase()).length || 0}</span>
                        </span>
                    ))}

                </>
            </DialogTitle>
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
                {user?.assigned_users && user?.assigned_users.length > 0 && <Select
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
                        value={'undefined'}
                        onChange={() => setStage('undefined')}
                    >
                        All
                    </MenuItem>
                    {stages.map((stage, index) => (
                        <MenuItem
                            key={index}
                            value={stage.stage}
                        >
                            {toTitleCase(stage.stage)}
                        </MenuItem>
                    ))}
                </Select>}

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

                                return (<option key={index} value={user._id}>
                                    {user.username}
                                </option>)

                            })
                        }
                    </TextField>}
            </Stack>
            <>
                {isLoading && <LinearProgress />}

                {!isLoading && remarks.length > 0 &&
                    <Box sx={{ px: 2 }}> <ActivitiesTable remark={remark} remarks={remarks} setRemark={setRemark} /></Box>
                }
                {!isLoading && remarks.length == 0 && <p style={{ textAlign: 'center' }}>No Activity Found</p>}
            </>
            <DBPagination paginationData={paginationData} setPaginationData={setPaginationData} />
        </>
    )
}

export default CrmActivitiesReportPage