import styled from "styled-components"
import { Stack, Typography, Paper } from "@mui/material";
import { ILead } from "../../types";

const MainContainer = styled.div`

`
const RemarksContainer = styled.div`

`

function AllRemarksPage({ lead }: { lead: ILead }) {
    return (
        <MainContainer>
            <Stack direction={"column"}>
                <RemarksContainer>
                    <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
                        {lead.remarks.length ? "" : "no remarks yet"}
                    </Typography>
                    {lead.remarks.slice(0).reverse().map((remark, index) => {
                        return (
                            <Stack key={index}
                                direction="column"
                            >
                                <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark : <b>{remark.remark}</b>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark Added By:<i>{remark.created_by.username}</i>
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remark Added On : {new Date(remark.created_at).toLocaleString()}
                                    </Typography>  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Last updated By:<i>{remark.updated_by.username}</i>
                                    </Typography>
                                </Paper>
                            </Stack>
                        )
                    })}
                </RemarksContainer >
            </Stack >
        </MainContainer >
    )
}
export default AllRemarksPage

