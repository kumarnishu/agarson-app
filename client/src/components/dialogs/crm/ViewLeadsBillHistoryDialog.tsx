import { Dialog, DialogContent, IconButton, DialogTitle, Stack } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { UserContext } from '../../../contexts/userContext'
import { toTitleCase } from '../../../utils/TitleCase'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../../..'
import { GetLeadBillHistory } from '../../../services/LeadsServices'
import DeleteBillDialog from './DeleteBillDialog'
import { GetBillDto } from '../../../dtos/crm/crm.dto'
import CreateOrEditBillDialog from './CreateOrEditBillDialog'


function ViewLeadsBillHistoryDialog({ id }: { id: string }) {
    const [display, setDisplay] = useState<boolean>(false)
    const [display2, setDisplay2] = useState<boolean>(false)
    const { choice, setChoice } = useContext(ChoiceContext)
    const [bill, setBill] = useState<GetBillDto>()
    const [bills, setBills] = useState<GetBillDto[]>()

    const { data, isSuccess } = useQuery<AxiosResponse<[]>, BackendError>(["bills", id], async () => GetLeadBillHistory({ id: id }))


    const { user } = useContext(UserContext)
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)

    useEffect(() => {
        if (isSuccess && data)
            setBills(data?.data)
    }, [isSuccess, data])

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.view_bills ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>
                <p>Bills History</p>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" gap={2} >
                    {bills && bills.map((item, index) => {
                        return (

                            <div key={index} style={{ borderRadius: '1px 10px', padding: '10px', background: 'whitesmoke', paddingLeft: '20px', border: '1px solid grey' }}>
                                <p>{toTitleCase(item.bill_no)} - {item.bill_date} </p>
                                <br></br>
                                <p>{new Date(item.created_at).toLocaleString()}</p>
                                {
                                    user && item && user?.username === item.created_by.value && new Date(item.created_at) > new Date(previous_date) && <Stack justifyContent={'end'} direction="row" gap={0} pt={2}>
                                        {user?.assigned_permissions.includes('delete_lead_bills') && <IconButton size="small" color="error" onClick={() => {
                                            setBill(item)
                                            setDisplay(true)
                                        }}>
                                            Delete</IconButton>}
                                        {user?.assigned_permissions.includes('edit_lead_bills') && <IconButton size="small" color="success"
                                            onClick={() => {
                                                setBill(item)
                                                setDisplay2(true)

                                            }}
                                        >Edit</IconButton>}
                                    </Stack>
                                }
                            </div>

                        )
                    })}
                </Stack>
                {bill && <DeleteBillDialog display={display} setDisplay={setDisplay} bill={bill} />}
                {bill && <CreateOrEditBillDialog bill={bill} display={display2} setDisplay={setDisplay2} />}
            </DialogContent>

        </Dialog>
    )
}

export default ViewLeadsBillHistoryDialog