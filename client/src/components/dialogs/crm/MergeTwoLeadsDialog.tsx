import { Dialog, DialogContent, DialogActions, Typography, IconButton, DialogTitle, Stack } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { ILead } from '../../../types/crm.types'

function MergeTwoLeadsDialog({ leads }: { leads: ILead[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === LeadChoiceActions.merge_leads ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center', minWidth: '350px' }}>Merging Leads</DialogTitle>
            <DialogContent>
                <Stack flexDirection={'row'} gap={3}>
                    <Stack gap={1} flexDirection={'column'}>
                        <div>  <input style={{ paddingRight: '20px' }} type="checkbox" />{leads[0]&&leads[0].mobile}                   </div>
                        <div>  <input style={{ paddingRight: '20px' }} type="checkbox" />{leads[0] &&leads[0].alternate_mobile1}</div>
                    </Stack>
                    <Stack gap={1} flexDirection={'column'}>
                        <div>  <input style={{paddingRight:'20px'}} type="checkbox" />{leads[1]&&leads[1].mobile}                   </div>
                        <div>  <input style={{paddingRight:'20px'}} type="checkbox" />{leads[1]&&leads[1].alternate_mobile1}</div>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Typography
                    variant="button"
                    component="p"
                    sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                </Typography >
            </DialogActions>
        </Dialog>
    )
}

export default MergeTwoLeadsDialog