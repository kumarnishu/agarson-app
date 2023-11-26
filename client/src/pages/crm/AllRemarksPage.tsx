import { Stack, Typography, Paper, Box, IconButton } from "@mui/material";
import { ILead, IRemark } from "../../types/crm.types";
import { Delete, Edit } from "@mui/icons-material";
import DeleteRemarkDialog from "../../components/dialogs/crm/DeleteRemarkDialog";
import { useContext, useEffect, useState } from "react";
import UpdateRemarkDialog from "../../components/dialogs/crm/UpdateRemarkDialog";
import { UserContext } from "../../contexts/userContext";


function AllRemarksPage({ lead }: { lead: ILead }) {
    const [display, setDisplay] = useState<boolean>(false)
    const [show, setShow] = useState(false)
    const [remark, setRemark] = useState<IRemark>()
    const [remarks, setRemarks] = useState<IRemark[]>(lead.remarks)
    const { user } = useContext(UserContext)
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)

    useEffect(() => {
        setRemarks(lead.remarks)
    }, [lead, remarks])

    return (
        <>
            <Box>
                <Stack direction={"column"}>
                    <Box>
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
                                        {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <Stack direction="row" gap={2}>
                                            <IconButton size="small" color="error" onClick={() => {
                                                setRemark(remark)
                                                setDisplay(true)
                                            }}><Delete /></IconButton>
                                            <IconButton size="small" color="success"
                                                onClick={() => {
                                                    setRemark(remark)
                                                    setShow(true)
                                                }}
                                            ><Edit /></IconButton>
                                        </Stack>}
                                    </Paper>
                                </Stack>

                            )
                        })}
                    </Box >
                </Stack >
                {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
                {remark && <UpdateRemarkDialog display={show} setDisplay={setShow} remark={remark} />}
            </Box >
        </>
    )
}
export default AllRemarksPage

