import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IChat } from '../../types/chat.types'


type Props = {
    chats: IChat[],
}

function ChatsTable({ chats }: Props) {
    const [data, setData] = useState<IChat[]>(chats)

    useEffect(() => {
        setData(chats)
    }, [chats])

    return (
        <>
            <Box sx={{
                overflow: "scroll",
                height: '73.5vh'
            }}>
                <STable
                >
                    <STableHead
                    >
                        <STableRow>


                            <STableHeadCell
                            >

                                Timestamp

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Sender

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Sender Name

                            </STableHeadCell>


                            <STableHeadCell
                            >

                                Message

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Has Media

                            </STableHeadCell>
                            {/* visitin card */}
                        </STableRow>
                    </STableHead>

                    <STableBody >
                        {

                            data && data.map((chat, index) => {
                                return (
                                    <STableRow
                                        key={index}
                                    >
                                        <STableCell>
                                            {new Date(chat.timestamp).toLocaleString()}
                                        </STableCell>
                                        <STableCell style={{ backgroundColor: chat.isGroup ? "rgba(0,255,0,0.1)" : "whitesmoke" }}>
                                            {chat.id.user || ""}
                                        </STableCell>
                                        <STableCell>
                                            {chat.name}
                                        </STableCell>
                                        <STableCell>
                                            <Typography title={chat.lastMessage.body && chat.lastMessage.body || ""}>
                                                {chat.lastMessage.body && chat.lastMessage.body.slice(0, 50) || ""}
                                            </Typography>
                                        </STableCell>
                                        <STableCell>
                                            {chat.lastMessage.hasMedia ? "Yes" : "no media"}
                                        </STableCell>
                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >

        </>

    )
}

export default ChatsTable