import { Dialog, DialogContent, IconButton, DialogTitle, Stack } from '@mui/material'
import { useContext, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel} from '@mui/icons-material'
import { ILead, IRemark } from '../../../types/crm.types'
import DeleteRemarkDialog from './DeleteRemarkDialog'
import CreateOrEditRemarkDialog from './CreateOrEditRemarkDialog'
import { UserContext } from '../../../contexts/userContext'
import { toTitleCase } from '../../../utils/TitleCase'


function ViewRemarksDialog({ lead }: { lead: ILead }) {
    const [display, setDisplay] = useState<boolean>(false)
    const [display2, setDisplay2] = useState<boolean>(false)
    const { choice, setChoice } = useContext(ChoiceContext)
    const [remark, setRemark] = useState<IRemark>()
    const { user } = useContext(UserContext)
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.view_remarks ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Remarks history</DialogTitle>
            <DialogContent>
                <Stack direction="column" gap={2} >
                    {lead.remarks.reverse().map((item, index) => {
                        return (

                          <>
                                <div key={index} style={{ borderRadius: '1px 10px', padding: '10px', background: 'whitesmoke', paddingLeft: '20px', border: '1px solid grey' }}>
                                    <p>{toTitleCase(item.created_by.username)} : {item.remark} </p>
                                    <p>{item.remind_date && `Remind Date : ${new Date(item.remind_date).toLocaleDateString() }`} </p>
                                    <br></br>
                                    <p>{new Date(item.created_at).toLocaleString()}</p>
                                    {
                                        user && item.remark && user?.username === item.created_by.username && new Date(item.created_at) > new Date(previous_date) && <Stack justifyContent={'end'} direction="row" gap={0} pt={2}>
                                            {user?.assigned_permissions.includes('reminders_delete') &&<IconButton size="small" color="error" onClick={() => {
                                                setRemark(item)
                                                setDisplay(true)
                                            }}>
                                                Delete</IconButton>}
                                    {user?.assigned_permissions.includes('reminders_edit')&& <IconButton size="small" color="success"
                                                onClick={() => {
                                                    setRemark(item)
                                                    setDisplay2(true)
                                                    
                                                }}
                                            >Edit</IconButton>}
                                        </Stack>
                                    }
                                </div>
                               
                          </>
                        )
                    })}
                </Stack>
                {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
                {remark && <CreateOrEditRemarkDialog remark={remark} display={display2} setDisplay={setDisplay2} />}
            </DialogContent>

        </Dialog>
    )
}

export default ViewRemarksDialog