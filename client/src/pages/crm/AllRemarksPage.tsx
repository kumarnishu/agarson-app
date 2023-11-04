import { Stack, Typography, Paper, Box } from "@mui/material";
import { ILead } from "../../types/crm.types";



function AllRemarksPage({ lead }: { lead: ILead }) {
    return (
        <Box>
            <Stack direction={"column"}>
                <Box>
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

                                    </Typography>
                                    {remark.remind_date && <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Remind date : {new Date(remark.remind_date).toLocaleString()}</Typography>}

                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        Last updated By:<i>{remark.updated_by.username}</i>
                                    </Typography>
                                </Paper>
                            </Stack>
                        )
                    })}
                </Box >
            </Stack >
        </Box >
    )
}
export default AllRemarksPage

