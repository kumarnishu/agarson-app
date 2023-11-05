import { Stack, Typography, Paper, Box, IconButton } from "@mui/material";
import { ILead, IRemark } from "../../types/crm.types";
import { Delete, Edit } from "@mui/icons-material";
import DeleteRemarkDialog from "../../components/dialogs/crm/DeleteRemarkDialog";
import { useEffect, useState } from "react";



function AllRemarksPage({ lead }: { lead: ILead }) {
    const [display, setDisplay] = useState<boolean>(false)
    const [remark, setRemark] = useState<IRemark>()
    const [remarks, setRemarks] = useState<IRemark[]>(lead.remarks)

    useEffect(() => {
        setRemarks(lead.remarks)
    }, [lead, remarks])

    return (
        <Box>
            <Stack direction={"column"}>
                <Box>
                    <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
                        {lead.remarks.length ? "" : "no remarks yet"}
                    </Typography>
                    {remarks.slice(0).reverse().map((remark, index) => {
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
                                    <Stack direction="row" gap={2}>
                                        <IconButton size="small" color="error" onClick={() => {
                                            setRemark(remark)
                                            setDisplay(true)
                                        }}><Delete /></IconButton>
                                        <IconButton size="small" color="success"><Edit /></IconButton>
                                    </Stack>
                                </Paper>


                            </Stack>

                        )
                    })}
                </Box >
            </Stack >
            {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
        </Box >
    )
}
export default AllRemarksPage

