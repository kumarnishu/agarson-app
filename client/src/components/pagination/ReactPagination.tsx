import { Grid, IconButton, Stack } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from "react";

type Props = {
    reactPaginationData: {
        limit: number;
        page: number;
        total: number;
    }
    setReactPaginationData: React.Dispatch<React.SetStateAction<{
        limit: number;
        page: number;
        total: number;
    }>>,
    data: any[]
}
function ReactPagination({ reactPaginationData, data, setReactPaginationData }: Props) {
    return (
        <Grid sx={{ bgcolor: "whitesmoke" }} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={6} >
                <Stack
                    spacing={2} direction={"row"}
                    justifyContent="center" p={2} alignItems={"center"}
                >
                    <label htmlFor="records">Show Records</label>
                    <select id="records"
                        style={{ width: '55px' }}
                        value={reactPaginationData.limit}
                        onChange={(e) => {
                            setReactPaginationData({
                                ...reactPaginationData,
                                limit: Number(e.target.value),
                                total: Math.ceil(data.length / Number(e.target.value))
                            })
                        }}
                    >
                        {
                            [5, 10, 20, 50, 100,500,1000].map(item => {
                                return (<option key={item} value={item}>
                                    {item}
                                </option>)
                            })
                        }
                    </select>
                    <label> {`Pages ${reactPaginationData.page}  Of  ${reactPaginationData.total}`}</label>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack
                    spacing={2} direction={"row"}
                    justifyContent="center" p={2} alignItems={"center"}>
                    {/* movement */}
                    <IconButton size="small" sx={{ p: 0, m: 0 }}
                        disabled={reactPaginationData.page == 1}
                        onClick={() => {
                            setReactPaginationData({
                                ...reactPaginationData,
                                page: reactPaginationData.page - 1
                            })
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <label htmlFor="page">Goto Page</label>
                    <input type="text" id="page" value={reactPaginationData.page} onChange={(e) => {
                        if (Number(e.target.value) > 0)
                            setReactPaginationData({
                                ...reactPaginationData,
                                page: Number(e.target.value)
                            })
                    }
                    }
                        style={{ width: '40px' }}
                    />
                    <IconButton
                        disabled={reactPaginationData.page == reactPaginationData.total}
                        size="small" sx={{ p: 0, m: 0 }}
                        onClick={() => {
                            setReactPaginationData({
                                ...reactPaginationData,
                                page: reactPaginationData.page + 1
                            })
                        }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default ReactPagination