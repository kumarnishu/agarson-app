import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { IChat } from '../../types/chat.types'


type Props = {
    chats: IChat[],
}

function ChatsTable({ chats }: Props) {
    const [data, setData] = useState<IChat[]>(chats)
    let previous_date = new Date()
    let day = previous_date.getDate() - 3
    previous_date.setDate(day)

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
                                    <React.Fragment key={index}>
                                        {chat && chat.timestamp && new Date(Number(chat.timestamp) * 1000) < new Date(previous_date) && chat.lastMessage && chat.lastMessage.fromMe ? null
                                            : <STableRow
                                            >
                                                <STableCell>
                                                    {chat && chat.timestamp && new Date(Number(chat.timestamp) * 1000).toLocaleString()}
                                                </STableCell>
                                                <STableCell style={{ backgroundColor: chat.isGroup ? "rgba(0,255,0,0.1)" : "whitesmoke" }}>
                                                    {chat && chat.id && chat.id.user || ""}
                                                </STableCell>
                                                <STableCell>
                                                    {chat && chat.name}
                                                </STableCell>
                                                <STableCell>
                                                    <Typography style={{ whiteSpace: 'pre-wrap' }} title={chat && chat.lastMessage && chat.lastMessage.body}>
                                                        {chat && chat.lastMessage && chat.lastMessage.body && chat.lastMessage.body.slice(0, 100)}
                                                    </Typography>
                                                </STableCell>
                                                <STableCell>
                                                    {chat && chat.lastMessage && chat.lastMessage.hasMedia ? "Yes" : "no media"}
                                                </STableCell>
                                            </STableRow>
                                        }
                                    </React.Fragment>

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