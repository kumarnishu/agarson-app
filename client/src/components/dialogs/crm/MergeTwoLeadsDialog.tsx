import { Dialog, DialogContent, DialogActions,  IconButton, DialogTitle, Stack, Checkbox, Button } from '@mui/material'
import { useContext } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { ILead } from '../../../types/crm.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'

function MergeTwoLeadsDialog({ leads }: { leads: ILead[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog fullScreen
            open={choice === LeadChoiceActions.merge_leads ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center', minWidth: '350px' }}>{`Merging 1<-2 `}</DialogTitle>
            <DialogContent>
                <Stack flexDirection={'row'} gap={3}>
                    <STable
                    >
                        <STableHead
                        >
                            <STableRow>
                                <STableHeadCell style={{ width: '50px' }}
                                >


                                    <Checkbox sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />

                                </STableHeadCell>
                                <STableHeadCell style={{ width: '200px' }}
                                >

                                    Key 

                                </STableHeadCell>
                                <STableHeadCell style={{ width: '200px' }}
                                >

                                    1

                                </STableHeadCell>
                                <STableHeadCell style={{ width: '200px' }}
                                >

                                    2

                                </STableHeadCell>




                            </STableRow>
                        </STableHead>
                        <STableBody >
                            <STableRow
                                key={1}
                            >
                                <STableCell style={{ width: '200px' }}>
                                    <Checkbox sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />
                                </STableCell>
                                <STableCell style={{ width: '200px',fontWeight:'bold' }}>
                                    Name
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[0].name}
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[1].name}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={1}
                            >
                                <STableCell style={{ width: '200px' }}>
                                    <Checkbox sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />
                                </STableCell>
                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    Mobile
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[0].mobile}
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[1].mobile}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={1}
                            >
                                <STableCell style={{ width: '200px' }}>
                                    <Checkbox sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />
                                </STableCell>
                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    Address
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[0].address.slice(20).toString()}
                                </STableCell>
                                <STableCell style={{ width: '200px' }}>
                                    {leads[1].address.slice(20).toString()}
                                </STableCell>
                            </STableRow>   
                        </STableBody>
                    </STable>
                    
                </Stack>
            </DialogContent>
            <DialogActions>
              <Button fullWidth variant='contained'>
                Save
              </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MergeTwoLeadsDialog