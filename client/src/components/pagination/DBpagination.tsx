import { Grid, IconButton, Stack } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Props = {
    paginationData: {
        limit: number;
        page: number;
        total: number;
    },
    setPaginationData: React.Dispatch<React.SetStateAction<{
        limit: number;
        page: number;
        total: number;
    }>>
}
function DBPagination({ paginationData, setPaginationData }: Props) {
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
                        value={paginationData.limit}
                        onChange={(e) => {
                            setPaginationData({
                                ...paginationData,
                                limit: Number(e.target.value)
                            })
                        }}
                    >
                        {
                            [5, 10, 20, 50, 100, 500, 1000].map(item => {
                                return (<option key={item} value={item}>
                                    {item}
                                </option>)
                            })
                        }
                    </select>
                    <label> {`Pages ${paginationData.page}  Of  ${paginationData.total}`}</label>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack
                    spacing={2} direction={"row"}
                    justifyContent="center" p={2} alignItems={"center"}>
                    {/* movement */}
                    <IconButton size="small" sx={{ p: 0, m: 0 }}
                        disabled={paginationData.page == 1}
                        onClick={() => {
                            setPaginationData({
                                ...paginationData,
                                page: paginationData.page - 1
                            })
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <label htmlFor="page">Goto Page</label>
                    <input type="text" id="page" value={paginationData.page} onChange={(e) => {
                        if (Number(e.target.value) > 0)
                            setPaginationData({
                                ...paginationData,
                                page: Number(e.target.value)
                            })
                    }
                    }
                        style={{ width: '40px' }}
                    />
                    <IconButton
                        disabled={paginationData.page == paginationData.total}
                        size="small" sx={{ p: 0, m: 0 }}
                        onClick={() => {
                            setPaginationData({
                                ...paginationData,
                                page: paginationData.page + 1
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

export default DBPagination