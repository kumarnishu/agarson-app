import { useContext } from 'react'
import { UserChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { Button } from '@mui/material'
import RefreshWhatsappDialog from '../dialogs/RefreshWhatsappDialog'

function RefreshWhatsappButton() {
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    return (
        <>

            <Button variant="text" onClick={() => {
                setChoice({ type: UserChoiceActions.refresh_whatsapp })
            }}
            >
                {user && user.connected_number ?
                    <img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/whatsapp.png" alt="whatsapp" />

                    :
                    <img height="30" width="30" className="m-1" alt="icon" src="https://img.icons8.com/external-tal-revivo-tritone-tal-revivo/64/external-whatsapp-messenger-cross-platform-mobile-devices-messaging-application-logo-tritone-tal-revivo.png" />
                }
            </Button>
            <RefreshWhatsappDialog />
        </>

    )

}

export default RefreshWhatsappButton