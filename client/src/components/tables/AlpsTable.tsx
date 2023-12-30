import { Box, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { DownloadFile } from '../../utils/DownloadFile'
import { IAlps } from '../../types/alps.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'


type Props = {
    alp: IAlps | undefined
    setAlp: React.Dispatch<React.SetStateAction<IAlps | undefined>>,
    alps: IAlps[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedAlps: IAlps[]
    setSelectedAlps: React.Dispatch<React.SetStateAction<IAlps[]>>,
    selectableAlps: IAlps[]
}

function AlpsTable({ alps, selectableAlps, setAlp, selectAll, setSelectAll, selectedAlps, setSelectedAlps }: Props) {
    const [data, setData] = useState<IAlps[]>(alps)

    useEffect(() => {
        setData(alps)
    }, [alps])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '75vh'
            }}>
                <STable 
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >
                               
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
                                            checked={Boolean(selectAll)}
                                            size="small" onChange={(e) => {
                                                if (e.currentTarget.checked) {
                                                    setSelectedAlps(selectableAlps)
                                                    setSelectAll(true)
                                                }
                                                if (!e.currentTarget.checked) {
                                                    setSelectedAlps([])
                                                    setSelectAll(false)
                                                }
                                            }} />
                               
                            </STableHeadCell>

                            <STableHeadCell
                            >
                               
                                    Serial Number
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               
                                    Mobile
                               
                            </STableHeadCell>

                            <STableHeadCell
                            >
                               
                                    GST
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               
                                    Customer  Name
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               
                                    City
                               
                            </STableHeadCell>
                            <STableHeadCell
                            >
                               
                                    Document
                               
                            </STableHeadCell>
                            {/* visitin card */}
                        </STableRow>
                    </STableHead>

                    <STableBody >
                        {

                            data && data.map((alp, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        {selectAll ?

                                            <STableCell>
                                             

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                               
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <STableCell>
                                             
                                                    <Checkbox size="small"
                                                        onChange={(e) => {
                                                            setAlp(alp)
                                                            if (e.target.checked) {
                                                                setSelectedAlps([...selectedAlps, alp])
                                                            }
                                                            if (!e.target.checked) {
                                                                setSelectedAlps((alps) => alps.filter((item) => {
                                                                    return item._id !== alp._id
                                                                }))
                                                            }
                                                        }}
                                                    />
                                               
                                            </STableCell>

                                            :
                                            null
                                        }

                                        <STableCell>
                                           {alp.serial_number}
                                        </STableCell>
                                        <STableCell>
                                           {alp.mobile}
                                        </STableCell>
                                        <STableCell>
                                           {alp.gst}
                                        </STableCell>
                                        <STableCell>
                                           {alp.name}
                                        </STableCell>
                                        <STableCell>
                                           {alp.city}
                                        </STableCell>
                                        <STableCell
                                            title="double click to download"
                                            onDoubleClick={() => {
                                                if (alp?.media && alp?.media?.public_url) {
                                                    DownloadFile(alp?.media.public_url, alp?.media.filename)
                                                }
                                            }}>
                                            <img height="50" width="75" src={alp?.media && alp?.media.public_url} alt="Preview Not Available" />
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

export default AlpsTable