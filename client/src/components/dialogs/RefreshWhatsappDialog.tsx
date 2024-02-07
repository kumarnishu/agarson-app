import { useContext, useEffect, useState } from 'react'
import { socket } from '../../socket'
import QRCode from 'react-qr-code'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { UserChoiceActions, ChoiceContext } from '../../contexts/dialogContext'
import { UserContext } from '../../contexts/userContext'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { GetUsers } from '../../services/UserServices'
import { IUser } from '../../types/user.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { Cancel } from '@mui/icons-material'
import { queryClient } from '../../main'


function RefreshWhatsappDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { user, setUser } = useContext(UserContext)
    const [qrCode, setQrCode] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const [clientid, setClient_id] = useState<string>()

    const { data: usersData } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", async () => GetUsers())


    useEffect(() => {
        if (socket) {
            socket.on("qr", (qr) => {
                setLoading(false)
                setQrCode(qr)
                if (user)
                    setUser({
                        ...user,
                        connected_number: undefined
                    })
                queryClient.invalidateQueries('users')
            })
            socket.on("disconnected_whatsapp", (client_id: string) => {
                setLoading(false)
                setQrCode(undefined)
                if (user?.client_id === client_id)
                    setUser({
                        ...user,
                        connected_number: undefined
                    })
                queryClient.invalidateQueries('users')
            })
            socket.on("ready", (phone) => {
                setLoading(false)
                setQrCode(undefined)
                if (user)
                    setUser({
                        ...user,
                        connected_number: phone
                    })
                queryClient.invalidateQueries('users')
            })
            socket.on("loading", () => {
                setLoading(true)
                setQrCode(undefined)
            })
        }
    }, [user, setUser])
    return (

        <Dialog fullScreen={Boolean(window.screen.width < 500)} open={choice === UserChoiceActions.refresh_whatsapp ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Whatsapp Connections</DialogTitle>

            <DialogContent>

                {user?.assigned_users && user?.assigned_users.length > 0 &&
                    < TextField
                        sx={{ mt: 2 }}
                        size='small'
                        select
                        SelectProps={{
                            native: true,
                        }}
                        onChange={(e) => {
                            setClient_id(e.target.value)
                        }}
                        required
                        id="users"
                        label="Select User"
                        fullWidth
                    >
                        <option key={'00'} value={undefined}>

                        </option>
                        {usersData && usersData.data && usersData.data.map((user, index) => {
                            return (<option key={index} value={user.client_id}>
                                {user.username}
                            </option>)
                        })
                        }
                    </TextField>}

                {clientid && <Button sx={{ mt: 1 }} fullWidth variant="contained" size="large"
                    disabled={Boolean(loading)}
                    onClick={() => {
                        if (user) {
                            socket?.emit("JoinRoom", clientid)
                        }
                        setLoading(true)
                    }}>Check Whatsapp Status
                </Button>}

                <Box sx={{ p: 2 }}>
                    <>
                        {loading && !qrCode ? <h1>Loading ...</h1> : null}
                        {qrCode ?
                            <>
                                <p className='p-2'>logged out ? Scan to login !</p>
                                <QRCode value={qrCode} />
                            </> :
                            null
                        }
                    </>
                </Box>
                <STable >
                    <STableHead >
                        <STableHeadCell style={{ padding: 10 }}>
                            UserName
                        </STableHeadCell>
                        <STableHeadCell style={{ padding: 10 }}>
                            Mobile
                        </STableHeadCell>
                    </STableHead>
                    <STableBody>
                        {usersData && usersData.data && usersData.data.map((user, index) => {
                            if (user.connected_number)
                                return (
                                    <STableRow key={index}>
                                        <STableCell style={{ padding: 10 }}>
                                            {user.username}
                                        </STableCell>
                                        <STableCell style={{ padding: 10 }}>
                                            {user.connected_number.replace("91", "").replace("@c.us", "")}
                                        </STableCell>
                                    </STableRow>
                                )
                        })}
                    </STableBody>
                </STable>
            </DialogContent>
        </Dialog>
    )
}

export default RefreshWhatsappDialog