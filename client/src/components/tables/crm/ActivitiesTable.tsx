import { Box } from '@mui/material'
import {  useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { IRemark } from '../../../types/crm.types'
import { DownloadFile } from '../../../utils/DownloadFile'




type Props = {
    remark: IRemark | undefined
    setRemark: React.Dispatch<React.SetStateAction<IRemark | undefined>>,
    remarks: IRemark[]
}

function ActivitiesTable({  remarks }: Props) {
    const [data, setData] = useState<IRemark[]>(remarks)

    useEffect(() => {
        setData(remarks)
    }, [remarks])
    console.log(remarks)
    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '70vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>

                            <STableHeadCell
                            >

                                Last Remark

                            </STableHeadCell>

                            <STableHeadCell>
                                TimeStamp
                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Stage

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Next Call

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visiting Card Status

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Lead Name

                            </STableHeadCell>




                          

                            <STableHeadCell
                            >

                                Mobile

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Mobile2

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Mobile3

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                City

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                State

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Lead Type

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Lead Owners

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                TurnOver

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Work Description

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Customer Name

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Customer Desigination

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                Refer Party

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Refer Party Mobile

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Refer Date

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Email

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Email2

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Address

                            </STableHeadCell>




                            <STableHeadCell
                            >

                                Remark Source

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Country

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Created At

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Updated At

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Visiting Card

                            </STableHeadCell>
                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((remark, index) => {
                                return (
                                    <STableRow

                                        key={index}
                                    >

                                        <STableCell title={remark.remark}>
                                            {remark.remark.slice(0, 50)}

                                        </STableCell>
                                        <STableCell title={remark.created_at && new Date(remark.created_at).toDateString()}>
                                            {remark.created_at && new Date(remark.created_at).toLocaleTimeString()}

                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.stage}
                                        </STableCell>
                                        <STableCell>
                                            {remark.remind_date?new Date(remark.remind_date).toLocaleDateString():"na"}
                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.has_card ? 'Visiting card available' : "na"}
                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.name}
                                        </STableCell>


                                       


                                        <STableCell>
                                            {remark.lead.mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.alternate_mobile1}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.alternate_mobile2}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.city}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.state}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.lead_type}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead && remark.lead.gst && remark.lead.gst}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.turnover ? remark.lead.turnover : 'na'}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.work_description ? remark.lead.work_description.slice(0, 50) : ""}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.customer_name}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.customer_designation}
                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.referred_party_name && remark.lead.referred_party_name}

                                        </STableCell>
                                        <STableCell>
                                            {remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}

                                        </STableCell>

                                        <STableCell>
                                            {remark.lead.referred_date &&
                                                new Date(remark.lead.referred_date).toLocaleString()
                                            }
                                        </STableCell>



                                        <STableCell>
                                            {remark.lead.email}
                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.alternate_email}
                                        </STableCell>


                                        <STableCell title={remark.lead.address}>
                                            {remark.lead.address ? remark.lead.address.slice(0, 50) : "..."}

                                        </STableCell>





                                        <STableCell>
                                            {remark.lead.lead_source}

                                        </STableCell>


                                        <STableCell>
                                            {remark.lead.country}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(remark.lead.created_at).toLocaleString()}

                                        </STableCell>


                                        <STableCell>
                                            {new Date(remark.lead.updated_at).toLocaleString()}

                                        </STableCell>
                                        <STableCell
                                            title="double click to download"
                                            onDoubleClick={() => {
                                                if (remark.lead.visiting_card && remark.lead.visiting_card?.public_url) {
                                                    DownloadFile(remark.lead.visiting_card.public_url, remark.lead.visiting_card.filename)
                                                }
                                            }}>
                                            <img height="50" width="75" src={remark.lead.visiting_card && remark.lead.visiting_card.public_url} alt="visiting card" />
                                        </STableCell>

                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

        </>
    )
}

export default ActivitiesTable