import { IconButton, Stack } from "@mui/material"
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
        <>
            <Stack sx={{bottom: 0, width: '100vw', bgcolor: 'white', right: 0 }} direction={'row'} justifyContent={'space-evenly'} p={1}>
                <Stack direction={'row'}
                    spacing={2}
                    px={2}
                    justifyContent="center" alignItems={"center"}
                >
                    <label htmlFor="records">Show</label>
                    <select id="records"
                        style={{ width: '70px' }}
                        value={paginationData.limit}
                        onChange={(e) => {
                            setPaginationData({
                                ...paginationData,
                                limit: Number(e.target.value)

                            })
                        }}
                    >
                        {
                            [100,200,500,1000].map(item => {
                                return (<option key={item} value={item}>
                                    {item}
                                </option>)
                            })
                        }
                    </select>
                    <label> Pages {`${paginationData.page}  Of  ${paginationData.total} `}</label>
                </Stack>
                <Stack
                    spacing={2} direction={"row"}
                    justifyContent="center" alignItems={"center"}>
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
                    <label htmlFor="page">Goto</label>
                    <input type="text" id="page" value={paginationData.page}
                        disabled={paginationData.page == paginationData.total}
                        onChange={(e) => {
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
            </Stack>
        </>

    )
}

export default DBPagination