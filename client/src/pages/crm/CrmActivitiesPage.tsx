import { useContext, useEffect, useState } from 'react'
import { ILead, IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetLead, GetRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, Button, DialogTitle, IconButton, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import NewRemarkDialog from '../../components/dialogs/crm/NewRemarkDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import DeleteRemarkDialog from '../../components/dialogs/crm/DeleteRemarkDialog'
import { Delete, Edit } from '@mui/icons-material'
import UpdateRemarkDialog from '../../components/dialogs/crm/UpdateRemarkDialog'
import { UserContext } from '../../contexts/userContext'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'

function CrmActivitiesPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [remarks, setRemarks] = useState<IRemark[]>([])
    const [lead, setLead] = useState<ILead>()
    const [remark, setRemark] = useState<IRemark>()
    const [id, setId] = useState("")
    const [userId, setUserId] = useState<string>()
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)
    const { data, isSuccess, isLoading, refetch: ReftechRemarks } = useQuery<AxiosResponse<IRemark[]>, BackendError>(["remarks", userId], () => GetRemarks(userId))
    const { data: remotelead, isSuccess: isLeadSuccess, refetch } = useQuery<AxiosResponse<ILead>, BackendError>(["lead", id], async () => GetLead(id), { enabled: false })
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [display, setDisplay] = useState<boolean>(false)
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])

    useEffect(() => {
        if (isLeadSuccess)
            setLead(remotelead.data)
    }, [isLeadSuccess, remotelead])

    useEffect(() => {
        refetch()
    }, [id])

    useEffect(() => {
        if (isSuccess)
            setRemarks(data?.data)
    }, [remarks, isSuccess, data])

    return (
        <Box>
            <Stack direction={"column"}>
                <Stack padding={2} gap={2}>
                    <DialogTitle sx={{ textAlign: 'center' }}> Activities : {remarks.length}</DialogTitle>
                    {user?.is_admin &&
                        < TextField
                            select
                            SelectProps={{
                                native: true,
                            }}
                            onChange={(e) => {
                                setUserId(e.target.value)
                                ReftechRemarks()
                            }}
                            required
                            id="lead_owners"
                            label="Lead Owners"
                            fullWidth
                        >
                            <option key={'00'} value={undefined}>
                                View All
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
                <Box>
                    <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>{
                        isLoading && <LinearProgress />
                    }
                    </Typography>
                    {remarks && remarks.map((remark, index) => {
                        return (
                            <Stack key={index}
                                direction="column"
                            >
                                <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Lead : <b>{remark.lead && remark.lead.name}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Lead Phone : <b>{remark.lead && remark.lead.mobile}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Lead Address : <b>{remark.lead && remark.lead.address}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Lead Owners : <b>{remark.lead.lead_owners.map((owner) => { return owner.username }).toString() || "NA"}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark : <b>{remark.remark}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark Added By : <b>{remark.created_by.username}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark Added On : {new Date(remark.created_at).toLocaleString()}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remind date : <b>{new Date(remark.remind_date).toLocaleString()}</b>
                                    </Typography>
                                    <Stack direction={'row'} gap={2}>
                                        <Button onClick={() => {
                                            setId(remark.lead._id)
                                            setChoice({ type: LeadChoiceActions.add_remark })
                                        }}>Add Remark</Button>
                                        <Button onClick={() => {
                                            setId(remark.lead._id)
                                            setChoice({ type: LeadChoiceActions.view_remarks })
                                        }}>View Remarks</Button>
                                        {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="error" onClick={() => {
                                            setRemark(remark)
                                            setChoice({ type: LeadChoiceActions.delete_remark })
                                        }}><Delete /></IconButton>}
                                        {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="success" onClick={() => {
                                            setRemark(remark)
                                            setChoice({ type: LeadChoiceActions.update_remark })
                                        }}><Edit /></IconButton>}
                                    </Stack>
                                </Paper>
                            </Stack>
                        )
                    })}
                </Box >
                {lead ?
                    <>
                        <NewRemarkDialog lead={lead} />
                        <ViewRemarksDialog lead={lead} />
                    </> : null
                }
                {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
                {remark && <UpdateRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
            </Stack >
        </Box >
    )
}

export default CrmActivitiesPage