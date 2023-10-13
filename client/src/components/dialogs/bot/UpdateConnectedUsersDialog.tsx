import { useContext, useEffect, useState } from "react";
import { BotChoiceActions, ChoiceContext } from "../../../contexts/dialogContext";
import { IFlow } from "../../../types/bot.types";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import UpdateConnectedUserForm from "../../forms/bot/UpdateConnectedUserForm";
import { Cancel } from "@mui/icons-material";



function UpdateConnectedUsersDialog({ selectedFlow }: { selectedFlow: IFlow }) {
    const [flow, setFlow] = useState<IFlow | undefined>(selectedFlow)
    const { choice, setChoice } = useContext(ChoiceContext)

    useEffect(() => {
        setFlow(selectedFlow)
    }, [selectedFlow])
    return (

        <Dialog open={choice === BotChoiceActions.update_connected_users ? true : false}
            onClose={() => setChoice({ type: BotChoiceActions.close_bot })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: BotChoiceActions.close_bot })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px', textAlign: 'center' }}>Connections</DialogTitle>
            <DialogContent>
                {flow && <UpdateConnectedUserForm flow={flow} />}
            </DialogContent>
        </Dialog>
    )
}

export default UpdateConnectedUsersDialog