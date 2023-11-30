import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { Stack } from '@mui/system'
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
                height: '73.5vh'
            }}>
                <STable 
                >
                    <STableHead
                    >
                        <STableRow>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
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
                                            }} />}
                                        label=""
                                    />
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Serial Number
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </STableHeadCell>

                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    GST
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer  Name
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    City
                                </Stack>
                            </STableHeadCell>
                            <STableHeadCell
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Document
                                </Stack>
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
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <STableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >
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
                                                </Stack>
                                            </STableCell>

                                            :
                                            null
                                        }

                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.serial_number}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.mobile}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.gst}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.name}</Typography>
                                        </STableCell>
                                        <STableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.city}</Typography>
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