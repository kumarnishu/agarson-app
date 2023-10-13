import { Box, Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { color1, color2, headColor } from '../../utils/colors'
import { useContext, useEffect, useState } from 'react'
import { DownloadFile } from '../../utils/DownloadFile'
import DeleteAlpsDialog from '../dialogs/alps/DeleteAlpsDialog'
import { Delete } from '@mui/icons-material'
import { AlpsChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { IAlps } from '../../types/alps.types'


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

function AlpsTable({ alp, alps, selectableAlps, setAlp, selectAll, setSelectAll, selectedAlps, setSelectedAlps }: Props) {
    const [data, setData] = useState<IAlps[]>(alps)
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setData(alps)
    }, [alps])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
            }}>
                <Table
                    stickyHeader
                    sx={{ width: "100%" }}
                    size="small">


                    <TableHead
                    >
                        <TableRow>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    <FormControlLabel sx={{ fontSize: 12 }} control={
                                        <Checkbox
                                            indeterminate={selectAll ? true : false}
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
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Actions
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Serial Number
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Mobile
                                </Stack>
                            </TableCell>

                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    GST
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Customer  Name
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    City
                                </Stack>
                            </TableCell>
                            <TableCell
                                sx={{ bgcolor: headColor }}                         >
                                <Stack
                                    direction="row"
                                    justifyContent="left"
                                    alignItems="left"
                                    spacing={2}
                                >
                                    Document
                                </Stack>
                            </TableCell>
                            {/* visitin card */}
                        </TableRow>
                    </TableHead>

                    <TableBody >
                        {

                            data && data.map((alp, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: color1 },
                                            '&:nth-of-type(even)': { bgcolor: color2 },
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer' }
                                        }}>
                                        {selectAll ?

                                            <TableCell>
                                                <Stack direction="row"
                                                    spacing={2}
                                                    justifyContent="left"
                                                    alignItems="center"
                                                >

                                                    <Checkbox size="small"
                                                        checked={Boolean(selectAll)}
                                                    />

                                                </Stack>
                                            </TableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <TableCell>
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
                                            </TableCell>

                                            :
                                            null
                                        }
                                        <TableCell>
                                            <Tooltip title="delete">
                                                <IconButton color="error"
                                                    onClick={() => {
                                                        setChoice({ type: AlpsChoiceActions.delete_alps })
                                                        setAlp(alp)
                                                    }}
                                                    disabled={user?._id !== user?.created_by._id}

                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.serial_number}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.mobile}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.gst}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ textTransform: "capitalize" }}>{alp.city}</Typography>
                                        </TableCell>
                                        <TableCell
                                            title="double click to download"
                                            onDoubleClick={() => {
                                                if (alp?.media && alp?.media?.public_url) {
                                                    DownloadFile(alp?.media.public_url, alp?.media.filename)
                                                }
                                            }}>
                                            <img height="50" width="75" src={alp?.media && alp?.media.public_url} alt="Preview Not Available" />
                                        </TableCell>
                                    </TableRow>
                                )
                            })

                        }
                    </TableBody>
                </Table>
            </Box >
            {
                alp ?
                    <>
                        <DeleteAlpsDialog alp={alp} />
                    </> : null
            }
        </>

    )
}

export default AlpsTable